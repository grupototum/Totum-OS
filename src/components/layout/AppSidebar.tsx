import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Bot,
  KanbanSquare,
  GitBranch,
  Building2,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Menu,
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
  BookMarked,
  Terminal,
  Search,
  UserCog,
  Network,
  Zap,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useSidebarCollapse } from "@/contexts/SidebarContext";
import { supabase } from "@/integrations/supabase/client";

// ─── Sub-items para seções expansíveis ────────────────────────────────────────

const agentsSubItems = [
  { label: "Painel de Agentes", icon: Bot,       path: "/agents",               emoji: null },
  { label: "Radar",             icon: Sparkles,  path: "/agents/radar/chat",    emoji: "🔍" },
  { label: "Gestor",            icon: Sparkles,  path: "/agents/gestor/chat",   emoji: "📊" },
  { label: "Social",            icon: Sparkles,  path: "/agents/social/chat",   emoji: "📱" },
  { label: "Atendente",         icon: Sparkles,  path: "/agents/atendente/chat",emoji: "🎧" },
  { label: "SDR",               icon: Sparkles,  path: "/agents/sdr/chat",      emoji: "🤝" },
  { label: "Kimi",              icon: Sparkles,  path: "/agents/kimi/chat",     emoji: "🤖" },
];

const alexandriaSubItems = [
  { label: "Hermione",     icon: Brain,          path: "/hermione" },
  { label: "Portal POPs",  icon: FileText,        path: "/alexandria/pops" },
  { label: "Context HUB",  icon: BookOpen,        path: "/alexandria/context" },
  { label: "Skills",       icon: Lightbulb,       path: "/alexandria/skills" },
  { label: "OpenClaw",     icon: Cloud,           path: "/alexandria/openclaw" },
  { label: "Biblioteca",   icon: Library,         path: "/alexandria" },
  { label: "Suna Agent",  icon: Cpu,             path: "/suna" },
];

// ─── Seções fixas ─────────────────────────────────────────────────────────────

