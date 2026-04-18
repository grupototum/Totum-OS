/**
 * Navigation Config — Single Source of Truth
 * Used by AppSidebar (desktop) and AppSidebarContent (mobile).
 * Organized into 5 PT-BR semantic pillars.
 */

import {
  type LucideIcon,
  LayoutDashboard,
  Bot,
  Sparkles,
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
  Users,
  UserCog,
  Network,
  ShieldCheck,
  Brain,
  FileText,
  BookOpen,
  Lightbulb,
  Cloud,
  Library,
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

// ─── 5 Pilares PT-BR ─────────────────────────────────────────────────────────

export const navigationSections: NavSection[] = [
  // ── 1. VISÃO ──
  {
    id: "visao",
    label: "Visão",
    items: [
      { label: "Hub de Agentes", icon: Sparkles, path: "/hub" },
      { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    ],
  },

  // ── 2. AGENTES ──
  {
    id: "agentes",
    label: "Agentes",
    items: [],
    expandable: {
      label: "Agentes",
      path: "/agents",
      icon: Bot,
      subItems: [
        { label: "Painel de Agentes", path: "/agents", emoji: null },
        { label: "Radar", path: "/agents/radar/chat", emoji: "🔍" },
        { label: "Gestor", path: "/agents/gestor/chat", emoji: "📊" },
        { label: "Social", path: "/agents/social/chat", emoji: "📱" },
        { label: "Atendente", path: "/agents/atendente/chat", emoji: "🎧" },
        { label: "SDR", path: "/agents/sdr/chat", emoji: "🤝" },
        { label: "Kimi", path: "/agents/kimi/chat", emoji: "🤖" },
      ],
    },
  },

  // ── 3. CONHECIMENTO ──
  {
    id: "conhecimento",
    label: "Conhecimento",
    items: [],
    expandable: {
      label: "Alexandria",
      path: "/alexandria",
      icon: BookOpen,
      subItems: [
        { label: "Hermione", path: "/hermione", icon: Brain },
        { label: "Portal POPs", path: "/alexandria/pops", icon: FileText },
        { label: "Context HUB", path: "/alexandria/context", icon: BookOpen },
        { label: "Skills", path: "/alexandria/skills", icon: Lightbulb },
        { label: "OpenClaw", path: "/alexandria/openclaw", icon: Cloud },
        { label: "Biblioteca", path: "/alexandria", icon: Library },
        { label: "Suna Agent", path: "/suna", icon: Cpu },
      ],
    },
  },

  // ── 4. OPERAÇÕES ──
  {
    id: "operacoes",
    label: "Operações",
    items: [
      { label: "Tarefas", icon: KanbanSquare, path: "/tasks" },
      { label: "Pipeline Conteúdo", icon: GitBranch, path: "/content" },
      { label: "Plano de Ação", icon: CheckSquare, path: "/action-plan" },
      { label: "Escritório", icon: Building2, path: "/office" },
      { label: "Central de Clientes", icon: Contact, path: "/clients" },
      { label: "Novo Cliente", icon: UserPlus, path: "/new-client" },
    ],
  },

  // ── 5. SISTEMA ──
  {
    id: "sistema",
    label: "Sistema",
    items: [
      { label: "Documentação", icon: BookMarked, path: "/docs" },
      { label: "Cráudio Codete", icon: Cpu, path: "/craudio-codete" },
      { label: "Claude Code", icon: Terminal, path: "/claude-code" },
      { label: "Configurações", icon: Settings, path: "/settings" },
      { label: "Time", icon: Users, path: "/estrutura-time" },
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
