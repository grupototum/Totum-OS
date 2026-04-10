import AppLayout from "@/components/layout/AppLayout";
import { motion, AnimatePresence } from "framer-motion";
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Search, LayoutGrid, List, Columns3, Plus, Download,
  Mail, ChevronRight, Building2, User, Phone, Globe,
  MoreHorizontal, Pencil, Trash2, Eye,
} from "lucide-react";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* ─── types ─── */
interface Client {
  id: string;
  company_name: string;
  cnpj: string | null;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  industry: string | null;
  business_description: string | null;
  company_size: string | null;
  monthly_revenue: string | null;
  brand_tone: string | null;
  crm_used: string | null;
  sla_response: string | null;
  status: string;
  primary_color: string | null;
  support_channels: string[] | null;
  created_at: string | null;
}

type ViewMode = "list" | "grid" | "kanban";
const _STATUS_OPTIONS = ["all", "active", "pending", "inactive"];
const KANBAN_COLS: { key: string; label: string; color: string }[] = [
  { key: "pending", label: "Novos / Pendentes", color: "border-amber-500/40" },
  { key: "active", label: "Ativos", color: "border-emerald-500/40" },
  { key: "inactive", label: "Inativos", color: "border-muted-foreground/40" },
];

const STATUS_BADGE: Record<string, string> = {
  active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  pending: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  inactive: "bg-muted text-muted-foreground border-border/40",
};

const INDUSTRY_COLORS: Record<string, string> = {
  Tecnologia: "bg-sky-500/20 text-sky-400 border-sky-500/30",
  Saúde: "bg-rose-500/20 text-rose-400 border-rose-500/30",
  Educação: "bg-violet-500/20 text-violet-400 border-violet-500/30",
  "E-commerce": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Serviços: "bg-teal-500/20 text-teal-400 border-teal-500/30",
};

const anim = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.04, duration: 0.3 },
});

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "agora";
  if (h < 24) return `${h}h atrás`;
  const d = Math.floor(h / 24);
  return `${d}d atrás`;
}

