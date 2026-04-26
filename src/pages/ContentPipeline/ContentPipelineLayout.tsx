import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { usePageTransition } from "@/hooks/usePageTransition";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AppLayout from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/patterns";
import { GitBranch } from "lucide-react";
import { ContentBoard, STAGES, ContentForm } from "./components";
import { useContentPipeline, useContentForm } from "./hooks";
import type { StageId } from "./hooks";

/**
 * ContentPipeline Container Component
 * Orchestrates data fetching, state management, and layout
 */
export function ContentPipelineLayout() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const pageTransition = usePageTransition();

  // Data management
  const {
    board,
    loading,
    createCard,
    deleteCard,
    cycleApproval,
    updateCardPosition,
  } = useContentPipeline();

  // Form management
  const form = useContentForm(() => {
    setDialogOpen(false);
  });

  // Dialog state
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedStage, setSelectedStage] = React.useState<StageId>("ideas");

  // Redirect unauthenticated users
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // Handle drag end
  const handleDragEnd = async (result: any) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    )
      return;

    const srcStage = source.droppableId as StageId;
    const dstStage = destination.droppableId as StageId;
    const cardId = result.draggableId;

    await updateCardPosition(cardId, srcStage, dstStage, destination.index);
  };

  // Handle create card
  const handleCreateCard = async () => {
    if (!form.validate()) return;

    await createCard(
      form.title,
      form.description,
      selectedStage,
      form.assignee,
      form.approvalStatus,
      form.uploadedUrl
    );

    form.reset();
  };

  // Handle dialog open for specific stage
  const handleAddClick = (stage: StageId) => {
    setSelectedStage(stage);
    form.reset();
    setDialogOpen(true);
  };

  // Loading state
  if (authLoading || loading) {
    return (
      <AppLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <motion.div {...pageTransition} className="h-[100vh] flex flex-col overflow-hidden">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="shrink-0 p-4 sm:p-6 pb-3"
        >
          <PageHeader
            eyebrow="Produção"
            title="Content Pipeline"
            description="Organize ideias, roteiros, criativos, gravações e edição em uma esteira visual."
            icon={GitBranch}
            className="py-4"
          />

          {/* Stage legend */}
          <div className="mt-3 hidden lg:flex items-center gap-3">
            {STAGES.map((s) => (
              <div key={s.id} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${s.accent}`} />
                <span className="text-[10px] text-muted-foreground">
                  {s.title}
                </span>
              </div>
            ))}
          </div>
        </motion.header>

        {/* Board */}
        <ContentBoard
          board={board}
          onDragEnd={handleDragEnd}
          onAddClick={handleAddClick}
          onDeleteCard={deleteCard}
          onCycleApproval={cycleApproval}
        />

        {/* New Card Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-card border-border sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                Novo Conteúdo —{" "}
                {STAGES.find((s) => s.id === selectedStage)?.title}
              </DialogTitle>
            </DialogHeader>
            <ContentForm
              title={form.title}
              onTitleChange={form.setTitle}
              description={form.description}
              onDescriptionChange={form.setDescription}
              assignee={form.assignee}
              onAssigneeChange={form.setAssignee}
              approvalStatus={form.approvalStatus}
              onApprovalStatusChange={form.setApprovalStatus}
              uploadingImage={form.uploadingImage}
              previewUrl={form.previewUrl}
              onImageUpload={form.handleImageUpload}
              onClearImage={form.clearImage}
              onImageClick={form.openFilePicker}
              fileInputRef={form.fileInputRef}
              errors={form.errors}
              onClearError={(field) =>
                form.setErrors((prev) => ({ ...prev, [field]: "" }))
              }
              onSubmit={handleCreateCard}
              isLoading={false}
            />
          </DialogContent>
        </Dialog>
      </motion.div>
    </AppLayout>
  );
}
