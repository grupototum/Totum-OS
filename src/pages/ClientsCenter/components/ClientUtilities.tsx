import { User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye, Pencil, Trash2 } from "lucide-react";
import type { Client } from "../hooks";

/**
 * Time ago helper
 */
export function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "agora";
  if (h < 24) return `${h}h atrás`;
  const d = Math.floor(h / 24);
  return `${d}d atrás`;
}

/**
 * Status badge styling
 */
export const STATUS_BADGE: Record<string, string> = {
  active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  inactive: "bg-muted text-muted-foreground border-border/40",
};

/**
 * Industry color styling
 */
export const INDUSTRY_COLORS: Record<string, string> = {
  Tecnologia: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  Saúde: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  Educação: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  "E-commerce": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Serviços: "bg-teal-500/20 text-teal-400 border-teal-500/30",
};

/**
 * Animation helper
 */
export const anim = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.04, duration: 0.3 },
});

/**
 * Info row component for detail view
 */
export function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
          {label}
        </p>
        <p className="text-sm text-foreground font-medium">{value}</p>
      </div>
    </div>
  );
}

/**
 * Client actions dropdown menu
 */
export function ClientActions({
  client,
  onDelete,
  onStatusChange,
  onView,
}: {
  client: Client;
  onDelete: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
  onView: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onView} className="gap-2">
          <Eye className="h-3.5 w-3.5" />
          Visualizar
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            const newStatus =
              client.status === "active"
                ? "inactive"
                : client.status === "inactive"
                  ? "pending"
                  : "active";
            onStatusChange(client.id, newStatus);
          }}
          className="gap-2"
        >
          <Pencil className="h-3.5 w-3.5" />
          Alterar Status
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(client.id)}
          className="gap-2 text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Remover
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
