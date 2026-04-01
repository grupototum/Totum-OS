import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  LayoutDashboard, Bot, KanbanSquare, GitBranch, Building2,
  Terminal, Users, Settings, LogOut, Sun, Moon,
  ChevronDown, ChevronRight, Notebook, FileCheck, Lightbulb, ClipboardList, UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { mainAgents, centralResources } from "@/data/agentHierarchy";

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const staticSections: NavSection[] = [
  {
    title: "PRINCIPAL",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
      { label: "Hub de Agentes", icon: Bot, path: "/hub" },
      { label: "Painel de Agentes", icon: Bot, path: "/agents-dashboard" },
    ],
  },
  {
    title: "ÁREA DE TRABALHO",
    items: [
      { label: "Quadro de Tarefas", icon: KanbanSquare, path: "/tasks" },
      { label: "Pipeline de Conteúdo", icon: GitBranch, path: "/content" },
      { label: "Plano de Ação", icon: ClipboardList, path: "/action-plan" },
      { label: "Novo Cliente", icon: UserPlus, path: "/new-client" },
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
];

interface Props {
  onNavigate?: () => void;
}

export default function AppSidebarContent({ onNavigate }: Props) {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [expandedAgents, setExpandedAgents] = useState<Record<string, boolean>>({});
  const [expandedResources, setExpandedResources] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const isChildActive = (parentId: string) => location.pathname.startsWith(`/agentes/${parentId}/`);

  const handleNav = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  const handleLogout = () => {
    signOut();
    navigate("/login");
    onNavigate?.();
  };

  const toggleAgent = (id: string) => {
    setExpandedAgents((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-sidebar-border shrink-0">
        <div className="flex gap-[3px]">
          <div className="w-[5px] h-6 bg-primary rounded-full" />
          <div className="w-[5px] h-4 bg-primary/60 rounded-full" />
          <div className="w-[5px] h-6 bg-primary rounded-full" />
        </div>
        <span className="font-heading text-lg font-medium text-sidebar-foreground tracking-tight">
          TOTUM
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {/* Static sections */}
        {staticSections.map((section) => (
          <div key={section.title}>
            <p className="label-industrial text-[10px] text-sidebar-foreground/40 mb-2 px-2">
              {section.title}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => {
                const active = isActive(item.path);
                return (
                  <li key={item.path}>
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
              })}
            </ul>
          </div>
        ))}

        {/* Agents hierarchy */}
        <div>
          <p className="label-industrial text-[10px] text-sidebar-foreground/40 mb-2 px-2">
            AGENTES
          </p>
          <ul className="space-y-0.5">
            {mainAgents.map((agent) => {
              const expanded = expandedAgents[agent.id] || false;
              const parentActive = isActive(`/agentes/${agent.id}`);
              const childActive = isChildActive(agent.id);

              return (
                <li key={agent.id}>
                  {/* Parent agent */}
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleAgent(agent.id)}
                      className="p-1 text-sidebar-foreground/40 hover:text-sidebar-foreground shrink-0"
                    >
                      {expanded ? (
                        <ChevronDown className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronRight className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleNav(`/agentes/${agent.id}`)}
                      className={cn(
                        "flex-1 flex items-center gap-2.5 px-2 py-2 rounded-lg transition-all duration-200 relative",
                        parentActive || childActive
                          ? "bg-sidebar-accent text-primary"
                          : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                      )}
                    >
                      {parentActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
                      )}
                      <agent.icon className={cn("w-4 h-4 shrink-0", (parentActive || childActive) ? "text-primary" : agent.accentClass)} />
                      <span className="text-[12px] font-medium truncate">{agent.name}</span>
                    </button>
                  </div>

                  {/* Sub-agents */}
                  {expanded && (
                    <ul className="ml-5 pl-3 border-l border-sidebar-border/50 space-y-0.5 mt-0.5">
                      {agent.subAgents.map((sub) => {
                        const subActive = isActive(`/agentes/${agent.id}/${sub.id}`);
                        return (
                          <li key={sub.id}>
                            <button
                              onClick={() => handleNav(`/agentes/${agent.id}/${sub.id}`)}
                              className={cn(
                                "w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-all duration-200 text-[11px]",
                                subActive
                                  ? "bg-sidebar-accent text-primary font-medium"
                                  : "text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/30"
                              )}
                            >
                              <sub.icon className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{sub.name}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Resources */}
        <div>
          <p className="label-industrial text-[10px] text-sidebar-foreground/40 mb-2 px-2">
            RECURSOS
          </p>
          <ul className="space-y-0.5">
            <li>
              <div className="flex items-center">
                <button
                  onClick={() => setExpandedResources(!expandedResources)}
                  className="p-1 text-sidebar-foreground/40 hover:text-sidebar-foreground shrink-0"
                >
                  {expandedResources ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => handleNav("/recursos")}
                  className={cn(
                    "flex-1 flex items-center gap-2.5 px-2 py-2 rounded-lg transition-all duration-200",
                    isActive("/recursos")
                      ? "bg-sidebar-accent text-primary"
                      : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                  )}
                >
                  <Notebook className="w-4 h-4 shrink-0" />
                  <span className="text-[12px] font-medium truncate">Recursos Centrais</span>
                </button>
              </div>
              {expandedResources && (
                <ul className="ml-5 pl-3 border-l border-sidebar-border/50 space-y-0.5 mt-0.5">
                  {centralResources.map((res) => (
                    <li key={res.id}>
                      <button
                        onClick={() => handleNav(`/recursos/${res.id}`)}
                        className={cn(
                          "w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-all duration-200 text-[11px]",
                          isActive(`/recursos/${res.id}`)
                            ? "bg-sidebar-accent text-primary font-medium"
                            : "text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-accent/30"
                        )}
                      >
                        <res.icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{res.name}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </div>

        {/* POP/SLA & Dicas */}
        <div>
          <p className="label-industrial text-[10px] text-sidebar-foreground/40 mb-2 px-2">
            POP / SLA
          </p>
          <ul className="space-y-0.5">
            <li>
              <button
                onClick={() => handleNav("/pop-sla")}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative",
                  isActive("/pop-sla")
                    ? "bg-sidebar-accent text-primary"
                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <FileCheck className={cn("w-[18px] h-[18px] shrink-0", isActive("/pop-sla") && "text-primary")} />
                <span className="text-[13px] font-medium tracking-wide truncate">POP e SLA</span>
                <span className="ml-auto text-[9px] px-1.5 py-0.5 rounded-full bg-primary/20 text-primary font-semibold">NOVO</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNav("/dicas")}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative",
                  isActive("/dicas")
                    ? "bg-sidebar-accent text-primary"
                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <Lightbulb className={cn("w-[18px] h-[18px] shrink-0", isActive("/dicas") && "text-primary")} />
                <span className="text-[13px] font-medium tracking-wide truncate">Dicas & Recursos</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Settings */}
        <div>
          <p className="label-industrial text-[10px] text-sidebar-foreground/40 mb-2 px-2">
            SETTINGS
          </p>
          <ul className="space-y-0.5">
            <li>
              <button
                onClick={() => handleNav("/settings")}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 relative",
                  isActive("/settings")
                    ? "bg-sidebar-accent text-primary"
                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                )}
              >
                {isActive("/settings") && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-primary rounded-r-full" />
                )}
                <Settings className={cn("w-[18px] h-[18px] shrink-0", isActive("/settings") && "text-primary")} />
                <span className="text-[13px] font-medium tracking-wide truncate">Settings</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3 shrink-0 space-y-2">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          <span className="text-[12px] font-medium">
            {theme === "dark" ? "Modo Claro" : "Modo Escuro"}
          </span>
        </button>

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
      </div>
    </div>
  );
}
