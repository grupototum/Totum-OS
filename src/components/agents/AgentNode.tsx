import { motion } from 'framer-motion';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Icon } from '@iconify/react';
import type { Agent } from '@/hooks/useAgents';
import { classifyAgent } from '@/hooks/useAgentClassification';

interface AgentNodeProps {
  agent: Agent;
  onClick?: () => void;
  x: number;
  y: number;
  isSelected?: boolean;
  isConnected?: boolean;
}

export function AgentNode({ 
  agent, 
  onClick, 
  x, 
  y, 
  isSelected = false,
  isConnected = false 
}: AgentNodeProps) {
  const [isHovered, setIsHovered] = useState(false);
  const classification = classifyAgent(agent.name);
  
  const isNew = (() => {
    const created = new Date(agent.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  })();

  const statusColors = {
    online: 'bg-emerald-500',
    offline: 'bg-stone-400',
    idle: 'bg-amber-500',
    maintenance: 'bg-red-500',
  };

  const nodeSize = agent.is_orchestrator ? 'w-40 h-40' : 'w-32 h-32';
  const emojiSize = agent.is_orchestrator ? 'text-4xl' : 'text-2xl';

  return (
    <motion.div
      className="absolute"
      style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Connection glow effect */}
      {isConnected && (
        <div className="absolute inset-0 rounded-full bg-stone-400/20 animate-pulse" 
          style={{ transform: 'scale(1.3)' }} 
        />
      )}

      {/* Node */}
      <button
        onClick={onClick}
        className={`
          relative ${nodeSize} rounded-full flex flex-col items-center justify-center
          border-2 transition-all duration-300 cursor-pointer
          ${isSelected 
            ? 'bg-white border-stone-900 shadow-xl scale-110' 
            : 'bg-[#EAEAE5] border-stone-300 hover:border-stone-500 hover:bg-white hover:shadow-lg'
          }
        `}
      >
        {/* Status indicator */}
        <span className={`
          absolute top-2 right-2 w-3 h-3 rounded-full ring-2 ring-[#EAEAE5]
          ${statusColors[agent.status]}
        `} />

        {/* New badge */}
        {isNew && (
          <span className="absolute -top-1 left-1/2 -translate-x-1/2 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-stone-900 text-white rounded-full">
            New
          </span>
        )}

        {/* Emoji */}
        <span className={`${emojiSize} mb-2`}>{agent.emoji}</span>

        {/* Name */}
        <span className={`
          font-medium text-stone-900 text-center px-2
          ${agent.is_orchestrator ? 'text-sm' : 'text-xs'}
        `}>
          {agent.name}
        </span>

        {/* Role */}
        <span className="text-[10px] text-stone-500 mt-0.5">{agent.role}</span>

        {/* Type icon */}
        <div className={`
          absolute -bottom-2 left-1/2 -translate-x-1/2
          px-2 py-0.5 rounded-full border
          ${classification.bgColor} ${classification.borderColor}
          flex items-center gap-1
        `}>
          <Icon icon={classification.icon} className={`w-3 h-3 ${classification.color}`} />
          <span className={`text-[9px] uppercase tracking-wider ${classification.color}`}>
            {classification.label.slice(0, 4)}
          </span>
        </div>
      </button>

      {/* Hover tooltip */}
      {isHovered && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-1/2 -translate-x-1/2 top-full mt-4 z-50"
        >
          <div className="bg-stone-900 text-white px-4 py-3 rounded-lg shadow-xl whitespace-nowrap">
            <p className="font-medium text-sm">{agent.name}</p>
            <p className="text-xs text-stone-400">{agent.role}</p>
            <div className="flex items-center gap-4 mt-2 pt-2 border-t border-stone-700">
              <span className="text-xs">📊 {agent.daily_tasks || 0} tarefas</span>
              <span className="text-xs">✓ {agent.success_rate || 0}% sucesso</span>
            </div>
          </div>
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-stone-900 rotate-45" />
        </motion.div>
      )}
    </motion.div>
  );
}

// SVG Connector between nodes
interface NodeConnectorProps {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  animated?: boolean;
}

export function NodeConnector({ startX, startY, endX, endY, animated = true }: NodeConnectorProps) {
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  
  // Calculate path for curved connection
  const path = `M ${startX} ${startY} Q ${midX} ${startY} ${midX} ${midY} Q ${midX} ${endY} ${endX} ${endY}`;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
      <defs>
        <linearGradient id="connectorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D6D3D1" />
          <stop offset="100%" stopColor="#78716C" />
        </linearGradient>
        {animated && (
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#78716C" />
          </marker>
        )}
      </defs>
      <motion.path
        d={path}
        fill="none"
        stroke="url(#connectorGradient)"
        strokeWidth="2"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        markerEnd={animated ? "url(#arrowhead)" : undefined}
      />
      {animated && (
        <motion.circle
          r="4"
          fill="#1C1917"
          initial={{ offsetDistance: "0%" }}
          animate={{ offsetDistance: "100%" }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <animateMotion dur="2s" repeatCount="indefinite" path={path} />
        </motion.circle>
      )}
    </svg>
  );
}
