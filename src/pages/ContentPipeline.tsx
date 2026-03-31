import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/components/layout/AppLayout";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  ArrowLeft,
  Lightbulb,
  FileText,
  Image as ImageIcon,
  Video,
  Scissors,
  CheckCircle2,
  Clock,
  XCircle,
  Upload,
  GripVertical,
  Trash2,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────
type StageId = "ideas" | "script" | "thumbnail" | "filming" | "editing";
type ApprovalStatus = "pending" | "approved" | "rejected";

interface ContentCard {
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

type PipelineBoard = Record<StageId, ContentCard[]>;

// ── Constants ──────────────────────────────────────────
const STAGES: { id: StageId; title: string; icon: React.ElementType; accent: string }[] = [
  { id: "ideas", title: "Ideas", icon: Lightbulb, accent: "bg-amber-500" },
  { id: "script", title: "Script", icon: FileText, accent: "bg-violet-500" },
  { id: "thumbnail", title: "Thumbnail", icon: ImageIcon, accent: "bg-pink-500" },
  { id: "filming", title: "Filming", icon: Video, accent: "bg-sky-500" },
  { id: "editing", title: "Editing", icon: Scissors, accent: "bg-emerald-500" },
];

const ASSIGNEES = ["Miguel", "Liz", "Jarvis"];

const approvalMeta: Record<ApprovalStatus, { label: string; icon: React.ElementType; cls: string }> = {
  pending: { label: "Pendente", icon: Clock, cls: "text-amber-400 bg-amber-500/10 ring-amber-500/20" },
  approved: { label: "Aprovado", icon: CheckCircle2, cls: "text-emerald-400 bg-emerald-500/10 ring-emerald-500/20" },
  rejected: { label: "Rejeitado", icon: XCircle, cls: "text-red-400 bg-red-500/10 ring-red-500/20" },
};

const avatarColor = (name: string) => {
  const map: Record<string, string> = {
    Miguel: "bg-orange-500/20 text-orange-400",
    Liz: "bg-violet-500/20 text-violet-400",
    Jarvis: "bg-cyan-500/20 text-cyan-400",
  };
  return map[name] ?? "bg-muted text-muted-foreground";
};

// ── Component ──────────────────────────────────────────
export default function ContentPipeline() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [board, setBoard] = useState<PipelineBoard>({ ideas: [], script: [], thumbnail: [], filming: [], editing: [] });
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogStage, setDialogStage] = useState<StageId>("ideas");

  // Form state
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newAssignee, setNewAssignee] = useState("Miguel");
  const [newApproval, setNewApproval] = useState<ApprovalStatus>("pending");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  // Fetch data
  useEffect(() => {
    if (!user) return;
    const fetchCards = async () => {
      const { data } = await supabase
        .from("content_pipeline")
        .select("*")
        .eq("user_id", user.id)
        .order("sort_order", { ascending: true });

      if (data) {
        const grouped: PipelineBoard = { ideas: [], script: [], thumbnail: [], filming: [], editing: [] };
        (data as ContentCard[]).forEach((card) => {
          if (grouped[card.stage as StageId]) grouped[card.stage as StageId].push(card);
        });
        setBoard(grouped);
      }
      setLoading(false);
    };
    fetchCards();
  }, [user]);

  // Drag handler
  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const srcCol = source.droppableId as StageId;
    const dstCol = destination.droppableId as StageId;
    const srcItems = [...board[srcCol]];
    const dstItems = srcCol === dstCol ? srcItems : [...board[dstCol]];
    const [moved] = srcItems.splice(source.index, 1);
    moved.stage = dstCol;
    dstItems.splice(destination.index, 0, moved);

    // Update sort_order
    dstItems.forEach((item, i) => (item.sort_order = i));
    if (srcCol !== dstCol) srcItems.forEach((item, i) => (item.sort_order = i));

    setBoard((prev) => ({
      ...prev,
      [srcCol]: srcItems,
      ...(srcCol !== dstCol ? { [dstCol]: dstItems } : {}),
    }));

    // Persist
    await supabase.from("content_pipeline").update({ stage: dstCol, sort_order: moved.sort_order }).eq("id", moved.id);
  };

  // Upload image
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploadingImage(true);
    setPreviewUrl(URL.createObjectURL(file));

    const ext = file.name.split(".").pop();
    const path = `${user.id}/${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from("content-thumbnails").upload(path, file);

    if (error) {
      toast({ title: "Erro no upload", description: error.message, variant: "destructive" });
      setPreviewUrl(null);
    } else {
      const { data: urlData } = supabase.storage.from("content-thumbnails").getPublicUrl(path);
      setUploadedUrl(urlData.publicUrl);
    }
    setUploadingImage(false);
  };

  // Create card
  const createCard = async () => {
    if (!newTitle.trim() || !user) return;
    const maxOrder = board[dialogStage].length;
    const { data, error } = await supabase
      .from("content_pipeline")
      .insert({
        title: newTitle.trim(),
        description: newDesc.trim(),
        stage: dialogStage,
        approval_status: newApproval,
        assignee: newAssignee,
        image_url: uploadedUrl,
        sort_order: maxOrder,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      return;
    }
    setBoard((prev) => ({ ...prev, [dialogStage]: [...prev[dialogStage], data as ContentCard] }));
    resetForm();
    setDialogOpen(false);
    toast({ title: "Conteúdo criado!" });
  };

  const deleteCard = async (id: string, stage: StageId) => {
    await supabase.from("content_pipeline").delete().eq("id", id);
    setBoard((prev) => ({ ...prev, [stage]: prev[stage].filter((c) => c.id !== id) }));
  };

  const cycleApproval = async (card: ContentCard) => {
    const order: ApprovalStatus[] = ["pending", "approved", "rejected"];
    const next = order[(order.indexOf(card.approval_status as ApprovalStatus) + 1) % 3];
    await supabase.from("content_pipeline").update({ approval_status: next }).eq("id", card.id);
    setBoard((prev) => ({
      ...prev,
      [card.stage]: prev[card.stage].map((c) => (c.id === card.id ? { ...c, approval_status: next } : c)),
    }));
  };

  const resetForm = () => {
    setNewTitle("");
    setNewDesc("");
    setNewAssignee("Miguel");
    setNewApproval("pending");
    setPreviewUrl(null);
    setUploadedUrl(null);
  };

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
    <div className="h-[calc(100vh)] flex flex-col overflow-hidden">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="shrink-0 border-b border-border px-4 sm:px-6 py-3 flex items-center gap-4"
      >
        <div className="flex-1">
          <h1 className="font-heading text-xl font-medium text-foreground tracking-tight">CONTENT PIPELINE</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Pipeline de produção de conteúdo</p>
        </div>

        {/* Stage legend */}
        <div className="hidden lg:flex items-center gap-3">
          {STAGES.map((s) => (
            <div key={s.id} className="flex items-center gap-1.5">
              <span className={cn("w-2 h-2 rounded-full", s.accent)} />
              <span className="text-[10px] text-muted-foreground">{s.title}</span>
            </div>
          ))}
        </div>
      </motion.header>

      {/* Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-4 p-4 sm:p-6 h-full min-w-max">
            {STAGES.map((stage, ci) => {
              const cards = board[stage.id];
              const StageIcon = stage.icon;
              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: ci * 0.08 }}
                  className="w-72 sm:w-80 flex flex-col shrink-0"
                >
                  {/* Column header */}
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", stage.accent + "/20")}>
                        <StageIcon className={cn("w-3.5 h-3.5", stage.accent.replace("bg-", "text-"))} />
                      </div>
                      <span className="text-sm font-semibold text-foreground">{stage.title}</span>
                      <span className="text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-md">{cards.length}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => { setDialogStage(stage.id); resetForm(); setDialogOpen(true); }}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                  {/* Drop zone */}
                  <Droppable droppableId={stage.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={cn(
                          "flex-1 rounded-xl p-2 space-y-2 transition-colors overflow-y-auto",
                          snapshot.isDraggingOver ? "bg-primary/5 ring-1 ring-primary/20" : "bg-secondary/30"
                        )}
                      >
                        <AnimatePresence>
                          {cards.map((card, ti) => {
                            const approval = approvalMeta[card.approval_status as ApprovalStatus] ?? approvalMeta.pending;
                            const ApprovalIcon = approval.icon;
                            return (
                              <Draggable key={card.id} draggableId={card.id} index={ti}>
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
                                        <img src={card.image_url} alt={card.title} className="w-full h-full object-cover" />
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
                                          <p className="text-sm font-medium text-foreground leading-tight">{card.title}</p>
                                          {card.description && (
                                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{card.description}</p>
                                          )}
                                        </div>
                                        <button
                                          onClick={() => deleteCard(card.id, stage.id)}
                                          className="opacity-0 group-hover:opacity-60 hover:!opacity-100 transition-opacity"
                                        >
                                          <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                                        </button>
                                      </div>

                                      {/* Footer */}
                                      <div className="flex items-center justify-between mt-3">
                                        <button
                                          onClick={() => cycleApproval(card)}
                                          className={cn("flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded ring-1 transition-colors", approval.cls)}
                                        >
                                          <ApprovalIcon className="w-3 h-3" />
                                          {approval.label}
                                        </button>
                                        {card.assignee && (
                                          <Avatar className="h-5 w-5">
                                            <AvatarFallback className={cn("text-[10px] font-medium", avatarColor(card.assignee))}>
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
                          })}
                        </AnimatePresence>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </motion.div>
              );
            })}
          </div>
        </div>
      </DragDropContext>

      {/* New Card Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Novo Conteúdo — {STAGES.find((s) => s.id === dialogStage)?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label className="text-xs text-muted-foreground">Título</Label>
              <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Ex: Review do produto X" className="mt-1 bg-secondary border-border" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Descrição / Roteiro</Label>
              <Textarea value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Descreva o conteúdo ou cole o roteiro..." className="mt-1 bg-secondary border-border min-h-[80px]" />
            </div>

            {/* Image upload */}
            <div>
              <Label className="text-xs text-muted-foreground">Thumbnail / Imagem</Label>
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              {previewUrl ? (
                <div className="mt-1 relative rounded-lg overflow-hidden h-36">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                  <button
                    onClick={() => { setPreviewUrl(null); setUploadedUrl(null); }}
                    className="absolute top-2 right-2 bg-black/60 rounded-full p-1 text-white hover:bg-black/80"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-1 w-full h-24 rounded-lg border border-dashed border-border bg-secondary/50 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                >
                  <Upload className="w-5 h-5" />
                  <span className="text-xs">Clique para enviar</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Responsável</Label>
                <Select value={newAssignee} onValueChange={setNewAssignee}>
                  <SelectTrigger className="mt-1 bg-secondary border-border text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ASSIGNEES.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Aprovação</Label>
                <Select value={newApproval} onValueChange={(v) => setNewApproval(v as ApprovalStatus)}>
                  <SelectTrigger className="mt-1 bg-secondary border-border text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pendente</SelectItem>
                    <SelectItem value="approved">Aprovado</SelectItem>
                    <SelectItem value="rejected">Rejeitado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              onClick={createCard}
              disabled={!newTitle.trim() || uploadingImage}
              className="w-full bg-gradient-to-r from-primary to-orange-400 hover:opacity-90 text-primary-foreground"
            >
              Criar Conteúdo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </AppLayout>
  );
}
