/**
 * Navigation Configuration - 4-Pillar Structure
 * Organizes all routes into semantic pillars
 */

export type NavigationPillar = 'agents' | 'knowledge' | 'content' | 'operations';

export interface NavigationItem {
  id: string;
  label: string;
  icon: string; // Lucide icon name
  path: string;
  pillar: NavigationPillar;
  badge?: string | number;
  children?: NavigationItem[];
  requiredRole?: string;
  beta?: boolean;
}

export interface NavigationPillarConfig {
  id: NavigationPillar;
  label: string;
  description: string;
  emoji: string;
  color: string;
  routes: NavigationItem[];
}

// ============================================
// PILLAR 1: AGENTS
// Autonomous agent management and orchestration
// ============================================

const agentsPillar: NavigationPillarConfig = {
  id: 'agents',
  label: 'Agentes',
  description: 'Manage and monitor autonomous agents',
  emoji: '🤖',
  color: 'from-blue-600 to-blue-500',
  routes: [
    {
      id: 'agents-dashboard',
      label: 'Dashboard',
      icon: 'LayoutGrid',
      path: '/agents',
      pillar: 'agents',
    },
    {
      id: 'agents-detail',
      label: 'Agent Detail',
      icon: 'Bot',
      path: '/agents/:agentId',
      pillar: 'agents',
    },
    {
      id: 'agents-chat',
      label: 'Chat',
      icon: 'MessageCircle',
      path: '/agents/:agentId/chat',
      pillar: 'agents',
    },
    {
      id: 'agents-edit',
      label: 'Edit Agent',
      icon: 'Edit2',
      path: '/agents/elizaos/:agentId/edit',
      pillar: 'agents',
    },
  ],
};

// ============================================
// PILLAR 2: KNOWLEDGE
// Alexandria, GILES, context management
// ============================================

const knowledgePillar: NavigationPillarConfig = {
  id: 'knowledge',
  label: 'Conhecimento',
  description: 'Knowledge management and AI context',
  emoji: '📚',
  color: 'from-purple-600 to-purple-500',
  routes: [
    {
      id: 'docs',
      label: 'Documentation',
      icon: 'BookMarked',
      path: '/docs',
      pillar: 'knowledge',
      beta: true,
    },
    {
      id: 'alexandria',
      label: 'Alexandria',
      icon: 'BookOpen',
      path: '/alexandria',
      pillar: 'knowledge',
    },
    {
      id: 'alexandria-pops',
      label: 'POPs Portal',
      icon: 'FileText',
      path: '/alexandria/pops',
      pillar: 'knowledge',
    },
    {
      id: 'alexandria-context',
      label: 'Context Hub',
      icon: 'Zap',
      path: '/alexandria/context',
      pillar: 'knowledge',
    },
    {
      id: 'alexandria-skills',
      label: 'Skills Central',
      icon: 'Lightbulb',
      path: '/alexandria/skills',
      pillar: 'knowledge',
    },
    {
      id: 'hermione-chat',
      label: 'Hermione',
      icon: 'MessageSquare',
      path: '/hermione',
      pillar: 'knowledge',
    },
    {
      id: 'wiki',
      label: 'Wiki',
      icon: 'Globe',
      path: '/wiki',
      pillar: 'knowledge',
    },
  ],
};

// ============================================
// PILLAR 3: CONTENT
// Content creation, pipeline, tasks
// ============================================

const contentPillar: NavigationPillarConfig = {
  id: 'content',
  label: 'Conteúdo',
  description: 'Content creation and workflow',
  emoji: '📝',
  color: 'from-green-600 to-green-500',
  routes: [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'BarChart3',
      path: '/dashboard',
      pillar: 'content',
    },
    {
      id: 'content-pipeline',
      label: 'Pipeline',
      icon: 'GitBranch',
      path: '/content',
      pillar: 'content',
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: 'CheckSquare',
      path: '/tasks',
      pillar: 'content',
      badge: 'updated',
    },
    {
      id: 'hub',
      label: 'Hub',
      icon: 'Home',
      path: '/hub',
      pillar: 'content',
    },
  ],
};

// ============================================
// PILLAR 4: OPERATIONS
// Settings, clients, infrastructure, team
// ============================================

const operationsPillar: NavigationPillarConfig = {
  id: 'operations',
  label: 'Operações',
  description: 'Business operations and infrastructure',
  emoji: '⚙️',
  color: 'from-orange-600 to-orange-500',
  routes: [
    {
      id: 'clients',
      label: 'Clients',
      icon: 'Users',
      path: '/clients',
      pillar: 'operations',
    },
    {
      id: 'new-client',
      label: 'New Client',
      icon: 'UserPlus',
      path: '/new-client',
      pillar: 'operations',
    },
    {
      id: 'team',
      label: 'Team',
      icon: 'Users2',
      path: '/team',
      pillar: 'operations',
    },
    {
      id: 'hosting',
      label: 'Hosting',
      icon: 'Server',
      path: '/hosting',
      pillar: 'operations',
    },
    {
      id: 'stark',
      label: 'Stark Industries',
      icon: 'Zap',
      path: '/stark',
      pillar: 'operations',
      beta: true,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'Settings',
      path: '/settings',
      pillar: 'operations',
    },
  ],
};

// ============================================
// NAVIGATION CONFIG
// ============================================

export const NAVIGATION_PILLARS: NavigationPillarConfig[] = [
  agentsPillar,
  knowledgePillar,
  contentPillar,
  operationsPillar,
];

export const NAVIGATION_BY_PILLAR: Record<NavigationPillar, NavigationPillarConfig> = {
  agents: agentsPillar,
  knowledge: knowledgePillar,
  content: contentPillar,
  operations: operationsPillar,
};

/**
 * Get all routes flattened for route configuration
 */
export function getAllRoutes(): NavigationItem[] {
  return NAVIGATION_PILLARS.flatMap((pillar) => pillar.routes);
}

/**
 * Get routes for a specific pillar
 */
export function getPillarRoutes(pillar: NavigationPillar): NavigationItem[] {
  return NAVIGATION_BY_PILLAR[pillar]?.routes ?? [];
}

/**
 * Find route by path
 */
export function findRouteByPath(path: string): NavigationItem | undefined {
  return getAllRoutes().find((route) => route.path === path);
}
