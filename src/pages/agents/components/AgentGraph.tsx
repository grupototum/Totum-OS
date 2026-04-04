import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Icon } from '@iconify/react';
import type { Agent } from '@/hooks/useAgents';
import { classifyAgent } from '@/hooks/useAgentClassification';

interface AgentGraphProps {
  agents: Agent[];
  onAgentClick?: (agent: Agent) => void;
  selectedAgentId?: string;
}

interface GraphNode {
  agent: Agent;
  x: number;
  y: number;
  level: number;
  children: string[];
}

export function AgentGraph({ agents, onAgentClick, selectedAgentId }: AgentGraphProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Build graph structure
  const buildGraph = useCallback((): GraphNode[] => {
    const nodes: GraphNode[] = [];
    const levelWidth = 200;
    const nodeHeight = 120;
    
    // Find root agents (orchestrators or no parent)
    const rootAgents = agents.filter(a => !a.parent_id || a.is_orchestrator);
    
    const processAgent = (agent: Agent, level: number, index: number, parentX?: number): GraphNode => {
      const children = agents.filter(a => a.parent_id === agent.id);
      const siblingsAtLevel = agents.filter(a => {
        if (level === 0) return !a.parent_id || a.is_orchestrator;
        return a.parent_id === agent.parent_id;
      });
      
      const siblingIndex = siblingsAtLevel.findIndex(a => a.id === agent.id);
      const totalSiblings = siblingsAtLevel.length;
      
      // Calculate X position
      let x: number;
      if (level === 0) {
        const totalRoots = rootAgents.length;
        const startX = -((totalRoots - 1) * levelWidth) / 2;
        x = startX + siblingIndex * levelWidth;
      } else {
        const startX = parentX! - ((totalSiblings - 1) * levelWidth) / 2;
        x = startX + siblingIndex * levelWidth;
      }
      
      const y = level * nodeHeight;
      
      return {
        agent,
        x,
        y,
        level,
        children: children.map(c => c.id),
      };
    };

    const processLevel = (agentList: Agent[], level: number, parentX?: number): GraphNode[] => {
      const result: GraphNode[] = [];
      
      agentList.forEach((agent, idx) => {
        const node = processAgent(agent, level, idx, parentX);
        nodes.push(node);
        result.push(node);
        
        const children = agents.filter(a => a.parent_id === agent.id);
        if (children.length > 0) {
          processLevel(children, level + 1, node.x);
        }
      });
      
      return result;
    };

    processLevel(rootAgents, 0);
    return nodes;
  }, [agents]);

  const graphNodes = buildGraph();

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.5, Math.min(2, prev * delta)));
  };

  const statusColors = {
    online: 'bg-emerald-500',
    offline: 'bg-stone-400',
    idle: 'bg-amber-500',
    maintenance: 'bg-red-500',
  };

  // Calculate SVG paths for connections
  const getConnectionPath = (parent: GraphNode, child: GraphNode) => {
    const startX = parent.x + 60; // Center of node
    const startY = parent.y + 40;
    const endX = child.x + 60;
    const endY = child.y;
    
    const midY = (startY + endY) / 2;
    return `M ${startX} ${startY} C ${startX} ${midY}, ${endX} ${midY}, ${endX} ${endY}`;
  };

  return (
    <div className="relative w-full h-[600px] overflow-hidden bg-[#EAEAE5] rounded-lg border border-stone-300">
      {/* Controls */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setZoom(prev => Math.min(2, prev * 1.2))}
          className="bg-white/90 border-stone-300"
        >
          <Icon icon="solar:plus-linear" className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setZoom(prev => Math.max(0.5, prev * 0.8))}
          className="bg-white/90 border-stone-300"
        >
          <Icon icon="solar:minus-linear" className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
          className="bg-white/90 border-stone-300"
        >
          <Icon icon="solar:restart-linear" className="w-4 h-4" />
        </Button>
      </div>

      {/* Graph Canvas */}
      <div
        className="w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <svg
          width="100%"
          height="100%"
          viewBox={`${-400 + pan.x} ${-50 + pan.y} 800 600`}
          className="transition-transform duration-75"
          style={{ transform: `scale(${zoom})` }}
        >
          {/* Connection Lines */}
          <g className="connections">
            {graphNodes.map(node => 
              node.children.map(childId => {
                const childNode = graphNodes.find(n => n.agent.id === childId);
                if (!childNode) return null;
                return (
                  <path
                    key={`${node.agent.id}-${childId}`}
                    d={getConnectionPath(node, childNode)}
                    fill="none"
                    stroke="#D6D3D1"
                    strokeWidth="2"
                    className="transition-all duration-300"
                  />
                );
              })
            )}
          </g>

          {/* Nodes */}
          <g className="nodes">
            {graphNodes.map((node, index) => {
              const classification = classifyAgent(node.agent.name);
              const isSelected = selectedAgentId === node.agent.id;
              const isNew = (() => {
                const created = new Date(node.agent.created_at);
                const now = new Date();
                const diffTime = Math.abs(now.getTime() - created.getTime());
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays <= 7;
              })();

              return (
                <motion.g
                  key={node.agent.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  transform={`translate(${node.x}, ${node.y})`}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAgentClick?.(node.agent);
                  }}
                >
                  {/* Node Card */}
                  <rect
                    x="0"
                    y="0"
                    width="120"
                    height="80"
                    rx="8"
                    fill={isSelected ? '#FFFFFF' : '#F5F5F0'}
                    stroke={isSelected ? '#1C1917' : '#D6D3D1'}
                    strokeWidth={isSelected ? '2' : '1'}
                    className="transition-all duration-300"
                  />
                  
                  {/* Emoji Circle */}
                  <circle
                    cx="25"
                    cy="25"
                    r="14"
                    fill={node.agent.is_orchestrator ? '#1C1917' : '#E7E5E4'}
                    stroke={node.agent.is_orchestrator ? '#1C1917' : '#D6D3D1'}
                    strokeWidth="1"
                  />
                  
                  {/* Status Dot */}
                  <circle
                    cx="35"
                    cy="35"
                    r="4"
                    fill={statusColors[node.agent.status].replace('bg-', '').replace('emerald', '#10B981').replace('stone', '#A8A29E').replace('amber', '#F59E0B').replace('red', '#EF4444')}
                    stroke="#FFFFFF"
                    strokeWidth="1"
                  />

                  {/* Text - Agent Name */}
                  <text
                    x="45"
                    y="22"
                    fontSize="10"
                    fontWeight="600"
                    fill="#1C1917"
                  >
                    {node.agent.name.length > 12 
                      ? node.agent.name.slice(0, 12) + '...' 
                      : node.agent.name
                    }
                  </text>

                  {/* Text - Role */}
                  <text
                    x="45"
                    y="36"
                    fontSize="8"
                    fill="#78716C"
                  >
                    {node.agent.role.length > 15 
                      ? node.agent.role.slice(0, 15) + '...' 
                      : node.agent.role
                    }
                  </text>

                  {/* Stats Row */}
                  <text
                    x="10"
                    y="62"
                    fontSize="8"
                    fill="#78716C"
                  >
                    ✓ {node.agent.success_rate || 0}%
                  </text>
                  
                  <text
                    x="50"
                    y="62"
                    fontSize="8"
                    fill="#78716C"
                  >
                    📋 {node.agent.daily_tasks || 0}
                  </text>

                  {/* New Badge */}
                  {isNew && (
                    <rect
                      x="90"
                      y="55"
                      width="24"
                      height="12"
                      rx="6"
                      fill="#1C1917"
                    />
                  )}
                  {isNew && (
                    <text
                      x="93"
                      y="64"
                      fontSize="7"
                      fill="#FFFFFF"
                    >
                      New
                    </text>
                  )}
                </motion.g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg border border-stone-300 p-3">
        <p className="text-xs font-medium text-stone-900 mb-2">Legenda</p>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-xs text-stone-600">Online</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-xs text-stone-600">Em espera</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-stone-400" />
            <span className="text-xs text-stone-600">Offline</span>
          </div>
        </div>
      </div>
    </div>
  );
}
