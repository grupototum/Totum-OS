import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  ArrowLeft,
  X,
  GripVertical,
  Filter,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────
type ColumnId = "backlog" | "todo" | "doing" | "done";

interface TaskLabel {
  text: string;
  color: string;
}

interface Task {
  id: string;
  title: string;
  description: string;
  assignee: string;
  labels: TaskLabel[];
  agent: string;
  createdAt: Date;
}

type Board = Record<ColumnId, Task[]>;

// ── Constants ──────────────────────────────────────────
const COLUMNS: { id: ColumnId; title: string; accent: string }[] = [
  { id: "backlog", title: "Backlog", accent: "bg-muted-foreground/60" },
  { id: "todo", title: "Todo", accent: "bg-sky-500" },
  { id: "doing", title: "Doing", accent: "bg-amber-500" },
  { id: "done", title: "Done", accent: "bg-emerald-500" },
];

const AGENTS = [
  "Radar de Insights",
  "Gestor de Tráfego",
  "Planejamento Social",
  "Atendente Totum",
  "SDR Comercial",
  "Kimi",
  "Radar de Anúncios",
];

const LABEL_OPTIONS: TaskLabel[] = [
  { text: "Urgente", color: "bg-red-500/20 text-red-400 ring-red-500/30" },
  { text: "Feature", color: "bg-violet-500/20 text-violet-400 ring-violet-500/30" },
  { text: "Bug", color: "bg-orange-500/20 text-orange-400 ring-orange-500/30" },
  { text: "Melhoria", color: "bg-sky-500/20 text-sky-400 ring-sky-500/30" },
  { text: "Design", color: "bg-pink-500/20 text-pink-400 ring-pink-500/30" },
  { text: "Conteúdo", color: "bg-emerald-500/20 text-emerald-400 ring-emerald-500/30" },
];

const SEED_TASKS: Board = {
  backlog: [
    { id: "t1", title: "Análise de concorrentes Q2", description: "Mapear principais concorrentes e extrair insights estratégicos.", assignee: "Miguel", labels: [LABEL_OPTIONS[1]], agent: "Radar de Insights", createdAt: new Date() },
    { id: "t2", title: "Template email outreach", description: "Criar templates de email para prospecção automatizada.", assignee: "Liz", labels: [LABEL_OPTIONS[3]], agent: "SDR Comercial", createdAt: new Date() },
  ],
  todo: [
    { id: "t3", title: "Campanha Google Ads Abril", description: "Configurar campanha de search para novo produto.", assignee: "Jarvis", labels: [LABEL_OPTIONS[1], LABEL_OPTIONS[0]], agent: "Gestor de Tráfego", createdAt: new Date() },
    { id: "t4", title: "Calendário editorial Abril", description: "Planejar posts para Instagram e LinkedIn.", assignee: "Liz", labels: [LABEL_OPTIONS[5]], agent: "Planejamento Social", createdAt: new Date() },
  ],
  doing: [
    { id: "t5", title: "Treinar base de conhecimento", description: "Atualizar FAQs e respostas do bot de atendimento.", assignee: "Miguel", labels: [LABEL_OPTIONS[3]], agent: "Atendente Totum", createdAt: new Date() },
  ],
  done: [
    { id: "t6", title: "Relatório Meta Ads Março", description: "Gerar relatório mensal de performance.", assignee: "Jarvis", labels: [LABEL_OPTIONS[1]], agent: "Gestor de Tráfego", createdAt: new Date() },
  ],
};

// ── Helpers ────────────────────────────────────────────
const avatarColor = (name: string) => {
  const map: Record<string, string> = {
    Miguel: "bg-orange-500/20 text-orange-400",
    Liz: "bg-violet-500/20 text-violet-400",
    Jarvis: "bg-cyan-500/20 text-cyan-400",
  };
  return map[name] ?? "bg-muted text-muted-foreground";
};

