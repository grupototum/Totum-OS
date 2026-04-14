import { Droppable } from "@hello-pangea/dnd";
import { AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { ContentCardComponent } from "./ContentCard";
import type { ContentCard, StageId } from "../hooks";

interface ContentListProps {
  cards: ContentCard[];
  stageId: StageId;
  onDeleteCard: (id: string) => void;
  onCycleApproval: (card: ContentCard) => void;
}

export function ContentList({
  cards,
  stageId,
  onDeleteCard,
  onCycleApproval,
}: ContentListProps) {
  return (
    <Droppable droppableId={stageId}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className={cn(
            "flex-1 rounded-xl p-2 space-y-2 transition-colors overflow-y-auto",
            snapshot.isDraggingOver
              ? "bg-primary/5 ring-1 ring-primary/20"
              : "bg-secondary/30"
          )}
        >
          <AnimatePresence>
            {cards.map((card, index) => (
              <ContentCardComponent
                key={card.id}
                card={card}
                index={index}
                stageId={stageId}
                onDelete={() => onDeleteCard(card.id)}
                onApprovalCycle={() => onCycleApproval(card)}
              />
            ))}
          </AnimatePresence>
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
