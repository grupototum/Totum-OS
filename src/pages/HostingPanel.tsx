import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import AppLayout from '@/components/layout/AppLayout';
import {
  Server, Globe, Container, DollarSign, Shield,
  Plus, Edit, Trash2, Search, RefreshCw, Activity,
  CheckCircle, XCircle, AlertCircle, Users
} from 'lucide-react';

// ── Types ──
interface HostingClient {
  id: string; company_name: string; domain: string | null; contact_name: string | null;
  contact_email: string | null; status: string; monthly_value: number; payment_status: string;
  notes: string | null; created_at: string; updated_at: string;
}
interface HostingSubdomain {
  id: string; client_id: string; subdomain: string; base_domain: string;
  full_url: string; status: string; created_at: string;
}
interface HostingContainer {
  id: string; name: string; port: number | null; container_type: string;
  status: string; health_check_url: string | null; last_health_check: string | null;
  last_restart: string | null; created_at: string;
}
interface HostingBilling {
  id: string; client_id: string; month: string; amount: number;
  status: string; paid_at: string | null; receipt_url: string | null; created_at: string;
}
interface AuditLog {
  id: string; user_email: string | null; action: string;
  target: string | null; details: any; created_at: string;
}

// ── Helpers ──
const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    ativo: 'bg-green-100 text-green-700', inativo: 'bg-gray-100 text-gray-600',
    running: 'bg-green-100 text-green-700', stopped: 'bg-red-100 text-red-700',
    pago: 'bg-green-100 text-green-700', pendente: 'bg-yellow-100 text-yellow-700',
    atrasado: 'bg-red-100 text-red-700',
  };
  return map[status] || 'bg-gray-100 text-gray-600';
};

