import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LogOut,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Menu,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useSidebarStore } from "@/stores/sidebarStore";
import { supabase } from "@/integrations/supabase/client";
import { navigationSections, type NavItem, type NavSubItem } from "@/config/navigation";

export default function AppSidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const collapsed = useSidebarStore((s) => s.collapsed);
  const toggleCollapsed = useSidebarStore((s) => s.toggleCollapsed);
  const expandedSections = useSidebarStore((s) => s.expandedSections);
  const toggleSection = useSidebarStore((s) => s.toggleSection);
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
    const interval = setInterval(fetchPending, 60000);
    return () => clearInterval(interval);
  }, []);

  const openCommandPalette = () =>
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true }));

  const isActive = (path: string) => location.pathname === path;

  const isSectionActive = (sectionId: string) => {
    const section = navigationSections.find((s) => s.id === sectionId);
    if (!section) return false;
    if (section.items.some((i) => isActive(i.path))) return true;
    if (section.expandable) {
      if (location.pathname.startsWith(section.expandable.path)) return true;
      if (section.expandable.subItems.some((s) => isActive(s.path))) return true;
    }
    return false;
  };

  const handleNav = (path: string) => {
    if (isNavigating) return;
    setIsNavigating(true);
    navigate(path);
    setTimeout(() => setIsNavigating(false), 300);
  };

  const handleLogout = () => { signOut(); navigate("/login"); };



  // ── helpers ──────────────────────────────────────────────────────────────────

  const SectionLabel = ({ title }: { title: string }) =>
    !collapsed ? (
      <p className="font-mono text-[10px] uppercase tracking-widest text-sidebar-foreground/35 mb-2 px-2">
        {title}
      </p>
    ) : null;

  const NavItemButton = ({ item }: { item: NavItem }) => {
    const active = isActive(item.path);
    const badge = item.badge === "approvals" ? pendingApprovals : undefined;
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

  const ExpandableSection = ({
    sectionId,
    label,
    icon: Icon,
    path,
    subItems,
  }: {
    sectionId: string;
    label: string;
    icon: React.ElementType;
    path: string;
    subItems: NavSubItem[];
  }) => {
    const sectionActive = isSectionActive(sectionId);
    const expanded = !!expandedSections[sectionId];

    return (
      <li>
        {collapsed ? (
          <button
            onClick={() => handleNav(path)}
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
                onClick={() => toggleSection(sectionId)}
                className="p-1 text-sidebar-foreground/35 hover:text-sidebar-foreground shrink-0"
              >
                {expanded
                  ? <ChevronDown className="w-3.5 h-3.5" />
                  : <ChevronRight className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => handleNav(path)}
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
                        ) : sub.icon ? (
                          <sub.icon className="w-3.5 h-3.5 shrink-0" />
                        ) : null}
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
  };

  // ── render ───────────────────────────────────────────────────────────────────

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
        {navigationSections.map((section) => (
          <div key={section.id}>
            <SectionLabel title={section.label} />
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <NavItemButton key={item.path} item={item} />
              ))}
              {section.expandable && (
                <ExpandableSection
                  sectionId={section.id}
                  label={section.expandable.label}
                  icon={section.expandable.icon}
                  path={section.expandable.path}
                  subItems={section.expandable.subItems}
                />
              )}
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
