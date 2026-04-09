import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  CheckCircle, XCircle, AlertCircle, Users, ArrowRight
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

// ── Design System Components ──
const DSCard = ({ children, className = '', accent = false }: { children: React.ReactNode; className?: string; accent?: boolean }) => (
  <div className={`relative bg-black border border-zinc-800 rounded-none ${className}`}>
    {accent && (
      <>
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#ef233c]" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#ef233c]" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#ef233c]" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#ef233c]" />
      </>
    )}
    {children}
  </div>
);

const DSLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="font-mono text-[10px] text-[#ef233c] tracking-widest uppercase font-bold">[ {children} ]</span>
);

const DSButton = ({ children, onClick, disabled, variant = 'primary', className = '', size = 'default' }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean; variant?: 'primary' | 'ghost' | 'outline' | 'danger';
  className?: string; size?: 'default' | 'sm' | 'icon';
}) => {
  const base = 'transition-all uppercase font-bold tracking-widest flex items-center justify-center gap-2 rounded-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';
  const sizes = { default: 'text-[11px] py-3 px-5', sm: 'text-[10px] py-2 px-3', icon: 'p-2' };
  const variants = {
    primary: 'bg-transparent border border-[#ef233c] text-[#ef233c] hover:bg-[#ef233c] hover:text-white',
    outline: 'bg-transparent border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-white',
    ghost: 'bg-transparent text-zinc-400 hover:text-white hover:bg-white/5',
    danger: 'bg-transparent border border-red-800 text-red-500 hover:bg-red-600 hover:text-white',
  };
  return <button onClick={onClick} disabled={disabled} className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}>{children}</button>;
};

const DSInput = ({ className = '', ...props }: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) => (
  <input {...props} className={`w-full bg-transparent border-b border-white/10 py-2.5 text-white placeholder-zinc-600 focus:border-[#ef233c] focus:outline-none transition-colors font-sans text-sm ${className}`} />
);

const DSSelect = ({ value, onValueChange, children, placeholder }: {
  value: string; onValueChange: (v: string) => void; children: React.ReactNode; placeholder?: string;
}) => (
  <Select value={value} onValueChange={onValueChange}>
    <SelectTrigger className="bg-transparent border-b border-white/10 rounded-none text-white text-sm focus:ring-0 focus:border-[#ef233c] hover:border-zinc-600 transition-colors">
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent className="bg-zinc-900 border-zinc-800 rounded-none">
      {children}
    </SelectContent>
  </Select>
);

