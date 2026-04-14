import { Draggable } from "@hello-pangea/dnd";
import {
  CheckCircle2,
  Clock,
  XCircle,
  GripVertical,
  Trash2,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { ContentCard as IContentCard, StageId, ApprovalStatus } from "../hooks";

interface ContentCardProps {
  card: IContentCard;
  index: number;
  stageId: StageId;
  onDelete: (id: string) => void;
  onApprovalCycle: () => void;
}

const approvalMeta: Record<
  ApprovalStatus,
  { label: string; icon: React.ElementType; cls: string }
> = {
  pending: {
    label: "Pendente",
    icon: Clock,
    cls: "text-amber-400 bg-amber-500/10 ring-amber-500/20",
  },
  approved: {
    label: "Aprovado",
    icon: CheckCircle2,
    cls: "text-emerald-400 bg-emerald-500/10 ring-emerald-500/20",
  },
  rejected: {
    label: "Rejeitado",
    icon: XCircle,
    cls: "text-red-400 bg-red-500/10 ring-red-500/20",
  },
};

const avatarColor = (name: string) => {
  const map: Record<string, string> = {
    Miguel: "bg-orange-500/20 text-orange-400",
    Liz: "bg-violet-500/20 text-violet-400",
    Jarvis: "bg-cyan-500/20 text-cyan-400",
  };
  return map[name] ?? "bg-muted text-muted-foreground";
};

export function ContentCardComponent({
  card,
  index,
  onDelete,
  onApprovalCycle,
}: ContentCardProps) {
  const approval = approvalMeta[card.approval_status] ?? approvalMeta.pending;
  const ApprovalIcon = approval.icon;

  return (
    <Draggable draggableId={card.id} index={index}>
      {(prov, snap) => (
        <div
          ref={prov.innerRef}
          {...prov.draggableProps}
          className={cn(
            "rounded-lg bg-card border border-border overflow-hidden group transition-shadow",
            snap.isDragging && "shadow-xl shadow-primary/10 ring-1 ring-primary/30"
          )}
        >
          {/* Thumbnail */}
          {card.image_url && (
            <div className="h-32 w-full overflow-hidden">
              <img
                src={card.image_url}
                alt={card.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="p-3">
            <div className="flex items-start gap-2">
              <div
                {...prov.dragHandleProps}
                className="mt-0.5 opacity-0 group-hover:opacity-60 transition-opacity cursor-grab"
              >
                <GripVertical className="w-3.5 h-3.5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground leading-tight">
                  {card.title}
                </p>
                {card.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {card.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => onDelete(card.id)}
                className="opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-3">
              <button
                onClick={onApprovalCycle}
                className={cn(
                  "flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ring-1 transition-colors",
                  approval.cls
                )}
              >
                <ApprovalIcon className="w-3 h-3" />
                {approval.label}
              </button>
              {card.assignee && (
                <Avatar className="h-5 w-5">
                  <AvatarFallback
                    className={cn("text-[10px] font-medium", avatarColor(card.assignee))}
                  >
                    {card.assignee.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
