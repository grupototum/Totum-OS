import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type StageId = "ideas" | "script" | "thumbnail" | "filming" | "editing";
export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface ContentCard {
  id: string;
  title: string;
  description: string;
  stage: StageId;
  approval_status: ApprovalStatus;
  assignee: string;
  image_url: string | null;
  sort_order: number;
  user_id: string;
}

export type PipelineBoard = Record<StageId, ContentCard[]>;

/**
 * Hook for managing content pipeline data
 * Handles fetching, creating, updating, and deleting cards
 */
export function useContentPipeline() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [board, setBoard] = useState<PipelineBoard>({
    ideas: [],
    script: [],
    thumbnail: [],
    filming: [],
    editing: [],
  });
  const [loading, setLoading] = useState(true);

  // Fetch all cards for current user
  useEffect(() => {
    if (!user) return;

    const fetchCards = async () => {
      const { data } = await supabase
        .from("content_pipeline")
        .select("*")
        .eq("user_id", user.id)
        .order("sort_order", { ascending: true });

      if (data) {
        const grouped: PipelineBoard = {
          ideas: [],
          script: [],
          thumbnail: [],
          filming: [],
          editing: [],
        };
        (data as ContentCard[]).forEach((card) => {
          if (grouped[card.stage as StageId])
            grouped[card.stage as StageId].push(card);
        });
        setBoard(grouped);
      }
      setLoading(false);
    };

    fetchCards();
  }, [user]);

  // Create new card
  const createCard = async (
    title: string,
    description: string,
    stage: StageId,
    assignee: string,
    approval_status: ApprovalStatus,
    imageUrl: string | null
  ) => {
    if (!user) return null;

    const maxOrder = board[stage].length;
    const { data, error } = await supabase
      .from("content_pipeline")
      .insert({
        title: title.trim(),
        description: description.trim(),
        stage,
        approval_status,
        assignee,
        image_url: imageUrl,
        sort_order: maxOrder,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }

    setBoard((prev) => ({
      ...prev,
      [stage]: [...prev[stage], data as ContentCard],
    }));

    toast({ title: "Conteúdo criado!" });
    return data;
  };

  // Delete card
  const deleteCard = async (id: string, stage: StageId) => {
    await supabase.from("content_pipeline").delete().eq("id", id);
    setBoard((prev) => ({
      ...prev,
      [stage]: prev[stage].filter((c) => c.id !== id),
    }));
  };

  // Update card approval status
  const cycleApproval = async (card: ContentCard) => {
    const order: ApprovalStatus[] = ["pending", "approved", "rejected"];
    const next = order[
      (order.indexOf(card.approval_status as ApprovalStatus) + 1) % 3
    ] as ApprovalStatus;

    await supabase
      .from("content_pipeline")
      .update({ approval_status: next })
      .eq("id", card.id);

    setBoard((prev) => ({
      ...prev,
      [card.stage]: prev[card.stage].map((c) =>
        c.id === card.id ? { ...c, approval_status: next } : c
      ),
    }));
  };

  // Update card position (drag & drop)
  const updateCardPosition = async (
    cardId: string,
    fromStage: StageId,
    toStage: StageId,
    newIndex: number
  ) => {
    const srcItems = [...board[fromStage]];
    const dstItems = fromStage === toStage ? srcItems : [...board[toStage]];
    const [moved] = srcItems.splice(
      srcItems.findIndex((c) => c.id === cardId),
      1
    );

    moved.stage = toStage;
    dstItems.splice(newIndex, 0, moved);

    // Update sort_order
    dstItems.forEach((item, i) => (item.sort_order = i));
    if (fromStage !== toStage)
      srcItems.forEach((item, i) => (item.sort_order = i));

    setBoard((prev) => ({
      ...prev,
      [fromStage]: srcItems,
      ...(fromStage !== toStage ? { [toStage]: dstItems } : {}),
    }));

    // Persist
    await supabase
      .from("content_pipeline")
      .update({ stage: toStage, sort_order: moved.sort_order })
      .eq("id", moved.id);
  };

  return {
    board,
    loading,
    createCard,
    deleteCard,
    cycleApproval,
    updateCardPosition,
  };
}
