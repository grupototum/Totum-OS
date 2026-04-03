import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Bot,
  KanbanSquare,
  GitBranch,
  Building2,
  Terminal,
  Users,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  ClipboardList,
  UserPlus,
  Contact,
  Rocket,
  Network,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const sections: NavSection[] = [
  {
    title: "PRINCIPAL",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
      { label: "Hub de Agentes", icon: Sparkles, path: "/hub" },
    ],
  },
  {
    title: "CENTRAL DE AGENTES",
    items: [
      { label: "Painel", icon: Bot, path: "/painel-agentes" },
      { label: "Estrutura", icon: Network, path: "/estrutura-time" },
    ],
  },
  {
    title: "ÁREA DE TRABALHO",
    items: [
      { label: "Quadro de Tarefas", icon: KanbanSquare, path: "/quadro-tarefas" },
      { label: "Pipeline de Conteúdo", icon: GitBranch, path: "/content" },
      { label: "Implantação", icon: Rocket, path: "/action-plan" },
      { label: "Novo Cliente", icon: UserPlus, path: "/new-client" },
      { label: "Central de Clientes", icon: Contact, path: "/clients" },
      { label: "Visão do Escritório", icon: Building2, path: "/office" },
    ],
  },
  {
    title: "FERRAMENTAS IA",
    items: [
      { label: "Claudio Code", icon: Terminal, path: "/claude-code" },
      { label: "Estrutura do Time", icon: Users, path: "/team" },
    ],
  },
  {
    title: "CONFIGURAÇÕES",
    items: [
      { label: "Configurações", icon: Settings, path: "/settings" },
    ],
  },
];

export default function AppSidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleNav = (path: string) => {
    // Previne navegação se já estiver navegando
    if (isNavigating) return;
    
    setIsNavigating(true);
    navigate(path);
    
    // Libera o estado após a transição
    setTimeout(() => setIsNavigating(false), 300);
  };

  const handleLogout = () => {
    signOut();
    navigate("/login");
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-full z-40 flex flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out",
        collapsed ? "w-[72px]" : "w-[280px]"
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
            <span className="font-heading text-lg font-medium text-sidebar-foreground tracking-tight">
              TOTUM
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-sidebar-accent transition-colors text-sidebar-foreground/60 hover:text-sidebar-foreground"
        >
          {collapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {sections.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <p className="label-industrial text-[10px] text-sidebar-foreground/40 mb-2 px-2">
                {section.title}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.path);
                return (
                  <li key={item.path}>
                    <button
                      onClick={() => handleNav(item.path)}
                      className={cn(
                        "w-full flex items-center gap-3 rounded-lg transition-all duration-200 group relative",
                        collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5",
                        active
                          ? "bg-sidebar-accent text-primary"
                          : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                      )}
                    >
                      {active && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
                      )}
                      <item.icon className={cn("w-[18px] h-[18px] shrink-0", active && "text-primary")} />
                      {!collapsed && (
                        <span className="text-[13px] font-medium tracking-wide truncate">
                          {item.label}
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
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
              <p className="text-[10px] text-sidebar-foreground/40 truncate">
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
