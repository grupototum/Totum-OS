import { motion } from 'framer-motion';
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@iconify/react';
import type { Agent } from '@/hooks/useAgents';
import { classifyAgent } from '@/hooks/useAgentClassification';

interface AgentHierarchyProps {
  agents: Agent[];
  onAgentClick?: (agent: Agent) => void;
  selectedAgentId?: string;
}

interface HierarchyNode {
  agent: Agent;
  children: HierarchyNode[];
}

export function AgentHierarchy({ agents, onAgentClick, selectedAgentId }: AgentHierarchyProps) {
  // Build hierarchy tree
  const buildHierarchy = (): HierarchyNode[] => {
    const agentMap = new Map<string, Agent>();
    agents.forEach(agent => agentMap.set(agent.id, agent));

    const rootNodes: HierarchyNode[] = [];
    const childrenMap = new Map<string, Agent[]>();

    // Group children by parent
    agents.forEach(agent => {
      if (agent.parent_id) {
        const siblings = childrenMap.get(agent.parent_id) || [];
        siblings.push(agent);
        childrenMap.set(agent.parent_id, siblings);
      }
    });

    // Build tree recursively
    const buildNode = (agent: Agent): HierarchyNode => ({
      agent,
      children: (childrenMap.get(agent.id) || []).map(buildNode),
    });

    // Find root nodes (orchestrators or no parent)
    agents.forEach(agent => {
      if (!agent.parent_id || agent.is_orchestrator) {
        rootNodes.push(buildNode(agent));
      }
    });

    // If no roots found, show all as flat
    if (rootNodes.length === 0 && agents.length > 0) {
      return agents.map(agent => ({ agent, children: [] }));
    }

    return rootNodes;
  };

  const hierarchy = buildHierarchy();

  return (
    <div className="w-full">
      <HierarchyLevel 
        nodes={hierarchy} 
        level={0} 
        onAgentClick={onAgentClick}
        selectedAgentId={selectedAgentId}
      />
    </div>
  );
}

interface HierarchyLevelProps {
  nodes: HierarchyNode[];
  level: number;
  onAgentClick?: (agent: Agent) => void;
  selectedAgentId?: string;
}

function HierarchyLevel({ nodes, level, onAgentClick, selectedAgentId }: HierarchyLevelProps) {
  if (nodes.length === 0) return null;

  const isRoot = level === 0;
  
  return (
    <div className={`${isRoot ? '' : 'ml-8 pl-6 border-l border-stone-300'}`}>
      <div className={`grid gap-4 ${isRoot ? 'grid-cols-1' : 'grid-cols-1'}`}>
        {nodes.map((node, index) => (
          <HierarchyItem
            key={node.agent.id}
            node={node}
            level={level}
            index={index}
            onAgentClick={onAgentClick}
            isSelected={selectedAgentId === node.agent.id}
            selectedAgentId={selectedAgentId}
          />
        ))}
      </div>
    </div>
  );
}

interface HierarchyItemProps {
  node: HierarchyNode;
  level: number;
  index: number;
  onAgentClick?: (agent: Agent) => void;
  isSelected?: boolean;
  selectedAgentId?: string;
}

function HierarchyItem({ node, level, index, onAgentClick, isSelected, selectedAgentId }: HierarchyItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const { agent, children } = node;
  const classification = classifyAgent(agent.name);
  const hasChildren = children.length > 0;

  const statusColors = {
    online: 'bg-emerald-500',
    offline: 'bg-stone-400',
    idle: 'bg-amber-500',
    maintenance: 'bg-red-500',
  };

  const isNew = (() => {
    const created = new Date(agent.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  })();

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1, duration: 0.4 }}
      >
        <Card 
          className={`
            cursor-pointer transition-all duration-300
            ${isSelected 
              ? 'bg-white border-stone-900 shadow-lg' 
              : 'bg-[#EAEAE5] border-stone-300 hover:bg-white hover:border-stone-400'
            }
          `}
          onClick={() => onAgentClick?.(agent)}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              {/* Expand button */}
              {hasChildren && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(!isExpanded);
                  }}
                  className="w-6 h-6 rounded-full bg-stone-200 hover:bg-stone-300 flex items-center justify-center transition-colors"
                >
                  <Icon 
                    icon="solar:alt-arrow-down-linear" 
                    className={`w-4 h-4 text-stone-600 transition-transform ${isExpanded ? '' : '-rotate-90'}`}
                  />
                </button>
              )}
              {!hasChildren && <div className="w-6" />}

              {/* Avatar */}
              <div className="relative">
                <div className={`
                  rounded-full flex items-center justify-center border-2
                  ${agent.is_orchestrator 
                    ? 'w-14 h-14 text-2xl border-stone-900 bg-stone-100' 
                    : 'w-11 h-11 text-lg border-stone-300 bg-stone-200'
                  }
                `}>
                  {agent.emoji}
                </div>
                <span className={`
                  absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-[#EAEAE5]
                  ${statusColors[agent.status]}
                `} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className={`
                    font-medium text-stone-900 truncate
                    ${agent.is_orchestrator ? 'text-base' : 'text-sm'}
                  `}>
                    {agent.name}
                  </h4>
                  {isNew && (
                    <Badge className="bg-stone-900 text-white text-[9px] uppercase tracking-wider hover:bg-stone-800">
                      New
                    </Badge>
                  )}
                  {agent.is_orchestrator && (
                    <Badge variant="outline" className="text-[9px] uppercase tracking-wider border-amber-400 text-amber-600">
                      <Icon icon="solar:crown-linear" className="w-3 h-3 mr-1" />
                      Orquestrador
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-stone-500 truncate">{agent.role}</p>
              </div>

              {/* Type badge */}
              <Badge 
                variant="outline" 
                className={`${classification.bgColor} ${classification.color} ${classification.borderColor} text-[10px] uppercase tracking-wider hidden sm:flex`}
              >
                <Icon icon={classification.icon} className="w-3 h-3 mr-1" />
                {classification.label}
              </Badge>

              {/* Stats */}
              <div className="hidden md:flex items-center gap-4 text-xs text-stone-500">
                <span className="flex items-center gap-1">
                  <Icon icon="solar:check-circle-linear" className="w-3.5 h-3.5" />
                  {agent.success_rate || 0}%
                </span>
                <span className="flex items-center gap-1">
                  <Icon icon="solar:task-square-linear" className="w-3.5 h-3.5" />
                  {agent.daily_tasks || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Children */}
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3"
          >
            <HierarchyLevel
              nodes={children}
              level={level + 1}
              onAgentClick={onAgentClick}
              selectedAgentId={selectedAgentId}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