// ── Component ──────────────────────────────────────────
export default function TasksBoard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [board, setBoard] = useState<Board>(SEED_TASKS);
  const [search, setSearch] = useState("");
  const [filterAgent, setFilterAgent] = useState("all");
  const [filterLabel, setFilterLabel] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogColumn, setDialogColumn] = useState<ColumnId>("backlog");

  // New task form
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newAssignee, setNewAssignee] = useState("Miguel");
  const [newAgent, setNewAgent] = useState(AGENTS[0]);
  const [newLabels, setNewLabels] = useState<TaskLabel[]>([]);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [user, loading, navigate]);

  // Drag handler
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const srcCol = source.droppableId as ColumnId;
    const dstCol = destination.droppableId as ColumnId;
    const srcItems = [...board[srcCol]];
    const dstItems = srcCol === dstCol ? srcItems : [...board[dstCol]];
    const [moved] = srcItems.splice(source.index, 1);
    dstItems.splice(destination.index, 0, moved);

    setBoard((prev) => ({
      ...prev,
      [srcCol]: srcItems,
      ...(srcCol !== dstCol ? { [dstCol]: dstItems } : {}),
    }));
  };

  // Filter
  const filterTasks = (tasks: Task[]) =>
    tasks.filter((t) => {
      if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterAgent !== "all" && t.agent !== filterAgent) return false;
      if (filterLabel !== "all" && !t.labels.some((l) => l.text === filterLabel)) return false;
      return true;
    });

  // Create task
  const createTask = () => {
    if (!newTitle.trim()) return;
    const task: Task = {
      id: crypto.randomUUID(),
      title: newTitle.trim(),
      description: newDesc.trim(),
      assignee: newAssignee,
      labels: newLabels,
      agent: newAgent,
      createdAt: new Date(),
    };
    setBoard((prev) => ({ ...prev, [dialogColumn]: [...prev[dialogColumn], task] }));
    setNewTitle("");
    setNewDesc("");
    setNewLabels([]);
    setDialogOpen(false);
  };

  const toggleLabel = (label: TaskLabel) => {
    setNewLabels((prev) =>
      prev.some((l) => l.text === label.text) ? prev.filter((l) => l.text !== label.text) : [...prev, label]
    );
  };

  const totalTasks = useMemo(() => Object.values(board).flat().length, [board]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="shrink-0 border-b border-border px-4 sm:px-6 py-3 flex items-center gap-4"
      >
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => navigate("/hub")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="font-heading text-lg font-bold text-foreground">Tasks Board</h1>
          <p className="text-xs text-muted-foreground">{totalTasks} tarefas</p>
        </div>

        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 w-64">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar tarefas..."
              className="pl-8 h-8 text-xs bg-secondary border-border"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2">
                <X className="w-3 h-3 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="hidden md:flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-muted-foreground" />
          <Select value={filterAgent} onValueChange={setFilterAgent}>
            <SelectTrigger className="h-8 w-40 text-xs bg-secondary border-border">
              <SelectValue placeholder="Agente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os agentes</SelectItem>
              {AGENTS.map((a) => (
                <SelectItem key={a} value={a}>{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterLabel} onValueChange={setFilterLabel}>
            <SelectTrigger className="h-8 w-32 text-xs bg-secondary border-border">
              <SelectValue placeholder="Label" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas labels</SelectItem>
              {LABEL_OPTIONS.map((l) => (
                <SelectItem key={l.text} value={l.text}>{l.text}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.header>

      {/* Mobile search */}
      <div className="sm:hidden px-4 py-2 border-b border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar tarefas..."
            className="pl-8 h-8 text-xs bg-secondary border-border"
          />
        </div>
      </div>

      {/* Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-4 p-4 sm:p-6 h-full min-w-max">
            {COLUMNS.map((col, ci) => {
              const tasks = filterTasks(board[col.id]);
              return (
                <motion.div
                  key={col.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: ci * 0.08 }}
                  className="w-72 sm:w-80 flex flex-col shrink-0"
                >
                  {/* Column header */}
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2">
                      <span className={cn("w-2.5 h-2.5 rounded-full", col.accent)} />
                      <span className="text-sm font-semibold text-foreground">{col.title}</span>
                      <span className="text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-md">
                        {tasks.length}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-foreground"
                      onClick={() => { setDialogColumn(col.id); setDialogOpen(true); }}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                  {/* Drop zone */}
                  <Droppable droppableId={col.id}>
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
                          {tasks.map((task, ti) => (
                            <Draggable key={task.id} draggableId={task.id} index={ti}>
                              {(prov, snap) => (
                                <div
                                  ref={prov.innerRef}
                                  {...prov.draggableProps}
                                  className={cn(
                                    "rounded-lg bg-card border border-border p-3 group transition-shadow",
                                    snap.isDragging && "shadow-xl shadow-primary/10 ring-1 ring-primary/30"
                                  )}
                                >
                                  <div className="flex items-start gap-2">
                                    <div
                                      {...prov.dragHandleProps}
                                      className="mt-0.5 opacity-0 group-hover:opacity-60 transition-opacity cursor-grab"
                                    >
                                      <GripVertical className="w-3.5 h-3.5 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-foreground leading-tight">{task.title}</p>
                                      {task.description && (
                                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                                      )}
                                      {task.labels.length > 0 && (
                                        <div className="flex flex-wrap gap-1 mt-2">
                                          {task.labels.map((l) => (
                                            <span
                                              key={l.text}
                                              className={cn("text-[10px] px-1.5 py-0.5 rounded ring-1", l.color)}
                                            >
                                              {l.text}
                                            </span>
                                          ))}
                                        </div>
                                      )}
                                      <div className="flex items-center justify-between mt-2.5">
                                        <span className="text-[10px] text-muted-foreground/60">{task.agent}</span>
                                        <Avatar className="h-5 w-5">
                                          <AvatarFallback className={cn("text-[10px] font-medium", avatarColor(task.assignee))}>
                                            {task.assignee.charAt(0)}
                                          </AvatarFallback>
                                        </Avatar>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))}
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

      {/* New Task Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-card border-border sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Nova Tarefa — {COLUMNS.find((c) => c.id === dialogColumn)?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div>
              <Label className="text-xs text-muted-foreground">Título</Label>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ex: Criar campanha de ads"
                className="mt-1 bg-secondary border-border"
              />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Descrição</Label>
              <Textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Detalhes da tarefa..."
                className="mt-1 bg-secondary border-border min-h-[70px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Responsável</Label>
                <Select value={newAssignee} onValueChange={setNewAssignee}>
                  <SelectTrigger className="mt-1 bg-secondary border-border text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["Miguel", "Liz", "Jarvis"].map((a) => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Agente</Label>
                <Select value={newAgent} onValueChange={setNewAgent}>
                  <SelectTrigger className="mt-1 bg-secondary border-border text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AGENTS.map((a) => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Labels</Label>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {LABEL_OPTIONS.map((l) => (
                  <button
                    key={l.text}
                    onClick={() => toggleLabel(l)}
                    className={cn(
                      "text-[11px] px-2 py-1 rounded-md ring-1 transition-all",
                      l.color,
                      newLabels.some((nl) => nl.text === l.text) ? "opacity-100 scale-105" : "opacity-50 hover:opacity-80"
                    )}
                  >
                    {l.text}
                  </button>
                ))}
              </div>
            </div>
            <Button
              onClick={createTask}
              disabled={!newTitle.trim()}
              className="w-full bg-gradient-to-r from-primary to-orange-400 hover:opacity-90 text-primary-foreground"
            >
              Criar Tarefa
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