const DSBadge = ({ status, label }: { status: string; label?: string }) => {
  const colors: Record<string, string> = {
    ativo: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    inativo: 'bg-zinc-500/10 text-zinc-500 border-zinc-600/30',
    running: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    stopped: 'bg-red-500/10 text-red-400 border-red-500/30',
    pago: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    pendente: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    atrasado: 'bg-red-500/10 text-red-400 border-red-500/30',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider border rounded-none ${colors[status] || 'bg-zinc-500/10 text-zinc-400 border-zinc-600/30'}`}>
      <span className={`w-1.5 h-1.5 rounded-none ${status === 'running' || status === 'ativo' || status === 'pago' ? 'bg-emerald-400 animate-pulse' : status === 'stopped' || status === 'atrasado' ? 'bg-red-400' : 'bg-amber-400'}`} />
      {label || status}
    </span>
  );
};

const DSDot = ({ active }: { active?: boolean }) => (
  <div className="flex gap-1.5">
    <div className={`w-1.5 h-1.5 rounded-none ${active ? 'bg-[#ef233c] animate-pulse' : 'bg-zinc-800'}`} />
    <div className="w-1.5 h-1.5 bg-zinc-800 rounded-none" />
    <div className="w-1.5 h-1.5 bg-zinc-800 rounded-none" />
  </div>
);

const DSTable = ({ headers, children, empty, loading }: {
  headers: string[]; children: React.ReactNode; empty?: React.ReactNode; loading?: boolean;
}) => (
  <div className="border border-zinc-800 rounded-none overflow-hidden">
    <div className="grid border-b border-zinc-800 px-4 py-3 bg-zinc-900/20" style={{ gridTemplateColumns: `repeat(${headers.length}, minmax(0, 1fr))` }}>
      {headers.map(h => <div key={h} className="text-[10px] uppercase tracking-wider text-zinc-500 font-mono font-bold">{h}</div>)}
    </div>
    {loading ? (
      <div className="p-8 text-center text-zinc-600 font-mono text-xs uppercase tracking-wider">Carregando dados...</div>
    ) : children ? (
      <div className="divide-y divide-zinc-800/50">{children}</div>
    ) : empty}
  </div>
);

const DSStatCard = ({ label, value, sub, accent }: { label: string; value: string; sub?: string; accent?: boolean }) => (
  <DSCard accent className="p-6">
    <div className="flex items-center justify-between border-b border-zinc-800 border-dashed pb-3 mb-4">
      <DSLabel>{label}</DSLabel>
      <DSDot active={accent} />
    </div>
    <div className="flex items-baseline gap-2">
      <p className={`text-3xl font-medium tracking-tighter font-sans ${accent ? 'text-[#ef233c]' : 'text-white'}`}>{value}</p>
      {sub && <span className="text-zinc-500 text-xs font-mono">{sub}</span>}
    </div>
  </DSCard>
);

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
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-0 top-3 h-4 w-4 text-zinc-600" />
          <DSInput placeholder="Buscar clientes..." value={search} onChange={e => setSearch(e.target.value)} className="pl-6" />
        </div>
        <DSButton onClick={openNew}><Plus className="h-3.5 w-3.5" />Novo Cliente</DSButton>
      </div>

      <DSTable
        headers={['Empresa', 'Domínio', 'Status', 'Valor Mensal', 'Pagamento', 'Ações']}
        loading={loading}
        empty={
          <div className="p-10 text-center">
            <Users className="h-6 w-6 mx-auto mb-2 text-zinc-700" />
            <p className="text-zinc-600 font-mono text-xs uppercase tracking-wider">Nenhum cliente encontrado</p>
          </div>
        }
      >
        {filtered.length > 0 && filtered.map(c => (
          <div key={c.id} className="grid grid-cols-6 px-4 py-3 items-center hover:bg-white/[0.02] transition-colors group">
            <div>
              <p className="text-sm text-white font-medium">{c.company_name}</p>
              {c.contact_email && <p className="text-[10px] text-zinc-600 font-mono mt-0.5">{c.contact_email}</p>}
            </div>
            <div className="text-xs font-mono text-zinc-400">{c.domain || '—'}</div>
            <div><DSBadge status={c.status} /></div>
            <div className="text-sm text-white font-medium">R$ {c.monthly_value.toFixed(2)}</div>
            <div><DSBadge status={c.payment_status} /></div>
            <div className="flex gap-1">
              <DSButton variant="ghost" size="icon" onClick={() => openEdit(c)}><Edit className="h-3.5 w-3.5" /></DSButton>
              <DSButton variant="ghost" size="icon" onClick={() => remove(c.id)} className="hover:!text-red-400"><Trash2 className="h-3.5 w-3.5" /></DSButton>
            </div>
          </div>
        ))}
      </DSTable>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-black border-zinc-800 rounded-none max-w-lg text-white">
          <DialogHeader>
            <DialogTitle className="text-white font-sans tracking-tight">{editing ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-5">
              <div className="group relative">
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-medium mb-1 block">Empresa *</label>
                <DSInput value={form.company_name} onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))} />
              </div>
              <div className="group relative">
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-medium mb-1 block">Domínio</label>
                <DSInput value={form.domain} onChange={e => setForm(f => ({ ...f, domain: e.target.value }))} placeholder="exemplo.com" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-medium mb-1 block">Contato</label>
                <DSInput value={form.contact_name} onChange={e => setForm(f => ({ ...f, contact_name: e.target.value }))} />
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-medium mb-1 block">Email</label>
                <DSInput value={form.contact_email} onChange={e => setForm(f => ({ ...f, contact_email: e.target.value }))} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-5">
              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-medium mb-1 block">Status</label>
                <DSSelect value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v }))}>
                  <SelectItem value="ativo" className="text-white">Ativo</SelectItem>
                  <SelectItem value="inativo" className="text-white">Inativo</SelectItem>
                </DSSelect>
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-medium mb-1 block">Valor (R$)</label>
                <DSInput type="number" value={form.monthly_value} onChange={e => setForm(f => ({ ...f, monthly_value: e.target.value }))} />
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-medium mb-1 block">Notas</label>
                <DSInput value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 mt-4">
            <DSButton variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</DSButton>
            <DSButton onClick={save} disabled={!form.company_name}>{editing ? 'Salvar' : 'Criar'}</DSButton>
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
    <div className="space-y-5">
      <DSCard accent className="p-6">
        <div className="flex items-center justify-between border-b border-zinc-800 border-dashed pb-3 mb-5">
          <DSLabel>Criar Subdomínio</DSLabel>
          <DSDot active />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 items-end">
          <div>
            <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-medium mb-1 block">Cliente</label>
            <DSSelect value={form.client_id} onValueChange={v => setForm(f => ({ ...f, client_id: v }))} placeholder="Selecionar...">
              {clients.map(c => <SelectItem key={c.id} value={c.id} className="text-white">{c.company_name}</SelectItem>)}
            </DSSelect>
          </div>
          <div>
            <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-medium mb-1 block">Subdomínio</label>
            <DSInput value={form.subdomain} onChange={e => setForm(f => ({ ...f, subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))} placeholder="meu-app" />
          </div>
          <div>
            <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-medium mb-1 block">Domínio</label>
            <DSSelect value={form.base_domain} onValueChange={v => setForm(f => ({ ...f, base_domain: v }))}>
              {DOMAINS.map(d => <SelectItem key={d} value={d} className="text-white">{d}</SelectItem>)}
            </DSSelect>
          </div>
          <DSButton onClick={create} className="w-full"><Plus className="h-3.5 w-3.5" />Criar</DSButton>
        </div>
        {form.subdomain && (
          <div className="mt-3 bg-black/90 backdrop-blur border-l-4 border-[#ef233c] p-3">
            <p className="text-xs text-zinc-400 font-sans">Preview: <span className="text-white font-mono font-medium">{form.subdomain}.{form.base_domain}</span></p>
          </div>
        )}
      </DSCard>

      <DSTable
        headers={['URL', 'Cliente', 'Status', 'Criado em', 'Ações']}
        loading={loading}
        empty={
          <div className="p-10 text-center">
            <Globe className="h-6 w-6 mx-auto mb-2 text-zinc-700" />
            <p className="text-zinc-600 font-mono text-xs uppercase tracking-wider">Nenhum subdomínio criado</p>
          </div>
        }
      >
        {subdomains.length > 0 && subdomains.map(s => (
          <div key={s.id} className="grid grid-cols-5 px-4 py-3 items-center hover:bg-white/[0.02] transition-colors">
            <div className="font-mono text-xs text-white font-medium">{s.full_url}</div>
            <div className="text-sm text-zinc-400">{clientName(s.client_id)}</div>
            <div><DSBadge status={s.status} /></div>
            <div className="text-[10px] text-zinc-600 font-mono">{new Date(s.created_at).toLocaleDateString('pt-BR')}</div>
            <div><DSButton variant="ghost" size="icon" onClick={() => remove(s.id)} className="hover:!text-red-400"><Trash2 className="h-3.5 w-3.5" /></DSButton></div>
          </div>
        ))}
      </DSTable>
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
    toast.info(`Restart solicitado para ${c.name}...`);
    await (supabase as any).from('hosting_containers').update({ last_restart: new Date().toISOString() }).eq('id', c.id);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Remover container?')) return;
    await (supabase as any).from('hosting_containers').delete().eq('id', id);
    toast.success('Container removido');
    load();
  };

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider border border-zinc-800 px-3 py-1.5 rounded-none">{containers.length} containers</span>
          <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 rounded-none">{containers.filter(c => c.status === 'running').length} rodando</span>
        </div>
        <div className="flex gap-2">
          <DSButton variant="outline" onClick={load}><RefreshCw className="h-3.5 w-3.5" />Atualizar</DSButton>
          <DSButton onClick={() => setDialogOpen(true)}><Plus className="h-3.5 w-3.5" />Adicionar</DSButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-3 p-10 text-center text-zinc-600 font-mono text-xs uppercase tracking-wider">Carregando containers...</div>
        ) : containers.map(c => (
          <DSCard key={c.id} accent className="p-5 group hover:border-[#ef233c]/50 transition-all duration-500">
            <div className="flex items-center justify-between border-b border-zinc-800 border-dashed pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-none ${c.status === 'running' ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
                <h4 className="text-sm text-white font-medium">{c.name}</h4>
              </div>
              <span className="font-mono text-[10px] text-zinc-600 uppercase tracking-wider">{c.container_type}</span>
            </div>
            <div className="space-y-2 text-xs mb-4">
              {c.port && <div className="flex justify-between"><span className="text-zinc-600 font-mono uppercase tracking-wider">Porta</span><span className="text-white font-mono">{c.port}</span></div>}
              <div className="flex justify-between"><span className="text-zinc-600 font-mono uppercase tracking-wider">Status</span><DSBadge status={c.status} /></div>
              {c.last_restart && <div className="flex justify-between"><span className="text-zinc-600 font-mono uppercase tracking-wider">Restart</span><span className="text-zinc-400 font-mono text-[10px]">{new Date(c.last_restart).toLocaleString('pt-BR')}</span></div>}
            </div>
            <div className="flex gap-2">
              <DSButton variant="primary" size="sm" className="flex-1" onClick={() => restart(c)}><RefreshCw className="h-3 w-3" />Restart</DSButton>
              <DSButton variant="ghost" size="icon" onClick={() => remove(c.id)} className="hover:!text-red-400"><Trash2 className="h-3.5 w-3.5" /></DSButton>
            </div>
          </DSCard>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-black border-zinc-800 rounded-none text-white">
          <DialogHeader><DialogTitle className="text-white font-sans tracking-tight">Adicionar Container</DialogTitle></DialogHeader>
          <div className="space-y-5">
            <div>
              <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-medium mb-1 block">Nome *</label>
              <DSInput value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="evolution-api" />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-medium mb-1 block">Porta</label>
                <DSInput type="number" value={form.port} onChange={e => setForm(f => ({ ...f, port: e.target.value }))} placeholder="8080" />
              </div>
              <div>
                <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-medium mb-1 block">Tipo</label>
                <DSSelect value={form.container_type} onValueChange={v => setForm(f => ({ ...f, container_type: v }))}>
                  <SelectItem value="app" className="text-white">App</SelectItem>
                  <SelectItem value="database" className="text-white">Database</SelectItem>
                  <SelectItem value="proxy" className="text-white">Proxy</SelectItem>
                  <SelectItem value="worker" className="text-white">Worker</SelectItem>
                </DSSelect>
              </div>
            </div>
            <div>
              <label className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono font-medium mb-1 block">Health Check URL</label>
              <DSInput value={form.health_check_url} onChange={e => setForm(f => ({ ...f, health_check_url: e.target.value }))} placeholder="http://localhost:8080/health" />
            </div>
          </div>
          <DialogFooter className="gap-2 mt-4">
            <DSButton variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</DSButton>
            <DSButton onClick={create} disabled={!form.name}>Criar</DSButton>
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
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DSStatCard label="Faturamento Mensal" value={`R$ ${totalFaturado.toFixed(2)}`} accent />
        <DSStatCard label="Total Recebido" value={`R$ ${totalPago.toFixed(2)}`} sub="PAGO" />
        <DSStatCard label="Pendente" value={`R$ ${totalPendente.toFixed(2)}`} sub="AGUARDANDO" />
      </div>

      <DSCard className="overflow-hidden">
        <div className="p-4 border-b border-zinc-800 border-dashed flex justify-between items-center">
          <DSLabel>Clientes x Faturamento</DSLabel>
          <DSDot />
        </div>
        <DSTable
          headers={['Cliente', 'Valor Mensal', 'Status']}
          loading={loading}
          empty={<div className="p-8 text-center text-zinc-600 font-mono text-xs uppercase tracking-wider">Nenhum dado</div>}
        >
          {clients.map(c => (
            <div key={c.id} className="grid grid-cols-3 px-4 py-3 items-center hover:bg-white/[0.02] transition-colors">
              <div className="text-sm text-white font-medium">{c.company_name}</div>
              <div className="text-sm text-white font-mono">R$ {(c.monthly_value || 0).toFixed(2)}</div>
              <div><DSBadge status={c.payment_status || 'pendente'} /></div>
            </div>
          ))}
        </DSTable>
      </DSCard>

      {billing.length > 0 && (
        <DSCard className="overflow-hidden">
          <div className="p-4 border-b border-zinc-800 border-dashed flex justify-between items-center">
            <DSLabel>Histórico de Cobranças</DSLabel>
            <DSDot />
          </div>
          <DSTable headers={['Mês', 'Cliente', 'Valor', 'Status', 'Ações']}>
            {billing.map(b => (
              <div key={b.id} className="grid grid-cols-5 px-4 py-3 items-center hover:bg-white/[0.02] transition-colors">
                <div className="font-mono text-xs text-zinc-400">{b.month}</div>
                <div className="text-sm text-zinc-300">{clientName(b.client_id)}</div>
                <div className="text-sm text-white font-mono font-medium">R$ {b.amount.toFixed(2)}</div>
                <div><DSBadge status={b.status} /></div>
                <div>{b.status !== 'pago' && <DSButton variant="ghost" size="sm" onClick={() => markPaid(b)}>Marcar Pago</DSButton>}</div>
              </div>
            ))}
          </DSTable>
        </DSCard>
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
    <div className="space-y-5">
      <DSCard accent className="p-6">
        <div className="flex items-center justify-between border-b border-zinc-800 border-dashed pb-3 mb-5">
          <DSLabel>Permissões & Roles</DSLabel>
          <DSDot active />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { role: 'Admin', color: '#ef233c', desc: 'Acesso total: clientes, containers, billing, subdomínios' },
            { role: 'Gerenciador', color: '#a855f7', desc: 'Criar subdomínios, visualizar containers e billing' },
            { role: 'Leitor', color: '#3b82f6', desc: 'Apenas visualização de dados' },
          ].map(r => (
            <div key={r.role} className="border border-zinc-800 p-5 bg-black group hover:border-zinc-700 transition-colors relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 transition-transform duration-200" style={{ backgroundColor: r.color }} />
              <p className="text-sm text-white font-medium ml-3">{r.role}</p>
              <p className="text-xs text-zinc-500 mt-1.5 ml-3 font-sans leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </DSCard>

      <DSCard className="overflow-hidden">
        <div className="p-4 border-b border-zinc-800 border-dashed flex justify-between items-center">
          <DSLabel>Audit Log</DSLabel>
          <DSButton variant="outline" size="sm" onClick={load}><RefreshCw className="h-3 w-3" />Atualizar</DSButton>
        </div>
        {loading ? (
          <div className="p-10 text-center text-zinc-600 font-mono text-xs uppercase tracking-wider">Carregando logs...</div>
        ) : logs.length === 0 ? (
          <div className="p-10 text-center">
            <Activity className="h-6 w-6 mx-auto mb-2 text-zinc-700" />
            <p className="text-zinc-600 font-mono text-xs uppercase tracking-wider">Nenhum registro no audit log</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-800/50 max-h-96 overflow-y-auto">
            {logs.map(l => (
              <div key={l.id} className="px-4 py-3 flex items-center gap-3 hover:bg-white/[0.02] transition-colors group relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#ef233c] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-200" />
                <Activity className="h-3.5 w-3.5 text-zinc-700 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white"><span className="font-medium">{l.action}</span>{l.target && <span className="text-zinc-500"> → {l.target}</span>}</p>
                  {l.user_email && <p className="text-[10px] text-zinc-600 font-mono">{l.user_email}</p>}
                </div>
                <span className="text-[10px] text-zinc-600 font-mono shrink-0">{new Date(l.created_at).toLocaleString('pt-BR')}</span>
              </div>
            ))}
          </div>
        )}
      </DSCard>
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

  if (authLoading) return <div className="flex items-center justify-center h-screen bg-black text-zinc-600 font-mono text-xs uppercase tracking-wider">Carregando...</div>;

  return (
    <AppLayout>
      <div className="p-6 space-y-6 bg-black min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="grid grid-cols-2 w-8 h-8 gap-0.5">
              <div className="bg-[#ef233c] w-full h-full rounded-sm" />
              <div className="bg-zinc-700 w-full h-full rounded-sm" />
              <div className="bg-zinc-800 w-full h-full rounded-sm" />
              <div className="bg-white w-full h-full rounded-sm shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-white tracking-tight font-sans">Painel de Hosting</h1>
              <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mt-0.5">Infraestrutura & Gerenciamento</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#ef233c] animate-pulse shadow-[0_0_10px_rgba(239,35,60,0.5)]" />
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Sistema Ativo</span>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="clients" className="space-y-5">
          <div className="border border-zinc-800 rounded-none bg-black overflow-hidden">
            <TabsList className="bg-transparent border-none rounded-none w-full justify-start gap-0 h-auto p-0">
              {[
                { value: 'clients', icon: Users, label: 'Clientes' },
                { value: 'subdomains', icon: Globe, label: 'Subdomínios' },
                { value: 'containers', icon: Container, label: 'Containers' },
                { value: 'billing', icon: DollarSign, label: 'Faturamento' },
                { value: 'audit', icon: Shield, label: 'Permissões' },
              ].map(tab => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-none border-r border-zinc-800 last:border-r-0 px-5 py-3 text-[10px] font-mono uppercase tracking-widest text-zinc-500 data-[state=active]:bg-white/[0.03] data-[state=active]:text-[#ef233c] data-[state=active]:border-b-2 data-[state=active]:border-b-[#ef233c] hover:text-white hover:bg-white/[0.02] transition-colors flex items-center gap-2"
                >
                  <tab.icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

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
