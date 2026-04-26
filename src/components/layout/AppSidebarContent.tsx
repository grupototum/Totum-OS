/**
 * AppSidebarContent — mobile-only sidebar (always expanded, no collapse toggle).
 * Uses the exact same nav data as AppSidebar.tsx so desktop and mobile stay in sync.
 */
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { LogOut, ChevronDown, ChevronRight, Search } from "lucide-react";
import { useSidebarStore } from "@/stores/sidebarStore";
import { cn } from "@/lib/utils";
import { navigationSections, type NavItem, type NavSubItem } from "@/config/navigation";

interface Props {
  onNavigate?: () => void;
}

export default function AppSidebarContent({ onNavigate }: Props) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const expandedSections = useSidebarStore((s) => s.expandedSections);
  const toggleSection = useSidebarStore((s) => s.toggleSection);

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
    navigate(path);
    onNavigate?.();
  };

  const handleLogout = () => {
    signOut();
    navigate("/login");
    onNavigate?.();
  };



  const SectionLabel = ({ title }: { title: string }) => (
    <p className="font-mono text-[10px] uppercase tracking-widest text-sidebar-foreground/35 mb-2 px-2">
      {title}
    </p>
  );

  const NavItemButton = ({ item }: { item: NavItem }) => {
    const active = isActive(item.path);
    return (
      <li>
        <button
          onClick={() => handleNav(item.path)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-none border border-transparent transition-all duration-200 relative",
            active
              ? "border-primary/40 bg-primary/10 text-primary"
              : "text-sidebar-foreground/60 hover:border-sidebar-border hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
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
        <div className="flex items-center">
          <button
            onClick={() => toggleSection(sectionId)}
            className="p-1 text-sidebar-foreground/35 hover:text-sidebar-foreground shrink-0"
          >
            {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => handleNav(path)}
            className={cn(
              "flex-1 flex items-center gap-2.5 px-2 py-2.5 rounded-none border border-transparent transition-all duration-200",
              sectionActive
                ? "border-primary/40 bg-primary/10 text-primary"
                : "text-sidebar-foreground/60 hover:border-sidebar-border hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}
          >
            <Icon className={cn("w-[18px] h-[18px] shrink-0", sectionActive && "text-primary")} />
            <span className="text-[13px] font-medium tracking-wide">{label}</span>
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
                      "w-full flex items-center gap-2 px-2 py-1.5 rounded-none transition-all duration-200 text-[12px]",
                      subActive
                        ? "bg-primary/10 text-primary font-medium"
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
      </li>
    );
  };

  return (
    <div className="flex flex-col h-full bg-sidebar">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-16 border-b border-sidebar-border shrink-0">
        <div className="grid h-7 w-7 grid-cols-2 gap-0.5">
          <div className="bg-primary" />
          <div className="bg-zinc-700" />
          <div className="bg-zinc-800" />
          <div className="bg-white shadow-[0_0_12px_rgba(255,255,255,0.45)]" />
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
          className="w-full flex items-center gap-2 rounded-none border border-sidebar-border bg-sidebar-accent/20 px-3 py-2 text-sidebar-foreground/45 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          <Search className="w-3.5 h-3.5 shrink-0" />
          <span className="text-[12px] flex-1 text-left">Buscar ou navegar...</span>
          <kbd className="text-[10px] font-mono opacity-40 border border-sidebar-border px-1 py-0.5">⌘K</kbd>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-5">
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

      {/* Footer */}
      <div className="border-t border-sidebar-border p-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary/15 border border-primary/30 flex items-center justify-center text-primary text-sm font-semibold uppercase shrink-0">
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
            className="p-1.5 hover:bg-sidebar-accent text-sidebar-foreground/40 hover:text-sidebar-foreground transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
