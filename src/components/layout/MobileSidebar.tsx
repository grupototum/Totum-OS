import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Menu } from "lucide-react";
import AppSidebarContent from "./AppSidebarContent";

interface MobileSidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MobileSidebar({ open, onOpenChange }: MobileSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[300px] border-sidebar-border/80 bg-sidebar/95 p-0 backdrop-blur-2xl">
        {/* SheetTitle required by Radix for aria-labelledby — visually hidden */}
        <VisuallyHidden>
          <SheetTitle>Menu de Navegação</SheetTitle>
        </VisuallyHidden>
        <AppSidebarContent onNavigate={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  );
}

export function MobileTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed left-4 top-4 z-50 rounded-full border border-border/80 bg-card p-2.5 shadow-[0_24px_44px_-28px_rgba(29,29,31,0.4)] md:hidden"
    >
      <Menu className="w-5 h-5 text-foreground" />
    </button>
  );
}
