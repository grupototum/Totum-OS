import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ContentList } from "./ContentList";
import type { ContentCard, StageId } from "../hooks";

export interface Stage {
  id: StageId;
  title: string;
  icon: React.ElementType;
  accent: string;
}

interface ContentStageProps {
  stage: Stage;
  cards: ContentCard[];
  index: number;
  onAddClick: () => void;
  onDeleteCard: (id: string) => void;
  onCycleApproval: (card: ContentCard) => void;
}

export function ContentStage({
  stage,
  cards,
  index,
  onAddClick,
  onDeleteCard,
  onCycleApproval,
}: ContentStageProps) {
  const StageIcon = stage.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="w-72 sm:w-80 flex flex-col shrink-0"
    >
      {/* Column header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", stage.accent + "/20")}>
            <StageIcon
              className={cn("w-3.5 h-3.5", stage.accent.replace("bg-", "text-"))}
            />
          </div>
          <span className="text-sm font-semibold text-foreground">
            {stage.title}
          </span>
          <span className="text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-md">
            {cards.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={onAddClick}
        >
          <Plus className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Drop zone */}
      <ContentList
        cards={cards}
        stageId={stage.id}
        onDeleteCard={onDeleteCard}
        onCycleApproval={onCycleApproval}
      />
    </motion.div>
  );
}
