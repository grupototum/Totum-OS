import { motion } from 'framer-motion';
import { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import type { Agent } from '@/hooks/useAgents';

interface AgentGraphProps {
  agents: Agent[];
  onAgentClick?: (agent: Agent) => void;
  selectedAgentId?: string;
}

// ── Layout constants ────────────────────────────────────────────────
const NW = 136;   // node width
const NH = 76;    // node height
const HG = 28;    // horizontal gap between sibling subtrees
const VG = 72;    // vertical gap between levels
const CW = 120;   // virtual category node width
const CH = 36;    // virtual category node height

// ── Status colours ──────────────────────────────────────────────────
const STATUS: Record<string, string> = {
  online: '#10B981',
  idle: '#F59E0B',
  offline: '#A8A29E',
  maintenance: '#EF4444',
};

// ── Tree node types ─────────────────────────────────────────────────
interface TreeNode {
  id: string;
  isCategory: boolean;
  label: string;
  agent?: Agent;
  children: string[];
  x: number;
  y: number;
  w: number; // subtree width
}

// ── Build the tree, returning a map of id → TreeNode ────────────────
function buildTree(agents: Agent[]): Map<string, TreeNode> {
  const nodes = new Map<string, TreeNode>();

  // Separate orchestrators, parented agents, and flat agents
  const orchestrators = agents.filter(a => a.is_orchestrator && !a.parent_id);
  const parented      = agents.filter(a => a.parent_id);
  const flat          = agents.filter(a => !a.is_orchestrator && !a.parent_id);

  // Seed real agent nodes (zero x/y — filled in by layout pass)
  for (const a of agents) {
    nodes.set(a.id, { id: a.id, isCategory: false, label: a.name, agent: a, children: [], x: 0, y: 0, w: 0 });
  }

  // Wire parent → child edges
  for (const a of parented) {
    const parentNode = nodes.get(a.parent_id!);
    if (parentNode) parentNode.children.push(a.id);
  }

  // Group flat agents into virtual category nodes
  const catMap = new Map<string, string[]>(); // category → agent ids
  for (const a of flat) {
    const key = a.agent_group || a.category || 'Geral';
    if (!catMap.has(key)) catMap.set(key, []);
    catMap.get(key)!.push(a.id);
  }

  const catIds: string[] = [];
  for (const [cat, ids] of catMap.entries()) {
    const catId = `cat:${cat}`;
    nodes.set(catId, { id: catId, isCategory: true, label: cat, children: ids, x: 0, y: 0, w: 0 });
    catIds.push(catId);
  }

  // Virtual root to hold everything
  const roots: string[] = [
    ...orchestrators.map(a => a.id),
    ...catIds,
  ];

  // Compute subtree widths (post-order)
  function subtreeW(id: string): number {
    const node = nodes.get(id)!;
    const isC = node.isCategory;
    const selfW = isC ? CW : NW;
    if (node.children.length === 0) { node.w = selfW; return selfW; }
    const childTotal = node.children.reduce((s, cid) => s + subtreeW(cid), 0);
    const total = childTotal + HG * (node.children.length - 1);
    node.w = Math.max(selfW, total);
    return node.w;
  }
  for (const r of roots) subtreeW(r);

  // Assign x/y positions (pre-order)
  function layout(id: string, cx: number, y: number) {
    const node = nodes.get(id)!;
    const isC = node.isCategory;
    const selfW = isC ? CW : NW;
    node.x = cx - selfW / 2;
    node.y = y;
    if (node.children.length === 0) return;
    const childVG = isC ? VG * 0.7 : VG;
    const selfH   = isC ? CH : NH;
    const childY  = y + selfH + childVG;
    const childTotal = node.children.reduce((s, cid) => s + nodes.get(cid)!.w, 0)
                     + HG * (node.children.length - 1);
    let startX = cx - childTotal / 2;
    for (const cid of node.children) {
      const cw = nodes.get(cid)!.w;
      layout(cid, startX + cw / 2, childY);
      startX += cw + HG;
    }
  }

  // Position roots side by side
  const rootTotal = roots.reduce((s, r) => s + nodes.get(r)!.w, 0) + HG * (roots.length - 1);
  let rx = -rootTotal / 2;
  for (const r of roots) {
    const rw = nodes.get(r)!.w;
    layout(r, rx + rw / 2, 0);
    rx += rw + HG;
  }

  return nodes;
}

// ── Connection path between two nodes ───────────────────────────────
function connPath(px: number, py: number, pw: number, ph: number,
                  cx: number, cy: number, cw: number): string {
  const sx = px + pw / 2;
  const sy = py + ph;
  const ex = cx + cw / 2;
  const ey = cy;
  const my = (sy + ey) / 2;
  return `M ${sx} ${sy} C ${sx} ${my}, ${ex} ${my}, ${ex} ${ey}`;
}

// ── Component ────────────────────────────────────────────────────────
export function AgentGraph({ agents, onAgentClick, selectedAgentId }: AgentGraphProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan]   = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);

  const nodes = useMemo(() => buildTree(agents), [agents]);
  const nodeList = useMemo(() => [...nodes.values()], [nodes]);

  // Compute bounding box for auto-centering
  const bbox = useMemo(() => {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const n of nodeList) {
      const w = n.isCategory ? CW : NW;
      const h = n.isCategory ? CH : NH;
      minX = Math.min(minX, n.x);
      minY = Math.min(minY, n.y);
      maxX = Math.max(maxX, n.x + w);
      maxY = Math.max(maxY, n.y + h);
    }
    return { minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY };
  }, [nodeList]);

  // SVG viewBox sized to content + padding
  const PAD = 60;
  const vbX = bbox.minX - PAD;
  const vbY = bbox.minY - PAD;
  const vbW = bbox.w + PAD * 2;
  const vbH = bbox.h + PAD * 2;

  const handleMouseDown = (e: React.MouseEvent) => {
    setDrag({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!drag) return;
    setPan({ x: e.clientX - drag.x, y: e.clientY - drag.y });
  };
  const handleMouseUp = () => setDrag(null);
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom(z => Math.max(0.3, Math.min(3, z * (e.deltaY > 0 ? 0.9 : 1.1))));
  };

  const reset = useCallback(() => { setZoom(1); setPan({ x: 0, y: 0 }); }, []);

  // Edges: collect all parent→child pairs
  const edges = useMemo(() => {
    const list: { pid: string; cid: string }[] = [];
    for (const n of nodeList) {
      for (const cid of n.children) {
        list.push({ pid: n.id, cid });
      }
    }
    return list;
  }, [nodeList]);

  const isNew = (a: Agent) => {
    const diff = Date.now() - new Date(a.created_at).getTime();
    return diff < 7 * 86400 * 1000;
  };

  return (
    <div className="relative w-full h-[640px] overflow-hidden bg-[#EAEAE5] rounded-xl border border-stone-300">
      {/* Controls */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <Button variant="outline" size="icon" onClick={() => setZoom(z => Math.min(3, z * 1.2))} className="bg-white/90 border-stone-300">
          <Icon icon="solar:plus-linear" className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={() => setZoom(z => Math.max(0.3, z * 0.8))} className="bg-white/90 border-stone-300">
          <Icon icon="solar:minus-linear" className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={reset} className="bg-white/90 border-stone-300">
          <Icon icon="solar:restart-linear" className="w-4 h-4" />
        </Button>
      </div>

      {/* Agent count */}
      <div className="absolute top-4 left-4 z-10 bg-white/80 rounded-lg border border-stone-300 px-3 py-1.5">
        <span className="text-xs font-mono text-stone-600">{agents.length} agentes</span>
      </div>

      {/* Canvas */}
      <div
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`${vbX} ${vbY} ${vbW} ${vbH}`}
          style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: 'center center', transition: drag ? 'none' : 'transform 0.1s ease' }}
        >
          {/* Edges */}
          <g>
            {edges.map(({ pid, cid }) => {
              const p = nodes.get(pid)!;
              const c = nodes.get(cid)!;
              const pw = p.isCategory ? CW : NW;
              const ph = p.isCategory ? CH : NH;
              const cw = c.isCategory ? CW : NW;
              return (
                <path
                  key={`${pid}-${cid}`}
                  d={connPath(p.x, p.y, pw, ph, c.x, c.y, cw)}
                  fill="none"
                  stroke="#C7C3BF"
                  strokeWidth="1.5"
                  strokeDasharray={p.isCategory ? '4 3' : undefined}
                />
              );
            })}
          </g>

          {/* Nodes */}
          <g>
            {nodeList.map((node, i) => {
              if (node.isCategory) {
                return (
                  <motion.g
                    key={node.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02, duration: 0.3 }}
                    transform={`translate(${node.x}, ${node.y})`}
                  >
                    <rect x="0" y="0" width={CW} height={CH} rx="6" fill="#1C1917" />
                    <text x={CW / 2} y={CH / 2 + 1} textAnchor="middle" dominantBaseline="middle" fontSize="9" fontWeight="700" fill="#FFFFFF" letterSpacing="0.05em">
                      {node.label.toUpperCase().slice(0, 18)}
                    </text>
                    <text x={CW / 2} y={CH / 2 + 11} textAnchor="middle" dominantBaseline="middle" fontSize="7" fill="#A8A29E">
                      {node.children.length} agentes
                    </text>
                  </motion.g>
                );
              }

              const a = node.agent!;
              const selected = selectedAgentId === a.id;
              const statusColor = STATUS[a.status] ?? STATUS.offline;
              const newer = isNew(a);

              return (
                <motion.g
                  key={node.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.015, duration: 0.3 }}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); onAgentClick?.(a); }}
                >
                  {/* Shadow */}
                  <rect x="2" y="3" width={NW} height={NH} rx="8" fill="rgba(0,0,0,0.06)" />

                  {/* Card background */}
                  <rect
                    x="0" y="0" width={NW} height={NH} rx="8"
                    fill={selected ? '#FFFFFF' : '#F7F6F3'}
                    stroke={selected ? '#1C1917' : '#D6D3D1'}
                    strokeWidth={selected ? 2 : 1}
                  />

                  {/* Status bar (left edge) */}
                  <rect x="0" y="0" width="4" height={NH} rx="4" fill={statusColor} />
                  <rect x="0" y="4" width="4" height={NH - 8} fill={statusColor} />

                  {/* Emoji */}
                  <text x="18" y="26" fontSize="14" textAnchor="middle" dominantBaseline="middle">
                    {a.emoji || '🤖'}
                  </text>

                  {/* Name */}
                  <text x="32" y="20" fontSize="10" fontWeight="700" fill="#1C1917">
                    {a.name.length > 14 ? a.name.slice(0, 14) + '…' : a.name}
                  </text>

                  {/* Role */}
                  <text x="32" y="32" fontSize="8" fill="#78716C">
                    {a.role.length > 18 ? a.role.slice(0, 18) + '…' : a.role}
                  </text>

                  {/* Divider */}
                  <line x1="10" y1="44" x2={NW - 10} y2="44" stroke="#E7E5E4" strokeWidth="1" />

                  {/* Stats */}
                  <text x="12" y="58" fontSize="8" fill="#78716C">✓ {a.success_rate ?? 0}%</text>
                  <text x="56" y="58" fontSize="8" fill="#78716C">📋 {a.daily_tasks ?? 0}</text>

                  {/* Status dot */}
                  <circle cx={NW - 12} cy="58" r="4" fill={statusColor} />

                  {/* NEW badge */}
                  {newer && (
                    <>
                      <rect x={NW - 28} y="8" width="22" height="11" rx="5.5" fill="#1C1917" />
                      <text x={NW - 17} y="14" fontSize="6.5" fontWeight="700" fill="#FFFFFF" textAnchor="middle" dominantBaseline="middle">NEW</text>
                    </>
                  )}

                  {/* Orchestrator crown */}
                  {a.is_orchestrator && (
                    <text x={NW - 14} y="22" fontSize="10" textAnchor="middle">👑</text>
                  )}
                </motion.g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg border border-stone-300 p-3 space-y-1.5">
        <p className="text-[10px] font-semibold text-stone-900 uppercase tracking-wider mb-2">Legenda</p>
        {[['#10B981', 'Online'], ['#F59E0B', 'Em espera'], ['#A8A29E', 'Offline'], ['#EF4444', 'Manutenção']].map(([c, l]) => (
          <div key={l} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
            <span className="text-[10px] text-stone-600">{l}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