const coreItems = [
  { label: "Hub de Agentes",   icon: Sparkles,       path: "/hub" },
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

const toolsItems = [
  { label: "Documentação",   icon: BookMarked, path: "/docs" },
  { label: "Cráudio Codete", icon: Cpu,        path: "/craudio-codete" },
  { label: "Claude Code",    icon: Terminal,   path: "/claude-code" },
];

const configItems = [
  { label: "Configurações",   icon: Settings,    path: "/settings" },
  { label: "Time",            icon: Users,       path: "/estrutura-time" },
  { label: "Operadores",      icon: UserCog,     path: "/operadores" },
  { label: "Hosting",         icon: Network,     path: "/hosting" },
  { label: "Aprovações",      icon: ShieldCheck, path: "/admin/approvals" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function AppSidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { collapsed, toggle: toggleCollapsed } = useSidebarCollapse();
  const [expandedAgents, setExpandedAgents] = useState(true);
  const [expandedAlexandria, setExpandedAlexandria] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [pendingApprovals, setPendingApprovals] = useState(0);

  // Busca contagem de aprovações pendentes
  useEffect(() => {
    const fetchPending = async () => {
      const { count } = await (supabase as any)
        .from("user_approvals")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending");
      setPendingApprovals(count || 0);
    };
    fetchPending();
    const interval = setInterval(fetchPending, 60000); // atualiza a cada 1 min
    return () => clearInterval(interval);
  }, []);

  const openCommandPalette = () =>
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }));

  const isActive = (path: string) => location.pathname === path;
  const isAgentsActive  = () => location.pathname.startsWith("/agents") || location.pathname === "/hub";
  const isAlexandriaActive = () =>
    location.pathname.startsWith("/alexandria") || location.pathname === "/hermione";

  const handleNav = (path: string) => {
    if (isNavigating) return;
    setIsNavigating(true);
    navigate(path);
    setTimeout(() => setIsNavigating(false), 300);
  };

  const handleLogout = () => { signOut(); navigate("/login"); };

  // ── helpers ──────────────────────────────────────────────────────────────────

  const NavItem = ({ item, badge }: { item: { label: string; icon: React.ElementType; path: string }; badge?: number }) => {
    const active = isActive(item.path);
    return (
      <li>
        <button
          onClick={() => handleNav(item.path)}
          className={cn(
            "w-full flex items-center gap-3 rounded-lg transition-all duration-200 relative",
            collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5",
            active
              ? "bg-sidebar-accent text-primary"
              : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
          )}
        >
          {active && !collapsed && (
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
          )}
          <div className="relative shrink-0">
            <item.icon className={cn("w-[18px] h-[18px]", active && "text-primary")} />
            {!!badge && collapsed && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[14px] h-[14px] rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center px-0.5">
                {badge > 9 ? "9+" : badge}
              </span>
            )}
          </div>
          {!collapsed && (
            <>
              <span className="text-[13px] font-medium tracking-wide truncate flex-1">{item.label}</span>
              {!!badge && (
                <span className="ml-auto min-w-[18px] h-[18px] rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center px-1 shrink-0">
                  {badge > 9 ? "9+" : badge}
                </span>
              )}
            </>
          )}
        </button>
      </li>
    );
  };

  const SectionLabel = ({ title }: { title: string }) =>
    !collapsed ? (
      <p className="font-mono text-[10px] uppercase tracking-widest text-sidebar-foreground/35 mb-2 px-2">
        {title}
      </p>
    ) : null;

  const ExpandableSection = ({
    label,
    icon: Icon,
    isActive: sectionActive,
    expanded,
    onToggle,
    onNavigate,
    subItems,
  }: {
    label: string;
    icon: React.ElementType;
    isActive: boolean;
    expanded: boolean;
    onToggle: () => void;
    onNavigate: () => void;
    subItems: Array<{ label: string; icon: React.ElementType; path: string; emoji?: string | null }>;
  }) => (
    <li>
      {collapsed ? (
        <button
          onClick={onNavigate}
          className={cn(
            "w-full flex justify-center items-center px-2 py-2.5 rounded-lg transition-all duration-200",
            sectionActive
              ? "bg-sidebar-accent text-primary"
              : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
          )}
        >
          <Icon className="w-[18px] h-[18px]" />
        </button>
      ) : (
        <>
          <div className="flex items-center">
            <button
              onClick={onToggle}
              className="p-1 text-sidebar-foreground/35 hover:text-sidebar-foreground shrink-0"
            >
              {expanded
                ? <ChevronDown className="w-3.5 h-3.5" />
                : <ChevronRight className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={onNavigate}
              className={cn(
                "flex-1 flex items-center gap-2.5 px-2 py-2.5 rounded-lg transition-all duration-200 relative",
                sectionActive
                  ? "bg-sidebar-accent text-primary"
                  : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
              )}
            >
              <Icon className={cn("w-[18px] h-[18px] shrink-0", sectionActive && "text-primary")} />
              <span className="text-[13px] font-medium tracking-wide truncate">{label}</span>
            </button>
          </div>

          {expanded && (
            <ul className="ml-5 pl-3 border-l border-sidebar-border/40 space-y-0.5 mt-0.5">
              {subItems.map((sub) => {
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
                        <sub.icon className="w-3.5 h-3.5 shrink-0" />
                      )}
                      <span className="truncate">{sub.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </li>
  );

  // ── render ────────────────────────────────────────────────────────────────────

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full z-40 flex flex-col border-r border-sidebar-border bg-sidebar/90 backdrop-blur-md transition-all duration-300 ease-in-out",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-5 h-16 border-b border-sidebar-border shrink-0">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="flex gap-[3px]">
              <div className="w-[5px] h-6 bg-primary rounded-full" />
              <div className="w-[5px] h-4 bg-primary/60 rounded-full" />
              <div className="w-[5px] h-6 bg-primary rounded-full" />
            </div>
            <span className="font-sans text-lg font-medium text-sidebar-foreground tracking-tight">
              TOTUM
            </span>
          </div>
        )}
        <button
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground/50 hover:text-sidebar-foreground"
        >
          {collapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* ⌘K Search */}
      <div className={cn("px-3 pt-3 pb-1 shrink-0", collapsed && "px-2")}>
        <button
          onClick={openCommandPalette}
          className={cn(
            "w-full flex items-center gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent/20 text-sidebar-foreground/45 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors",
            collapsed ? "justify-center p-2" : "px-3 py-2"
          )}
        >
          <Search className="w-3.5 h-3.5 shrink-0" />
          {!collapsed && (
            <>
              <span className="text-[12px] flex-1 text-left">Buscar ou navegar...</span>
              <kbd className="hidden sm:flex items-center gap-0.5 text-[10px] font-mono opacity-40 border border-sidebar-border rounded px-1 py-0.5">
                ⌘K
              </kbd>
            </>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav aria-label="Navegação principal" className="flex-1 overflow-y-auto py-3 px-3 space-y-5">

        {/* ── 1. CORE ── */}
        <div>
          <SectionLabel title="Core" />
          <ul className="space-y-0.5">
            {coreItems.map((item) => <NavItem key={item.path} item={item} />)}
          </ul>
        </div>

        {/* ── 2. AGENTES (expandable) ── */}
        <div>
          <SectionLabel title="Agentes" />
          <ul className="space-y-0.5">
            <ExpandableSection
              label="Agentes"
              icon={Bot}
              isActive={isAgentsActive()}
              expanded={expandedAgents}
              onToggle={() => setExpandedAgents(!expandedAgents)}
              onNavigate={() => handleNav("/agents")}
              subItems={agentsSubItems}
            />
          </ul>
        </div>

        {/* ── 3. ALEXANDRIA (expandable) ── */}
        <div>
          <SectionLabel title="Alexandria" />
          <ul className="space-y-0.5">
            <ExpandableSection
              label="Alexandria"
              icon={BookOpen}
              isActive={isAlexandriaActive()}
              expanded={expandedAlexandria}
              onToggle={() => setExpandedAlexandria(!expandedAlexandria)}
              onNavigate={() => handleNav("/alexandria")}
              subItems={alexandriaSubItems}
            />
          </ul>
        </div>

        {/* ── 4. WORKSPACE ── */}
        <div>
          <SectionLabel title="Workspace" />
          <ul className="space-y-0.5">
            {workspaceItems.map((item) => <NavItem key={item.path} item={item} />)}
          </ul>
        </div>

        {/* ── 5. CLIENTES ── */}
        <div>
          <SectionLabel title="Clientes" />
          <ul className="space-y-0.5">
            {clientsItems.map((item) => <NavItem key={item.path} item={item} />)}
          </ul>
        </div>

        {/* ── 6. FERRAMENTAS ── */}
        <div>
          <SectionLabel title="Ferramentas" />
          <ul className="space-y-0.5">
            {toolsItems.map((item) => <NavItem key={item.path} item={item} />)}
          </ul>
        </div>

        {/* ── 7. CONFIGURAÇÕES ── */}
        <div>
          <SectionLabel title="Config" />
          <ul className="space-y-0.5">
            {configItems.map((item) => (
              <NavItem
                key={item.path}
                item={item}
                badge={item.path === "/admin/approvals" ? pendingApprovals : undefined}
              />
            ))}
          </ul>
        </div>

      </nav>

      {/* Footer / User */}
      <div className="border-t border-sidebar-border p-3 shrink-0">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-semibold uppercase">
              {user?.email?.[0] || "U"}
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-semibold uppercase shrink-0">
              {user?.email?.[0] || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium text-sidebar-foreground truncate">
                {user?.email?.split("@")[0] || "User"}
              </p>
              <p className="text-[10px] text-sidebar-foreground/35 truncate">
                {user?.email || ""}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
