import {
  DragDropContext,
  type DropResult,
} from "@hello-pangea/dnd";
import { motion } from "framer-motion";
import {
  Lightbulb,
  FileText,
  Image as ImageIcon,
  Video,
  Scissors,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ContentStage, type Stage } from "./ContentStage";
import type { ContentCard, StageId, PipelineBoard } from "../hooks";

const STAGES: Stage[] = [
  { id: "ideas", title: "Ideas", icon: Lightbulb, accent: "bg-amber-500" },
  { id: "script", title: "Script", icon: FileText, accent: "bg-violet-500" },
  {
    id: "thumbnail",
    title: "Thumbnail",
    icon: ImageIcon,
    accent: "bg-pink-500",
  },
  { id: "filming", title: "Filming", icon: Video, accent: "bg-sky-500" },
  { id: "editing", title: "Editing", icon: Scissors, accent: "bg-emerald-500" },
];

interface ContentBoardProps {
  board: PipelineBoard;
  onDragEnd: (result: DropResult) => void;
  onAddClick: (stage: StageId) => void;
  onDeleteCard: (id: string, stage: StageId) => void;
  onCycleApproval: (card: ContentCard) => void;
}

export function ContentBoard({
  board,
  onDragEnd,
  onAddClick,
  onDeleteCard,
  onCycleApproval,
}: ContentBoardProps) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-4 px-4 pb-4 sm:px-6 sm:pb-6 h-full min-w-max">
          {STAGES.map((stage, index) => (
            <ContentStage
              key={stage.id}
              stage={stage}
              cards={board[stage.id]}
              index={index}
              onAddClick={() => onAddClick(stage.id)}
              onDeleteCard={(id) => onDeleteCard(id, stage.id)}
              onCycleApproval={onCycleApproval}
            />
          ))}
        </div>
      </div>
    </DragDropContext>
  );
}

export { STAGES };
