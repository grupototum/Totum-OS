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
} from "lucide-react";
import { cn } from "@/lib/utils";

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
    title: "MAIN",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
      { label: "Hub de Agentes", icon: Bot, path: "/hub" },
    ],
  },
  {
    title: "WORKSPACE",
    items: [
      { label: "Tasks Board", icon: KanbanSquare, path: "/tasks" },
      { label: "Content Pipeline", icon: GitBranch, path: "/content" },
      { label: "Office View", icon: Building2, path: "/office" },
    ],
  },
  {
    title: "AI TOOLS",
    items: [
      { label: "Claude Code", icon: Terminal, path: "/claude-code" },
      { label: "Team Structure", icon: Users, path: "/team" },
    ],
  },
  {
    title: "SETTINGS",
    items: [
      { label: "Settings", icon: Settings, path: "/settings" },
    ],
  },
];

interface Props {
  onNavigate?: () => void;
}

export default function AppSidebarContent({ onNavigate }: Props) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleNav = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  const handleLogout = () => {
    signOut();
    navigate("/login");
    onNavigate?.();
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
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        {sections.map((section) => (
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
                      <span className="text-[13px] font-medium tracking-wide truncate">
                        {item.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
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
