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
    <p className="mb-2 px-3 text-[12px] tracking-[-0.01em] text-sidebar-foreground/45">
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
            "relative flex w-full items-center gap-3 rounded-2xl border border-transparent px-3 py-2.5 transition-all duration-200",
            active
              ? "border-primary/20 bg-primary/10 text-primary"
              : "text-sidebar-foreground/60 hover:border-sidebar-border hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
          )}
        >
          {active && (
            <div className="absolute left-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-primary" />
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
              "flex flex-1 items-center gap-2.5 rounded-2xl border border-transparent px-3 py-2.5 transition-all duration-200",
              sectionActive
                ? "border-primary/20 bg-primary/10 text-primary"
                : "text-sidebar-foreground/60 hover:border-sidebar-border hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
            )}
          >
            <Icon className={cn("w-[18px] h-[18px] shrink-0", sectionActive && "text-primary")} />
            <span className="text-[13px] font-medium tracking-wide">{label}</span>
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
      </li>
    );
  };

  return (
    <div className="flex h-full flex-col bg-sidebar/95 backdrop-blur-2xl">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-sidebar-border/70 px-5">
        <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-white shadow-[0_18px_36px_-28px_rgba(0,113,227,0.9)]">
          <span className="text-sm font-semibold">T</span>
        </div>
        <span className="font-['SF_Pro_Display','SF_Pro_Icons','Helvetica_Neue',Helvetica,Arial,sans-serif] text-lg font-semibold tracking-[-0.02em] text-sidebar-foreground">
          Totum OS
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
          className="flex w-full items-center gap-2 rounded-full border border-sidebar-border/80 bg-sidebar-accent/50 px-3 py-2 text-sidebar-foreground/45 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <Search className="w-3.5 h-3.5 shrink-0" />
          <span className="text-[12px] flex-1 text-left">Buscar no Totum OS...</span>
          <kbd className="rounded-full border border-sidebar-border px-2 py-0.5 text-[10px] opacity-40">⌘K</kbd>
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
      <div className="shrink-0 border-t border-sidebar-border/70 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-sm font-semibold uppercase text-primary">
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
