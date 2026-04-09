import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { Operador, OperadorRole, OperadorStatus, OperadorFormData, DEFAULT_PERMISSOES } from '@/types/operador';
import { Users, Plus, Edit, Trash2, Search, Shield } from 'lucide-react';

const roleLabels: Record<OperadorRole, string> = {
  admin: 'Admin', gestor: 'Gestor', analista: 'Analista', operador: 'Operador', viewer: 'Viewer',
};
const roleColors: Record<OperadorRole, string> = {
  admin: 'bg-red-100 text-red-700', gestor: 'bg-purple-100 text-purple-700',
  analista: 'bg-blue-100 text-blue-700', operador: 'bg-green-100 text-green-700',
  viewer: 'bg-gray-100 text-gray-600',
};
const statusColors: Record<OperadorStatus, string> = {
  ativo: 'bg-green-100 text-green-700', inativo: 'bg-gray-100 text-gray-600', suspenso: 'bg-red-100 text-red-700',
};

const PERMISSAO_LABELS: Record<keyof Operador['permissoes'], string> = {
  dashboard: 'Dashboard', agentes: 'Agentes', tarefas: 'Tarefas', clientes: 'Clientes',
  alexandria: 'Alexandria', ferramentas_ia: 'Ferramentas IA', configuracoes: 'Configurações', financeiro: 'Financeiro',
};

const emptyForm = (): OperadorFormData => ({
  nome: '', email: '', role: 'operador', status: 'ativo',
  telegram_chat_id: '', permissoes: DEFAULT_PERMISSOES.operador,
});

export default function Operadores() {
  const [operadores, setOperadores] = useState<Operador[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Operador | null>(null);
  const [form, setForm] = useState<OperadorFormData>(emptyForm());
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadOperadores(); }, []);

  const loadOperadores = async () => {
    setIsLoading(true);
    const { data } = await (supabase as any).from('operadores').select('*').order('nome');
    setOperadores((data || []) as unknown as Operador[]);
    setIsLoading(false);
  };

  const openNew = () => { setEditing(null); setForm(emptyForm()); setDialogOpen(true); };
  const openEdit = (op: Operador) => {
    setEditing(op);
    setForm({ nome: op.nome, email: op.email, role: op.role, status: op.status, telegram_chat_id: op.telegram_chat_id || '', permissoes: op.permissoes });
    setDialogOpen(true);
  };

  const handleRoleChange = (role: OperadorRole) => {
    setForm(f => ({ ...f, role, permissoes: DEFAULT_PERMISSOES[role] }));
  };

  const handleSave = async () => {
    if (!form.nome || !form.email) return;
    setSaving(true);
    try {
      if (editing) {
        await (supabase as any).from('operadores').update({ ...form, updated_at: new Date().toISOString() }).eq('id', editing.id);
      } else {
        await (supabase as any).from('operadores').insert({ ...form, created_at: new Date().toISOString(), updated_at: new Date().toISOString() });
      }
      await loadOperadores();
      setDialogOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remover operador?')) return;
    await (supabase as any).from('operadores').delete().eq('id', id);
    await loadOperadores();
  };

  const filtered = operadores.filter(op =>
    op.nome.toLowerCase().includes(search.toLowerCase()) ||
    op.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10"><Users className="h-6 w-6 text-primary" /></div>
          <div>
            <h1 className="text-2xl font-bold">Operadores</h1>
            <p className="text-sm text-muted-foreground">Cadastro de usuários humanos do Apps Totum</p>
          </div>
        </div>
        <Button onClick={openNew}><Plus className="h-4 w-4 mr-2" />Novo Operador</Button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar operadores..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Badge variant="outline" className="px-3">{operadores.length} total</Badge>
        <Badge className="bg-green-100 text-green-700 border-0 px-3">{operadores.filter(o => o.status === 'ativo').length} ativos</Badge>
      </div>

      <Card className="overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-muted-foreground">Carregando...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
            <p>{search ? 'Nenhum operador encontrado' : 'Nenhum operador cadastrado ainda.'}</p>
            {!search && <Button variant="link" onClick={openNew} className="mt-2">Cadastrar primeiro operador</Button>}
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                {['Operador', 'Role', 'Status', 'Telegram', 'Ações'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map(op => (
                <tr key={op.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs">
                        {op.nome[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium">{op.nome}</p>
                        <p className="text-xs text-muted-foreground">{op.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><Badge className={`border-0 text-xs ${roleColors[op.role]}`}><Shield className="h-3 w-3 mr-1" />{roleLabels[op.role]}</Badge></td>
                  <td className="px-4 py-3"><Badge className={`border-0 text-xs ${statusColors[op.status]}`}>{op.status}</Badge></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{op.telegram_chat_id || '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(op)}><Edit className="h-3.5 w-3.5" /></Button>
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(op.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
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
          <DialogHeader>
            <DialogTitle>{editing ? 'Editar Operador' : 'Novo Operador'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Nome *</Label>
                <Input value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label className="text-xs">Email *</Label>
                <Input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="mt-1" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs">Role</Label>
                <Select value={form.role} onValueChange={v => handleRoleChange(v as OperadorRole)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{Object.entries(roleLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Status</Label>
                <Select value={form.status} onValueChange={v => setForm(f => ({ ...f, status: v as OperadorStatus }))}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{['ativo','inativo','suspenso'].map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-xs">Telegram Chat ID (opcional)</Label>
              <Input value={form.telegram_chat_id} onChange={e => setForm(f => ({ ...f, telegram_chat_id: e.target.value }))} placeholder="ex: 123456789" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs mb-2 block">Permissões</Label>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(PERMISSAO_LABELS) as Array<keyof typeof PERMISSAO_LABELS>).map(key => (
                  <div key={key} className="flex items-center justify-between p-2 bg-muted rounded">
                    <span className="text-xs">{PERMISSAO_LABELS[key]}</span>
                    <Switch checked={form.permissoes[key]} onCheckedChange={v => setForm(f => ({ ...f, permissoes: { ...f.permissoes, [key]: v } }))} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSave} disabled={saving || !form.nome || !form.email}>
              {saving ? 'Salvando...' : editing ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
