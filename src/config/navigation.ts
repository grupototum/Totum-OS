/**
 * Navigation Config — Single Source of Truth
 * Used by AppSidebar (desktop) and AppSidebarContent (mobile).
 * Organized into Totum OS semantic workspaces.
 */

import {
  type LucideIcon,
  Bot,
  KanbanSquare,
  GitBranch,
  CheckSquare,
  Building2,
  Contact,
  UserPlus,
  BookMarked,
  Cpu,
  Terminal,
  Settings,
  LayoutTemplate,
  UserCog,
  Network,
  ShieldCheck,
  Brain,
  FileText,
  BookOpen,
  Lightbulb,
  Cloud,
  Library,
  Home,
  MessageSquareText,
  WandSparkles,
  Workflow,
  Link2,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: "approvals" | null;
}

export interface NavSubItem {
  label: string;
  path: string;
  icon?: LucideIcon;
  emoji?: string | null;
}

export interface NavSection {
  id: string;
  label: string;
  items: NavItem[];
  expandable?: {
    label: string;
    path: string;
    icon: LucideIcon;
    subItems: NavSubItem[];
  };
}

// ─── Totum OS Workspaces ─────────────────────────────────────────────────────

export const navigationSections: NavSection[] = [
  {
    id: "inicio",
    label: "Início",
    items: [
      { label: "Visão Geral", icon: Home, path: "/dashboard" },
      { label: "Escritório", icon: Building2, path: "/office" },
    ],
  },

  {
    id: "command",
    label: "AI Command",
    items: [
      { label: "Command Center", icon: MessageSquareText, path: "/ai-command-center" },
      { label: "Geradores", icon: WandSparkles, path: "/ai-command-center?tab=generators" },
    ],
  },

  {
    id: "agentes",
    label: "Agentes",
    items: [],
    expandable: {
      label: "Agentes",
      path: "/agents",
      icon: Bot,
      subItems: [
        { label: "Painel de Agentes", path: "/agents", icon: Bot },
        { label: "Radar", path: "/ai-command-center?agent=radar", emoji: "🔍" },
        { label: "Gestor", path: "/ai-command-center?agent=gestor", emoji: "📊" },
        { label: "Social", path: "/ai-command-center?agent=social", emoji: "📱" },
        { label: "Atendente", path: "/ai-command-center?agent=atendente", emoji: "🎧" },
        { label: "SDR", path: "/ai-command-center?agent=sdr", emoji: "🤝" },
        { label: "Kimi", path: "/ai-command-center?agent=kimi", emoji: "🤖" },
      ],
    },
  },

  {
    id: "conhecimento",
    label: "Alexandria",
    items: [],
    expandable: {
      label: "Alexandria",
      path: "/alexandria",
      icon: BookOpen,
      subItems: [
        { label: "Hermione", path: "/hermione", icon: Brain },
        { label: "Fontes e Artefatos", path: "/alexandria", icon: Library },
        { label: "Portal POPs", path: "/alexandria/pops", icon: FileText },
        { label: "Contexto", path: "/alexandria/context", icon: BookOpen },
        { label: "Skills", path: "/alexandria/skills", icon: Lightbulb },
        { label: "Conexões", path: "/alexandria/bridges", icon: Link2 },
        { label: "Exportadores IA", path: "/alexandria?tab=exports", icon: GitBranch },
      ],
    },
  },

  {
    id: "fluxos",
    label: "Fluxos",
    items: [],
    expandable: {
      label: "Fluxos e Infra IA",
      path: "/alexandria/openclaw",
      icon: Workflow,
      subItems: [
        { label: "OpenClaw", path: "/alexandria/openclaw", icon: Cloud },
        { label: "Suna Agent", path: "/suna", icon: Cpu },
        { label: "Claude Code", path: "/claude-code", icon: Terminal },
        { label: "Cráudio Codete", path: "/craudio-codete", icon: Cpu },
      ],
    },
  },

  {
    id: "operacoes",
    label: "Operação",
    items: [
      { label: "Tarefas", icon: KanbanSquare, path: "/tasks" },
      { label: "Conteúdo", icon: GitBranch, path: "/content" },
      { label: "Plano de Ação", icon: CheckSquare, path: "/action-plan" },
      { label: "Clientes", icon: Contact, path: "/clients" },
      { label: "Novo Cliente", icon: UserPlus, path: "/new-client" },
    ],
  },

  {
    id: "sistema",
    label: "Sistema",
    items: [
      { label: "Deploy", icon: ShieldCheck, path: "/deployment" },
      { label: "Documentação", icon: BookMarked, path: "/docs" },
      { label: "Configurações", icon: Settings, path: "/settings" },
      { label: "Mapa do Sistema", icon: LayoutTemplate, path: "/diagrama-sistemas" },
      { label: "Operadores", icon: UserCog, path: "/operadores" },
      { label: "Hosting", icon: Network, path: "/hosting" },
      { label: "Aprovações", icon: ShieldCheck, path: "/admin/approvals", badge: "approvals" },
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Flatten all navigation paths for use in things like CommandPalette,
 * route guards, or breadcrumbs.
 */
export function getAllNavPaths(): string[] {
  const paths: string[] = [];
  for (const section of navigationSections) {
    for (const item of section.items) {
      paths.push(item.path);
    }
    if (section.expandable) {
      paths.push(section.expandable.path);
      for (const sub of section.expandable.subItems) {
        paths.push(sub.path);
      }
    }
  }
  return paths;
}

/**
 * Check if a path belongs to a given section id.
 */
export function isPathInSection(path: string, sectionId: string): boolean {
  const section = navigationSections.find((s) => s.id === sectionId);
  if (!section) return false;

  if (section.items.some((i) => i.path === path)) return true;
  if (section.expandable) {
    if (section.expandable.path === path) return true;
    if (section.expandable.subItems.some((s) => s.path === path)) return true;
  }
  return false;
}

/**
 * Get section id for a given path (for active section highlighting).
 */
export function getSectionForPath(path: string): string | null {
  for (const section of navigationSections) {
    if (isPathInSection(path, section.id)) return section.id;
  }
  return null;
}

// ─── Command Palette integration ─────────────────────────────────────────────

export interface CommandPaletteEntry {
  id: string;
  label: string;
  group: string;
  path: string;
  icon: LucideIcon;
}

/**
 * Build CommandPalette entries directly from navigationSections so the palette
 * always stays in sync with the sidebar. Sub-items without a `icon` prop fall
 * back to the parent section's icon.
 */
export function getCommandPaletteEntries(): CommandPaletteEntry[] {
  const entries: CommandPaletteEntry[] = [];

  for (const section of navigationSections) {
    for (const item of section.items) {
      entries.push({
        id: `nav-${item.path}`,
        label: item.label,
        group: section.label,
        path: item.path,
        icon: item.icon,
      });
    }

    if (section.expandable) {
      // Parent entry
      entries.push({
        id: `nav-${section.expandable.path}`,
        label: section.expandable.label,
        group: section.label,
        path: section.expandable.path,
        icon: section.expandable.icon,
      });
      // Sub-items
      for (const sub of section.expandable.subItems) {
        if (sub.path === section.expandable.path) continue; // skip duplicate parent
        entries.push({
          id: `nav-${sub.path}`,
          label: sub.label,
          group: section.label,
          path: sub.path,
          icon: sub.icon || section.expandable.icon,
        });
      }
    }
  }

  return entries;
}
