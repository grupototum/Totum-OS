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
import { ThemeToggle } from "@/components/ui/ThemeToggle";

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
      <p className="mb-2 px-3 text-[12px] tracking-[-0.01em] text-sidebar-foreground/45">
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
            "relative flex w-full items-center gap-3 rounded-2xl border border-transparent transition-all duration-200",
            collapsed ? "justify-center px-2 py-2.5" : "px-3 py-2.5",
            active
              ? "border-primary/20 bg-primary/10 text-primary shadow-[0_12px_24px_-22px_rgba(0,113,227,0.9)]"
              : "text-sidebar-foreground/65 hover:border-sidebar-border hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
          )}
        >
          {active && !collapsed && (
            <div className="absolute left-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary" />
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
              "flex w-full items-center justify-center rounded-2xl border border-transparent px-2 py-2.5 transition-all duration-200",
              sectionActive
                ? "border-primary/20 bg-primary/10 text-primary"
                : "text-sidebar-foreground/60 hover:border-sidebar-border hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
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
                  "relative flex flex-1 items-center gap-2.5 rounded-2xl border border-transparent px-3 py-2.5 transition-all duration-200",
                  sectionActive
                    ? "border-primary/20 bg-primary/10 text-primary"
                    : "text-sidebar-foreground/60 hover:border-sidebar-border hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
                )}
              >
                <Icon className={cn("w-[18px] h-[18px] shrink-0", sectionActive && "text-primary")} />
                <span className="text-[13px] font-medium tracking-wide truncate">{label}</span>
              </button>
            </div>

            {expanded && (
              <ul className="mt-1 ml-5 space-y-1 border-l border-sidebar-border/50 pl-4">
                {subItems.map((sub) => {
                  const subActive = isActive(sub.path);
                  return (
                    <li key={sub.path}>
                      <button
                        onClick={() => handleNav(sub.path)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-xl px-3 py-2 text-[12px] transition-all duration-200",
                          subActive
                            ? "bg-primary/10 text-primary"
                            : "text-sidebar-foreground/50 hover:bg-sidebar-accent/40 hover:text-sidebar-foreground"
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
        "fixed left-0 top-0 z-40 flex h-full flex-col border-r border-sidebar-border/80 bg-sidebar/90 backdrop-blur-2xl transition-all duration-300 ease-in-out",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-sidebar-border/70 px-5">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-white shadow-[0_18px_36px_-28px_rgba(0,113,227,0.9)]">
              <span className="text-sm font-semibold">T</span>
            </div>
            <span className="font-['SF_Pro_Display','SF_Pro_Icons','Helvetica_Neue',Helvetica,Arial,sans-serif] text-lg font-semibold tracking-[-0.02em] text-sidebar-foreground">
              Totum OS
            </span>
          </div>
        )}
        <button
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          className="p-1.5 hover:bg-sidebar-accent transition-colors text-sidebar-foreground/50 hover:text-sidebar-foreground"
        >
          {collapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* ⌘K Search */}
      <div className={cn("px-3 pt-3 pb-1 shrink-0", collapsed && "px-2")}>
        <button
          onClick={openCommandPalette}
          className={cn(
            "flex w-full items-center gap-2 rounded-full border border-sidebar-border/80 bg-sidebar-accent/50 text-sidebar-foreground/45 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground",
            collapsed ? "justify-center p-2" : "px-3 py-2"
          )}
        >
          <Search className="w-3.5 h-3.5 shrink-0" />
          {!collapsed && (
            <>
              <span className="text-[12px] flex-1 text-left">Buscar no Totum OS...</span>
              <kbd className="hidden sm:flex items-center gap-0.5 rounded-full border border-sidebar-border px-2 py-0.5 text-[10px] opacity-40">
                ⌘K
              </kbd>
            </>
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav aria-label="Navegação principal" className="flex-1 space-y-5 overflow-y-auto px-3 py-4">
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
      <div className="shrink-0 space-y-3 border-t border-sidebar-border/70 p-3">
        {collapsed ? (
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-xs font-semibold uppercase text-primary">
              {user?.email?.[0] || "U"}
            </div>
            <ThemeToggle compact />
            <button
              onClick={handleLogout}
              className="p-1.5 hover:bg-sidebar-accent text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
              title="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-sm font-semibold uppercase text-primary">
                {user?.email?.[0] || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-sidebar-foreground truncate">
                  {user?.email?.split("@")[0] || "User"}
                </p>
                <p className="text-[11px] text-sidebar-foreground/50 truncate">
                  {user?.email || ""}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="p-1.5 hover:bg-sidebar-accent text-sidebar-foreground/50 hover:text-sidebar-foreground transition-colors"
                title="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
            <ThemeToggle className="w-full justify-center" />
          </>
        )}
      </div>
    </aside>
  );
}