// ══════════════════════════════════════════════
// TAB 1 — Clientes
// ══════════════════════════════════════════════
function ClientsTab() {
  const [clients, setClients] = useState<HostingClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<HostingClient | null>(null);
  const [form, setForm] = useState({ company_name: '', domain: '', contact_name: '', contact_email: '', status: 'ativo', monthly_value: '0', notes: '' });

  const load = async () => {
    setLoading(true);
    const { data } = await (supabase as any).from('hosting_clients').select('*').order('company_name');
    setClients((data || []) as HostingClient[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm({ company_name: '', domain: '', contact_name: '', contact_email: '', status: 'ativo', monthly_value: '0', notes: '' }); setDialogOpen(true); };
  const openEdit = (c: HostingClient) => { setEditing(c); setForm({ company_name: c.company_name, domain: c.domain || '', contact_name: c.contact_name || '', contact_email: c.contact_email || '', status: c.status, monthly_value: String(c.monthly_value), notes: c.notes || '' }); setDialogOpen(true); };

  const save = async () => {
    if (!form.company_name) return;
    const payload = { ...form, monthly_value: Number(form.monthly_value), updated_at: new Date().toISOString() };
    if (editing) {
      await (supabase as any).from('hosting_clients').update(payload).eq('id', editing.id);
      toast.success('Cliente atualizado');
    } else {
      await (supabase as any).from('hosting_clients').insert(payload);
      toast.success('Cliente criado');
    }
    setDialogOpen(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Remover cliente?')) return;
    await (supabase as any).from('hosting_clients').delete().eq('id', id);
    toast.success('Cliente removido');
    load();
  };

  const filtered = clients.filter(c => c.company_name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar clientes..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />Novo Cliente</Button>
      </div>

      <Card className="overflow-hidden">
        {loading ? <div className="p-8 text-center text-muted-foreground">Carregando...</div> : filtered.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p>Nenhum cliente encontrado</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>{['Empresa', 'Domínio', 'Status', 'Valor Mensal', 'Pagamento', 'Ações'].map(h => <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(c => (
                <tr key={c.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-medium">{c.company_name}</p>
                    {c.contact_email && <p className="text-xs text-muted-foreground">{c.contact_email}</p>}
                  </td>
                  <td className="px-4 py-3 text-xs font-mono">{c.domain || '—'}</td>
                  <td className="px-4 py-3"><Badge className={`border-0 text-xs ${statusBadge(c.status)}`}>{c.status}</Badge></td>
                  <td className="px-4 py-3 font-medium">R$ {c.monthly_value.toFixed(2)}</td>
                  <td className="px-4 py-3"><Badge className={`border-0 text-xs ${statusBadge(c.payment_status)}`}>{c.payment_status}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(c)}><Edit className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => remove(c.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>{editing ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Empresa *</Label><Input value={form.company_name} onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))} className="mt-1" /></div>
              <div><Label className="text-xs">Domínio</Label><Input value={form.domain} onChange={e => setForm(f => ({ ...f, domain: e.target.value }))} placeholder="exemplo.com" className="mt-1" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Contato</Label><Input value={form.contact_name} onChange={e => setForm(f => ({ ...f, contact_name: e.target.value }))} className="mt-1" /></div>
              <div><Label className="text-xs">Email</Label><Input value={form.contact_email} onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))} className="mt-1" /></div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><Label className="text-xs">Status</Label>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="ativo">Ativo</SelectItem><SelectItem value="inativo">Inativo</SelectItem></SelectContent></Select>
              </div>
              <div><Label className="text-xs">Valor Mensal (R$)</Label><Input type="number" value={form.monthly_value} onChange={e => setForm(f => ({ ...f, monthly_value: e.target.value }))} className="mt-1" /></div>
              <div><Label className="text-xs">Notas</Label><Input value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className="mt-1" /></div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={save} disabled={!form.company_name}>{editing ? 'Salvar' : 'Criar'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ══════════════════════════════════════════════
// TAB 2 — Subdomínios
// ══════════════════════════════════════════════
function SubdomainsTab() {
  const [subdomains, setSubdomains] = useState<HostingSubdomain[]>([]);
  const [clients, setClients] = useState<HostingClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ client_id: '', subdomain: '', base_domain: 'grupototum.com' });
  const DOMAINS = ['grupototum.com', 'upixel.app', 'pixelsystem.online'];

  const load = async () => {
    setLoading(true);
    const [{ data: subs }, { data: cls }] = await Promise.all([
      (supabase as any).from('hosting_subdomains').select('*').order('created_at', { ascending: false }),
      (supabase as any).from('hosting_clients').select('id, company_name').order('company_name'),
    ]);
    setSubdomains((subs || []) as HostingSubdomain[]);
    setClients((cls || []) as HostingClient[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.client_id || !form.subdomain) { toast.error('Preencha todos os campos'); return; }
    const { error } = await (supabase as any).from('hosting_subdomains').insert(form);
    if (error) { toast.error(error.message); return; }
    toast.success(`Subdomínio ${form.subdomain}.${form.base_domain} criado!`);
    setForm(f => ({ ...f, subdomain: '' }));
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Remover subdomínio?')) return;
    await (supabase as any).from('hosting_subdomains').delete().eq('id', id);
    toast.success('Subdomínio removido');
    load();
  };

  const clientName = (id: string) => clients.find(c => c.id === id)?.company_name || '—';

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><Globe className="h-4 w-4" />Criar Subdomínio</h3>
        <div className="flex gap-3 items-end flex-wrap">
          <div className="flex-1 min-w-[180px]">
            <Label className="text-xs">Cliente</Label>
            <Select value={form.client_id} onValueChange={v => setForm(f => ({ ...f, client_id: v }))}><SelectTrigger className="mt-1"><SelectValue placeholder="Selecionar..." /></SelectTrigger><SelectContent>{clients.map(c => <SelectItem key={c.id} value={c.id}>{c.company_name}</SelectItem>)}</SelectContent></Select>
          </div>
          <div className="min-w-[140px]">
            <Label className="text-xs">Subdomínio</Label>
            <Input value={form.subdomain} onChange={e => setForm(f => ({ ...f, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))} placeholder="meu-app" className="mt-1" />
          </div>
          <div className="min-w-[180px]">
            <Label className="text-xs">Domínio</Label>
            <Select value={form.base_domain} onValueChange={v => setForm(f => ({ ...f, base_domain: v }))}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>{DOMAINS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent></Select>
          </div>
          <Button onClick={create}><Plus className="h-4 w-4 mr-1" />Criar</Button>
        </div>
        {form.subdomain && <p className="mt-2 text-xs text-muted-foreground">Preview: <span className="font-mono font-medium text-foreground">{form.subdomain}.{form.base_domain}</span></p>}
      </Card>

      <Card className="overflow-hidden">
        {loading ? <div className="p-8 text-center text-muted-foreground">Carregando...</div> : subdomains.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground"><Globe className="h-8 w-8 mx-auto mb-2 opacity-30" /><p>Nenhum subdomínio criado</p></div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b"><tr>{['URL', 'Cliente', 'Status', 'Criado em', 'Ações'].map(h => <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground">{h}</th>)}</tr></thead>
            <tbody className="divide-y">
              {subdomains.map(s => (
                <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs font-medium">{s.full_url}</td>
                  <td className="px-4 py-3">{clientName(s.client_id)}</td>
                  <td className="px-4 py-3"><Badge className={`border-0 text-xs ${statusBadge(s.status)}`}>{s.status}</Badge></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(s.created_at).toLocaleDateString('pt-BR')}</td>
                  <td className="px-4 py-3"><Button variant="ghost" size="sm" className="text-destructive" onClick={() => remove(s.id)}><Trash2 className="h-3.5 w-3.5" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}

// ══════════════════════════════════════════════
// TAB 3 — Containers
// ══════════════════════════════════════════════
function ContainersTab() {
  const [containers, setContainers] = useState<HostingContainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({ name: '', port: '', container_type: 'app', health_check_url: '' });

  const load = async () => {
    setLoading(true);
    const { data } = await (supabase as any).from('hosting_containers').select('*').order('name');
    setContainers((data || []) as HostingContainer[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.name) return;
    await (supabase as any).from('hosting_containers').insert({ name: form.name, port: form.port ? Number(form.port) : null, container_type: form.container_type, health_check_url: form.health_check_url || null });
    toast.success('Container adicionado');
    setDialogOpen(false);
    setForm({ name: '', port: '', container_type: 'app', health_check_url: '' });
    load();
  };

  const restart = async (c: HostingContainer) => {
    toast.info(`Restart solicitado para ${c.name}... (integração backend pendente)`);
    await (supabase as any).from('hosting_containers').update({ last_restart: new Date().toISOString() }).eq('id', c.id);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Remover container?')) return;
    await (supabase as any).from('hosting_containers').delete().eq('id', id);
    toast.success('Container removido');
    load();
  };

  const statusIcon = (s: string) => s === 'running' ? <CheckCircle className="h-4 w-4 text-green-600" /> : s === 'stopped' ? <XCircle className="h-4 w-4 text-red-600" /> : <AlertCircle className="h-4 w-4 text-yellow-600" />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Badge variant="outline" className="px-3">{containers.length} containers</Badge>
          <Badge className="bg-green-100 text-green-700 border-0 px-3">{containers.filter(c => c.status === 'running').length} rodando</Badge>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={load}><RefreshCw className="h-4 w-4 mr-1" />Atualizar</Button>
          <Button onClick={() => setDialogOpen(true)}><Plus className="h-4 w-4 mr-1" />Adicionar</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {loading ? <div className="col-span-3 p-8 text-center text-muted-foreground">Carregando...</div> :
          containers.map(c => (
            <Card key={c.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  {statusIcon(c.status)}
                  <h4 className="font-semibold text-sm">{c.name}</h4>
                </div>
                <Badge variant="outline" className="text-xs">{c.container_type}</Badge>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground mb-3">
                {c.port && <p>Porta: <span className="font-mono font-medium text-foreground">{c.port}</span></p>}
                <p>Status: <Badge className={`border-0 text-xs ${statusBadge(c.status)}`}>{c.status}</Badge></p>
                {c.last_restart && <p>Último restart: {new Date(c.last_restart).toLocaleString('pt-BR')}</p>}
              </div>
              <div className="flex gap-1">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => restart(c)}><RefreshCw className="h-3 w-3 mr-1" />Restart</Button>
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => remove(c.id)}><Trash2 className="h-3 w-3" /></Button>
              </div>
            </Card>
          ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Adicionar Container</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label className="text-xs">Nome *</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="evolution-api" className="mt-1" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs">Porta</Label><Input type="number" value={form.port} onChange={e => setForm(f => ({ ...f, port: e.target.value }))} placeholder="8080" className="mt-1" /></div>
              <div><Label className="text-xs">Tipo</Label>
                <Select value={form.container_type} onValueChange={v => setForm(f => ({ ...f, container_type: v }))}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="app">App</SelectItem><SelectItem value="database">Database</SelectItem><SelectItem value="proxy">Proxy</SelectItem><SelectItem value="worker">Worker</SelectItem></SelectContent></Select>
              </div>
            </div>
            <div><Label className="text-xs">Health Check URL</Label><Input value={form.health_check_url} onChange={e => setForm(f => ({ ...f, health_check_url: e.target.value }))} placeholder="http://localhost:8080/health" className="mt-1" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={create} disabled={!form.name}>Criar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ══════════════════════════════════════════════
// TAB 4 — Faturamento
// ══════════════════════════════════════════════
function BillingTab() {
  const [billing, setBilling] = useState<HostingBilling[]>([]);
  const [clients, setClients] = useState<HostingClient[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [{ data: b }, { data: c }] = await Promise.all([
      (supabase as any).from('hosting_billing').select('*').order('month', { ascending: false }),
      (supabase as any).from('hosting_clients').select('id, company_name, monthly_value, payment_status'),
    ]);
    setBilling((b || []) as HostingBilling[]);
    setClients((c || []) as HostingClient[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const totalFaturado = clients.reduce((sum, c) => sum + (c.monthly_value || 0), 0);
  const totalPago = billing.filter(b => b.status === 'pago').reduce((sum, b) => sum + b.amount, 0);
  const totalPendente = billing.filter(b => b.status === 'pendente').reduce((sum, b) => sum + b.amount, 0);

  const clientName = (id: string) => clients.find(c => c.id === id)?.company_name || '—';

  const markPaid = async (b: HostingBilling) => {
    await (supabase as any).from('hosting_billing').update({ status: 'pago', paid_at: new Date().toISOString() }).eq('id', b.id);
    toast.success('Marcado como pago');
    load();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="p-4 text-center"><p className="text-xs text-muted-foreground">Faturamento Mensal</p><p className="text-2xl font-bold mt-1">R$ {totalFaturado.toFixed(2)}</p></Card>
        <Card className="p-4 text-center"><p className="text-xs text-muted-foreground">Total Recebido</p><p className="text-2xl font-bold text-green-600 mt-1">R$ {totalPago.toFixed(2)}</p></Card>
        <Card className="p-4 text-center"><p className="text-xs text-muted-foreground">Pendente</p><p className="text-2xl font-bold text-yellow-600 mt-1">R$ {totalPendente.toFixed(2)}</p></Card>
      </div>

      <Card className="overflow-hidden">
        <div className="p-4 border-b"><h3 className="font-semibold">Clientes x Faturamento</h3></div>
        {loading ? <div className="p-8 text-center text-muted-foreground">Carregando...</div> : clients.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">Nenhum dado de faturamento</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b"><tr>{['Cliente', 'Valor Mensal', 'Status'].map(h => <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground">{h}</th>)}</tr></thead>
            <tbody className="divide-y">
              {clients.map(c => (
                <tr key={c.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{c.company_name}</td>
                  <td className="px-4 py-3">R$ {(c.monthly_value || 0).toFixed(2)}</td>
                  <td className="px-4 py-3"><Badge className={`border-0 text-xs ${statusBadge(c.payment_status || 'pendente')}`}>{c.payment_status || 'pendente'}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {billing.length > 0 && (
        <Card className="overflow-hidden">
          <div className="p-4 border-b"><h3 className="font-semibold">Histórico de Cobranças</h3></div>
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b"><tr>{['Mês', 'Cliente', 'Valor', 'Status', 'Ações'].map(h => <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground">{h}</th>)}</tr></thead>
            <tbody className="divide-y">
              {billing.map(b => (
                <tr key={b.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs">{b.month}</td>
                  <td className="px-4 py-3">{clientName(b.client_id)}</td>
                  <td className="px-4 py-3 font-medium">R$ {b.amount.toFixed(2)}</td>
                  <td className="px-4 py-3"><Badge className={`border-0 text-xs ${statusBadge(b.status)}`}>{b.status}</Badge></td>
                  <td className="px-4 py-3">{b.status !== 'pago' && <Button variant="ghost" size="sm" onClick={() => markPaid(b)}>Marcar Pago</Button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════
// TAB 5 — Audit Log / Permissões
// ══════════════════════════════════════════════
function AuditTab() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await (supabase as any).from('hosting_audit_log').select('*').order('created_at', { ascending: false }).limit(50);
    setLogs((data || []) as AuditLog[]);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <h3 className="font-semibold mb-2 flex items-center gap-2"><Shield className="h-4 w-4" />Permissões</h3>
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="p-3 bg-muted rounded-lg">
            <p className="font-medium text-red-600">Admin</p>
            <p className="text-xs text-muted-foreground mt-1">Acesso total: clientes, containers, billing, subdomínios</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <p className="font-medium text-purple-600">Gerenciador</p>
            <p className="text-xs text-muted-foreground mt-1">Criar subdomínios, visualizar containers e billing</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <p className="font-medium text-blue-600">Leitor</p>
            <p className="text-xs text-muted-foreground mt-1">Apenas visualização de dados</p>
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-semibold">Audit Log</h3>
          <Button variant="outline" size="sm" onClick={load}><RefreshCw className="h-3.5 w-3.5 mr-1" />Atualizar</Button>
        </div>
        {loading ? <div className="p-8 text-center text-muted-foreground">Carregando...</div> : logs.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p>Nenhum registro no audit log</p>
          </div>
        ) : (
          <div className="divide-y max-h-96 overflow-y-auto">
            {logs.map(l => (
              <div key={l.id} className="px-4 py-3 flex items-center gap-3">
                <Activity className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm"><span className="font-medium">{l.action}</span>{l.target && <span className="text-muted-foreground"> → {l.target}</span>}</p>
                  {l.user_email && <p className="text-xs text-muted-foreground">{l.user_email}</p>}
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{new Date(l.created_at).toLocaleString('pt-BR')}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

// ══════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════
export default function HostingPanel() {
  const { user, loading: authLoading } = useAuth();

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = '/login';
    }
  }, [user, authLoading]);

  if (authLoading) return <div className="flex items-center justify-center h-screen text-muted-foreground">Carregando...</div>;

  return (
    <AppLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10"><Server className="h-6 w-6 text-primary" /></div>
          <div>
            <h1 className="text-2xl font-bold">Painel de Hosting</h1>
            <p className="text-sm text-muted-foreground">Gerenciamento de clientes, subdomínios, containers e faturamento</p>
          </div>
        </div>

        <Tabs defaultValue="clients" className="space-y-4">
          <TabsList className="grid grid-cols-5 w-full max-w-2xl">
            <TabsTrigger value="clients" className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /><span className="hidden sm:inline">Clientes</span></TabsTrigger>
            <TabsTrigger value="subdomains" className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" /><span className="hidden sm:inline">Subdomínios</span></TabsTrigger>
            <TabsTrigger value="containers" className="flex items-center gap-1.5"><Container className="h-3.5 w-3.5" /><span className="hidden sm:inline">Containers</span></TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-1.5"><DollarSign className="h-3.5 w-3.5" /><span className="hidden sm:inline">Faturamento</span></TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5" /><span className="hidden sm:inline">Permissões</span></TabsTrigger>
          </TabsList>

          <TabsContent value="clients"><ClientsTab /></TabsContent>
          <TabsContent value="subdomains"><SubdomainsTab /></TabsContent>
          <TabsContent value="containers"><ContainersTab /></TabsContent>
          <TabsContent value="billing"><BillingTab /></TabsContent>
          <TabsContent value="audit"><AuditTab /></TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
