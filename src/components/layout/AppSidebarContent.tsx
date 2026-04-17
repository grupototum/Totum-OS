/**
 * AppSidebarContent — mobile-only sidebar (always expanded, no collapse toggle).
 * Uses the exact same nav data as AppSidebar.tsx so desktop and mobile stay in sync.
 */
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard,
  Bot,
  KanbanSquare,
  GitBranch,
  Building2,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  UserPlus,
  Contact,
  Shield,
  Sparkles,
  BookOpen,
  CheckSquare,
  Brain,
  FileText,
  Cloud,
  Library,
  Lightbulb,
  Cpu,
  Search,
  UserCog,
  Network,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Nav data — kept in sync with AppSidebar.tsx ──────────────────────────────

const agentsSubItems = [
  { label: "Painel de Agentes", path: "/agents",                emoji: null },
  { label: "Radar",             path: "/agents/radar/chat",     emoji: "🔍" },
  { label: "Gestor",            path: "/agents/gestor/chat",    emoji: "📊" },
  { label: "Social",            path: "/agents/social/chat",    emoji: "📱" },
  { label: "Atendente",         path: "/agents/atendente/chat", emoji: "🎧" },
  { label: "SDR",               path: "/agents/sdr/chat",       emoji: "🤝" },
  { label: "Kimi",              path: "/agents/kimi/chat",      emoji: "🤖" },
];

const alexandriaSubItems = [
  { label: "Hermione",    path: "/hermione",              icon: Brain },
  { label: "Portal POPs", path: "/alexandria/pops",       icon: FileText },
  { label: "Context HUB", path: "/alexandria/context",    icon: BookOpen },
  { label: "Skills",      path: "/alexandria/skills",     icon: Lightbulb },
  { label: "OpenClaw",    path: "/alexandria/openclaw",   icon: Cloud },
  { label: "Biblioteca",  path: "/alexandria",            icon: Library },
  { label: "Suna Agent",  path: "/suna",                  icon: Cpu },
];

const coreItems = [
  { label: "Hub de Agentes",   icon: Sparkles,        path: "/hub" },
  { label: "Dashboard",        icon: LayoutDashboard, path: "/dashboard" },
  { label: "Stark Industries", icon: Shield,          path: "/stark" },
];

const workspaceItems = [
  { label: "Tarefas",           icon: KanbanSquare, path: "/tasks" },
  { label: "Pipeline Conteúdo", icon: GitBranch,    path: "/content" },
  { label: "Plano de Ação",     icon: CheckSquare,  path: "/action-plan" },
  { label: "Escritório",        icon: Building2,    path: "/office" },
];

const clientsItems = [
  { label: "Central de Clientes", icon: Contact,  path: "/clients" },
  { label: "Novo Cliente",        icon: UserPlus, path: "/new-client" },
];

const configItems = [
  { label: "Configurações",   icon: Settings,  path: "/settings" },
  { label: "Time",            icon: Users,     path: "/estrutura-time" },
  { label: "Operadores",      icon: UserCog,   path: "/operadores" },
  { label: "Hosting",         icon: Network,   path: "/hosting" },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  onNavigate?: () => void;
}