/* ─── page ─── */
export default function ClientsCenter() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [detailClient, setDetailClient] = useState<Client | null>(null);
  const navigate = useNavigate();

  const fetchClients = useCallback(async () => {
    const { data } = await supabase.from("clients").select("*").order("created_at", { ascending: false });
    if (data) setClients(data as Client[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchClients();
    const ch = supabase.channel("clients-rt")
      .on("postgres_changes" as any, { event: "*", schema: "public", table: "clients" }, () => fetchClients())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [fetchClients]);

  const industries = useMemo(() => [...new Set(clients.map((c) => c.industry).filter(Boolean))] as string[], [clients]);

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      const q = search.toLowerCase();
      const matchSearch = !q || c.company_name.toLowerCase().includes(q) || (c.cnpj ?? "").includes(q) || (c.contact_name ?? "").toLowerCase().includes(q);
      const matchStatus = statusFilter === "all" || c.status === statusFilter;
      const matchIndustry = industryFilter === "all" || c.industry === industryFilter;
      return matchSearch && matchStatus && matchIndustry;
    });
  }, [clients, search, statusFilter, industryFilter]);

  const toggleSelect = (id: string) => {
    setSelected((prev) => { const n = new Set(prev); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  };
  const toggleAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map((c) => c.id)));
  };

  const deleteClient = async (id: string) => {
    await supabase.from("clients").delete().eq("id", id);
    toast({ title: "🗑️ Cliente removido" });
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("clients").update({ status } as any).eq("id", id);
    toast({ title: "✅ Status atualizado" });
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="p-6 max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-12 w-full rounded-xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-48 rounded-xl" />)}
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div {...anim(0)} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-sans text-2xl font-semibold text-foreground tracking-tight">CENTRAL DE CLIENTES</h1>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">
              {clients.length} clientes cadastrados · {clients.filter((c) => c.status === "active").length} ativos
            </p>
          </div>
          <Button onClick={() => navigate("/new-client")} className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm">
            <Plus className="w-4 h-4 mr-2" /> Novo Cliente
          </Button>
        </motion.div>

        {/* Filters bar */}
        <motion.div {...anim(1)}>
          <Card className="border-border/40 bg-card/80">
            <CardContent className="p-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por nome, CNPJ ou responsável..." className="pl-9 bg-secondary border-border/40 h-9 text-sm" />
              </div>
              <div className="flex gap-2 flex-wrap items-center">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-secondary border-border/40 h-9 w-32 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="active">Ativos</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                    <SelectItem value="inactive">Inativos</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={industryFilter} onValueChange={setIndustryFilter}>
                  <SelectTrigger className="bg-secondary border-border/40 h-9 w-36 text-xs"><SelectValue placeholder="Ramo" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os Ramos</SelectItem>
                    {industries.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}
                  </SelectContent>
                </Select>
                <div className="flex border border-border/40 rounded-lg overflow-hidden">
                  {([["list", List], ["grid", LayoutGrid], ["kanban", Columns3]] as [ViewMode, typeof List][]).map(([mode, Icon]) => (
                    <button key={mode} onClick={() => setViewMode(mode)} className={`p-2 transition-colors ${viewMode === mode ? "bg-primary/20 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Batch actions */}
        {selected.size > 0 && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">{selected.size} selecionado(s)</span>
            <Button variant="outline" size="sm" className="text-xs border-border/40"><Download className="w-3 h-3 mr-1" /> Exportar</Button>
            <Button variant="outline" size="sm" className="text-xs border-border/40"><Mail className="w-3 h-3 mr-1" /> Mensagem</Button>
          </motion.div>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <Card className="border-border/40 bg-card/60 p-12 text-center">
            <Building2 className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
            <p className="text-muted-foreground">Nenhum cliente encontrado</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Altere os filtros ou cadastre um novo cliente</p>
          </Card>
        )}

        {/* ─── LIST VIEW ─── */}
        {viewMode === "list" && filtered.length > 0 && (
          <motion.div {...anim(2)}>
            <Card className="border-border/40 bg-card/80 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/30">
                      <th className="p-3 text-left w-8"><Checkbox checked={selected.size === filtered.length && filtered.length > 0} onCheckedChange={toggleAll} /></th>
                      <th className="p-3 text-left text-[10px] text-muted-foreground uppercase font-medium">Empresa</th>
                      <th className="p-3 text-left text-[10px] text-muted-foreground uppercase font-medium hidden md:table-cell">Responsável</th>
                      <th className="p-3 text-left text-[10px] text-muted-foreground uppercase font-medium hidden lg:table-cell">Ramo</th>
                      <th className="p-3 text-left text-[10px] text-muted-foreground uppercase font-medium">Status</th>
                      <th className="p-3 text-left text-[10px] text-muted-foreground uppercase font-medium hidden lg:table-cell">Cadastro</th>
                      <th className="p-3 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((c) => (
                      <tr key={c.id} className="border-b border-border/20 hover:bg-secondary/30 transition-colors cursor-pointer" onClick={() => setDetailClient(c)}>
                        <td className="p-3" onClick={(e) => e.stopPropagation()}><Checkbox checked={selected.has(c.id)} onCheckedChange={() => toggleSelect(c.id)} /></td>
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold shrink-0" style={{ backgroundColor: (c.primary_color ?? "#f76926") + "20", color: c.primary_color ?? "#f76926" }}>
                              {c.company_name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{c.company_name}</p>
                              <p className="text-[10px] text-muted-foreground">{c.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 hidden md:table-cell">
                          <div className="flex items-center gap-2"><User className="w-3 h-3 text-muted-foreground" /><span className="text-foreground text-xs">{c.contact_name ?? "—"}</span></div>
                        </td>
                        <td className="p-3 hidden lg:table-cell">
                          {c.industry && <Badge variant="outline" className={`text-[10px] ${INDUSTRY_COLORS[c.industry] ?? "bg-muted text-muted-foreground"}`}>{c.industry}</Badge>}
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className={`text-[10px] capitalize ${STATUS_BADGE[c.status]}`}>{c.status === "active" ? "Ativo" : c.status === "pending" ? "Pendente" : "Inativo"}</Badge>
                        </td>
                        <td className="p-3 hidden lg:table-cell text-xs text-muted-foreground">{timeAgo(c.created_at)}</td>
                        <td className="p-3" onClick={(e) => e.stopPropagation()}>
                          <ClientActions client={c} onDelete={deleteClient} onStatusChange={updateStatus} onView={() => setDetailClient(c)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        )}

        {/* ─── GRID VIEW ─── */}
        {viewMode === "grid" && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filtered.map((c, i) => (
                <motion.div key={c.id} layout {...anim(i + 2)} exit={{ opacity: 0, scale: 0.95 }}>
                  <Card className="border-border/40 bg-card/80 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer group" onClick={() => setDetailClient(c)}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold" style={{ backgroundColor: (c.primary_color ?? "#f76926") + "20", color: c.primary_color ?? "#f76926" }}>
                          {c.company_name.charAt(0)}
                        </div>
                        <div onClick={(e) => e.stopPropagation()}>
                          <ClientActions client={c} onDelete={deleteClient} onStatusChange={updateStatus} onView={() => setDetailClient(c)} />
                        </div>
                      </div>
                      <h3 className="font-medium text-foreground mb-1">{c.company_name}</h3>
                      {c.industry && <Badge variant="outline" className={`text-[10px] mb-3 ${INDUSTRY_COLORS[c.industry] ?? "bg-muted text-muted-foreground"}`}>{c.industry}</Badge>}
                      <div className="border-t border-border/30 pt-3 mt-2">
                        <div className="flex items-center gap-2 mb-1"><User className="w-3 h-3 text-muted-foreground" /><span className="text-xs text-foreground">{c.contact_name ?? "—"}</span></div>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline" className={`text-[10px] capitalize ${STATUS_BADGE[c.status]}`}>{c.status === "active" ? "Ativo" : c.status === "pending" ? "Pendente" : "Inativo"}</Badge>
                          <span className="text-[10px] text-muted-foreground">{timeAgo(c.created_at)}</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" className="w-full mt-3 text-xs text-primary hover:text-primary group-hover:bg-primary/10">
                        Ver detalhes <ChevronRight className="w-3 h-3 ml-1" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* ─── KANBAN VIEW ─── */}
        {viewMode === "kanban" && (
          <DragDropContext onDragEnd={(result: DropResult) => {
            if (!result.destination) return;
            const newStatus = result.destination.droppableId;
            const clientId = result.draggableId;
            if (newStatus !== result.source.droppableId) {
              updateStatus(clientId, newStatus);
            }
          }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {KANBAN_COLS.map((col) => {
                const colClients = filtered.filter((c) => c.status === col.key);
                return (
                  <div key={col.key}>
                    <Card className={`border-t-2 ${col.color} border-border/40 bg-card/60`}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm flex items-center justify-between">
                          {col.label}
                          <Badge variant="outline" className="text-[10px] bg-muted text-muted-foreground">{colClients.length}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <Droppable droppableId={col.key}>
                        {(provided, snapshot) => (
                          <CardContent
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`space-y-3 min-h-[200px] transition-colors ${snapshot.isDraggingOver ? "bg-primary/5 rounded-b-lg" : ""}`}
                          >
                            {colClients.length === 0 && !snapshot.isDraggingOver && (
                              <div className="text-center py-8 text-xs text-muted-foreground/50">Vazio</div>
                            )}
                            {colClients.map((c, index) => (
                              <Draggable key={c.id} draggableId={c.id} index={index}>
                                {(dragProvided, dragSnapshot) => (
                                  <div
                                    ref={dragProvided.innerRef}
                                    {...dragProvided.draggableProps}
                                    {...dragProvided.dragHandleProps}
                                    className={`p-3 rounded-lg bg-secondary/40 hover:bg-secondary/60 cursor-grab active:cursor-grabbing transition-colors ${dragSnapshot.isDragging ? "shadow-lg ring-2 ring-primary/30" : ""}`}
                                    onClick={() => setDetailClient(c)}
                                  >
                                    <div className="flex items-center gap-2 mb-2">
                                      <div className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold shrink-0" style={{ backgroundColor: (c.primary_color ?? "#f76926") + "20", color: c.primary_color ?? "#f76926" }}>
                                        {c.company_name.charAt(0)}
                                      </div>
                                      <div className="min-w-0">
                                        <p className="text-sm font-medium text-foreground truncate">{c.company_name}</p>
                                        <p className="text-[10px] text-muted-foreground">{c.contact_name}</p>
                                      </div>
                                    </div>
                                    {c.industry && <Badge variant="outline" className={`text-[9px] ${INDUSTRY_COLORS[c.industry] ?? ""}`}>{c.industry}</Badge>}
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </CardContent>
                        )}
                      </Droppable>
                    </Card>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        )}

        {/* ─── DETAIL DIALOG ─── */}
        <Dialog open={!!detailClient} onOpenChange={() => setDetailClient(null)}>
          <DialogContent className="bg-card border-border/40 max-w-lg max-h-[80vh] overflow-y-auto">
            {detailClient && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold" style={{ backgroundColor: (detailClient.primary_color ?? "#f76926") + "20", color: detailClient.primary_color ?? "#f76926" }}>
                      {detailClient.company_name.charAt(0)}
                    </div>
                    <div>
                      <DialogTitle className="text-lg">{detailClient.company_name}</DialogTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">{detailClient.cnpj}</p>
                      <Badge variant="outline" className={`text-[10px] mt-1 capitalize ${STATUS_BADGE[detailClient.status]}`}>
                        {detailClient.status === "active" ? "Ativo" : detailClient.status === "pending" ? "Pendente" : "Inativo"}
                      </Badge>
                    </div>
                  </div>
                </DialogHeader>

                <div className="space-y-4 mt-4">
                  {/* Contact info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {detailClient.contact_name && <InfoRow icon={User} label="Responsável" value={detailClient.contact_name} />}
                    {detailClient.email && <InfoRow icon={Mail} label="Email" value={detailClient.email} />}
                    {detailClient.phone && <InfoRow icon={Phone} label="Telefone" value={detailClient.phone} />}
                    {detailClient.website && <InfoRow icon={Globe} label="Site" value={detailClient.website} />}
                  </div>

                  {/* Business info */}
                  <div className="border-t border-border/30 pt-3 space-y-2">
                    <p className="text-[10px] text-muted-foreground uppercase font-medium">Negócio</p>
                    <div className="flex flex-wrap gap-2">
                      {detailClient.industry && <Badge variant="outline" className={`text-[10px] ${INDUSTRY_COLORS[detailClient.industry] ?? ""}`}>{detailClient.industry}</Badge>}
                      {detailClient.company_size && <Badge variant="outline" className="text-[10px] bg-muted text-muted-foreground">{detailClient.company_size}</Badge>}
                      {detailClient.monthly_revenue && <Badge variant="outline" className="text-[10px] bg-muted text-muted-foreground">{detailClient.monthly_revenue}</Badge>}
                      {detailClient.brand_tone && <Badge variant="outline" className="text-[10px] bg-muted text-muted-foreground">Tom: {detailClient.brand_tone}</Badge>}
                    </div>
                    {detailClient.business_description && <p className="text-xs text-muted-foreground mt-2">{detailClient.business_description}</p>}
                  </div>

                  {/* Operational */}
                  <div className="border-t border-border/30 pt-3 space-y-2">
                    <p className="text-[10px] text-muted-foreground uppercase font-medium">Operação</p>
                    <div className="flex flex-wrap gap-2">
                      {detailClient.crm_used && <Badge variant="outline" className="text-[10px] bg-sky-500/10 text-sky-400 border-sky-500/30">CRM: {detailClient.crm_used}</Badge>}
                      {detailClient.sla_response && <Badge variant="outline" className="text-[10px] bg-amber-500/10 text-amber-400 border-amber-500/30">SLA: {detailClient.sla_response}</Badge>}
                    </div>
                    {detailClient.support_channels && detailClient.support_channels.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {detailClient.support_channels.map((ch) => (
                          <Badge key={ch} variant="outline" className="text-[9px] bg-secondary text-secondary-foreground">{ch}</Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" className="flex-1 text-xs border-border/40" onClick={() => { setDetailClient(null); navigate(`/edit-client/${detailClient.id}`); }}>
                      <Pencil className="w-3 h-3 mr-1" /> Editar
                    </Button>
                    <Button variant="outline" className="flex-1 text-xs border-border/40 text-destructive hover:text-destructive" onClick={() => { deleteClient(detailClient.id); setDetailClient(null); }}>
                      <Trash2 className="w-3 h-3 mr-1" /> Remover
                    </Button>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}

/* ─── sub-components ─── */
function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 bg-secondary/30 rounded-lg p-2.5">
      <Icon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] text-muted-foreground">{label}</p>
        <p className="text-xs text-foreground truncate">{value}</p>
      </div>
    </div>
  );
}

function ClientActions({ client, onDelete, onStatusChange, onView }: { client: Client; onDelete: (id: string) => void; onStatusChange: (id: string, status: string) => void; onView: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="p-1.5 rounded-lg hover:bg-secondary/60 text-muted-foreground hover:text-foreground transition-colors">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-card border-border/40">
        <DropdownMenuItem onClick={onView} className="text-xs"><Eye className="w-3 h-3 mr-2" /> Ver detalhes</DropdownMenuItem>
        {client.status !== "active" && <DropdownMenuItem onClick={() => onStatusChange(client.id, "active")} className="text-xs text-emerald-400">Marcar como Ativo</DropdownMenuItem>}
        {client.status !== "inactive" && <DropdownMenuItem onClick={() => onStatusChange(client.id, "inactive")} className="text-xs text-muted-foreground">Desativar</DropdownMenuItem>}
        <DropdownMenuItem onClick={() => onDelete(client.id)} className="text-xs text-destructive"><Trash2 className="w-3 h-3 mr-2" /> Remover</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
