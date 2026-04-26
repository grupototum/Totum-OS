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
      <SheetContent side="left" className="p-0 w-[280px] bg-sidebar border-sidebar-border">
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
      className="md:hidden fixed top-4 left-4 z-50 p-2.5 bg-card border border-border shadow-lg"
    >
      <Menu className="w-5 h-5 text-foreground" />
    </button>
  );
}