export default function AppSidebarContent({ onNavigate }: Props) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedAgents, setExpandedAgents] = useState(true);
  const [expandedAlexandria, setExpandedAlexandria] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const isAgentsActive = () =>
    location.pathname.startsWith("/agents") || location.pathname === "/hub";
  const isAlexandriaActive = () =>
    location.pathname.startsWith("/alexandria") || location.pathname === "/hermione";

  const handleNav = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  const handleLogout = () => {
    signOut();
    navigate("/login");
    onNavigate?.();
  };

  const NavItem = ({ item }: { item: { label: string; icon: React.ElementType; path: string } }) => {
    const active = isActive(item.path);
    return (
      <li>
        <button
          onClick={() => handleNav(item.path)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative",
            active
              ? "bg-sidebar-accent text-primary"
              : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
          )}
        >
          {active && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
          )}
          <item.icon className={cn("w-[18px] h-[18px] shrink-0", active && "text-primary")} />
          <span className="text-[13px] font-medium tracking-wide truncate">{item.label}</span>
        </button>
      </li>
    );
  };

  const SectionLabel = ({ title }: { title: string }) => (
    <p className="font-mono text-[10px] uppercase tracking-widest text-sidebar-foreground/35 mb-2 px-2">
      {title}
    </p>
  );

  return (
    <div className="flex flex-col h-full bg-sidebar">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-sidebar-border shrink-0">
        <div className="flex gap-[3px]">
          <div className="w-[5px] h-6 bg-primary rounded-full" />
          <div className="w-[5px] h-4 bg-primary/60 rounded-full" />
          <div className="w-[5px] h-6 bg-primary rounded-full" />
        </div>
        <span className="font-sans text-lg font-medium text-sidebar-foreground tracking-tight">
          TOTUM
        </span>
      </div>

      {/* ⌘K Search */}
      <div className="px-3 pt-3 pb-1 shrink-0">
        <button
          onClick={() =>
            window.dispatchEvent(
              new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true })
            )
          }
          className="w-full flex items-center gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent/20 px-3 py-2 text-sidebar-foreground/45 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          <Search className="w-3.5 h-3.5 shrink-0" />
          <span className="text-[12px] flex-1 text-left">Buscar ou navegar...</span>
          <kbd className="text-[10px] font-mono opacity-40 border border-sidebar-border rounded px-1 py-0.5">⌘K</kbd>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-5">

        {/* ── CORE ── */}
        <div>
          <SectionLabel title="Core" />
          <ul className="space-y-0.5">
            {coreItems.map((item) => <NavItem key={item.path} item={item} />)}
          </ul>
        </div>

        {/* ── AGENTES (expandable) ── */}
        <div>
          <SectionLabel title="Agentes" />
          <ul className="space-y-0.5">
            <li>
              <div className="flex items-center">
                <button
                  onClick={() => setExpandedAgents(!expandedAgents)}
                  className="p-1 text-sidebar-foreground/35 hover:text-sidebar-foreground shrink-0"
                >
                  {expandedAgents ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => handleNav("/agents")}
                  className={cn(
                    "flex-1 flex items-center gap-2.5 px-2 py-2.5 rounded-lg transition-all duration-200",
                    isAgentsActive()
                      ? "bg-sidebar-accent text-primary"
                      : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <Bot className={cn("w-[18px] h-[18px] shrink-0", isAgentsActive() && "text-primary")} />
                  <span className="text-[13px] font-medium tracking-wide">Agentes</span>
                </button>
              </div>
              {expandedAgents && (
                <ul className="ml-5 pl-3 border-l border-sidebar-border/40 space-y-0.5 mt-0.5">
                  {agentsSubItems.map((sub) => {
                    const subActive = isActive(sub.path);
                    return (
                      <li key={sub.path}>
                        <button
                          onClick={() => handleNav(sub.path)}
                          className={cn(
                            "w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-all duration-200 text-[12px]",
                            subActive
                              ? "bg-sidebar-accent text-primary font-medium"
                              : "text-sidebar-foreground/45 hover:text-sidebar-foreground hover:bg-sidebar-accent/30"
                          )}
                        >
                          {sub.emoji ? (
                            <span className="text-[13px] shrink-0 leading-none">{sub.emoji}</span>
                          ) : (
                            <Bot className="w-3.5 h-3.5 shrink-0" />
                          )}
                          <span className="truncate">{sub.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          </ul>
        </div>

        {/* ── ALEXANDRIA (expandable) ── */}
        <div>
          <SectionLabel title="Alexandria" />
          <ul className="space-y-0.5">
            <li>
              <div className="flex items-center">
                <button
                  onClick={() => setExpandedAlexandria(!expandedAlexandria)}
                  className="p-1 text-sidebar-foreground/35 hover:text-sidebar-foreground shrink-0"
                >
                  {expandedAlexandria ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => handleNav("/alexandria")}
                  className={cn(
                    "flex-1 flex items-center gap-2.5 px-2 py-2.5 rounded-lg transition-all duration-200",
                    isAlexandriaActive()
                      ? "bg-sidebar-accent text-primary"
                      : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <BookOpen className={cn("w-[18px] h-[18px] shrink-0", isAlexandriaActive() && "text-primary")} />
                  <span className="text-[13px] font-medium tracking-wide">Alexandria</span>
                </button>
              </div>
              {expandedAlexandria && (
                <ul className="ml-5 pl-3 border-l border-sidebar-border/40 space-y-0.5 mt-0.5">
                  {alexandriaSubItems.map((sub) => {
                    const subActive = isActive(sub.path);
                    return (
                      <li key={sub.path}>
                        <button
                          onClick={() => handleNav(sub.path)}
                          className={cn(
                            "w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-all duration-200 text-[12px]",
                            subActive
                              ? "bg-sidebar-accent text-primary font-medium"
                              : "text-sidebar-foreground/45 hover:text-sidebar-foreground hover:bg-sidebar-accent/30"
                          )}
                        >
                          <sub.icon className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{sub.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </li>
          </ul>
        </div>

        {/* ── WORKSPACE ── */}
        <div>
          <SectionLabel title="Workspace" />
          <ul className="space-y-0.5">
            {workspaceItems.map((item) => <NavItem key={item.path} item={item} />)}
          </ul>
        </div>

        {/* ── CLIENTES ── */}
        <div>
          <SectionLabel title="Clientes" />
          <ul className="space-y-0.5">
            {clientsItems.map((item) => <NavItem key={item.path} item={item} />)}
          </ul>
        </div>

        {/* ── CONFIG ── */}
        <div>
          <SectionLabel title="Config" />
          <ul className="space-y-0.5">
            {configItems.map((item) => <NavItem key={item.path} item={item} />)}
          </ul>
        </div>

      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-semibold uppercase shrink-0">
            {user?.email?.[0] || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-medium text-sidebar-foreground truncate">
              {user?.email?.split("@")[0] || "User"}
            </p>
            <p className="text-[10px] text-sidebar-foreground/35 truncate">{user?.email || ""}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-1.5 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors"
            title="Sair"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
