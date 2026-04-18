import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import TelegramNotification from '@/components/workspace/TelegramNotification';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { CalendarClock, Plus, Trash2, Bell, RefreshCw, Loader2 } from 'lucide-react';

type Frequency = 'daily' | 'weekly' | 'monthly';

interface RecurringTask {
  id: string;
  titulo: string;
  descricao: string | null;
  frequency: Frequency;
  responsavel: string | null;
  co_responsavel: string | null;
  telegram_enabled: boolean;
  telegram_chat_id: string | null;
  active: boolean;
  next_run: string | null;
}

const freqLabel: Record<Frequency, string> = {
  daily: 'Diário', weekly: 'Semanal', monthly: 'Mensal',
};
const freqColor: Record<Frequency, string> = {
  daily:   'bg-blue-500/15 text-blue-400',
  weekly:  'bg-purple-500/10 text-purple-400',
  monthly: 'bg-amber-500/15 text-amber-400',
};

const calcNextRun = (freq: Frequency): string => {
  const d = new Date();
  if (freq === 'daily')   d.setDate(d.getDate() + 1);
  else if (freq === 'weekly') d.setDate(d.getDate() + 7);
  else d.setMonth(d.getMonth() + 1);
  return d.toISOString().split('T')[0];
};

const emptyForm = () => ({
  titulo: '', descricao: '', frequency: 'weekly' as Frequency,
  responsavel: '', co_responsavel: '', telegram_enabled: false, telegram_chat_id: '',
});

export default function TaskRecurrence() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<RecurringTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<RecurringTask | null>(null);
  const [form, setForm] = useState(emptyForm());

  const load = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from('task_recurrence')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) toast.error('Erro ao carregar tarefas recorrentes');
    setTasks((data || []) as RecurringTask[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAdd = async () => {
    if (!form.titulo) return;
    setSaving(true);
    try {
      const { error } = await (supabase as any).from('task_recurrence').insert({
        titulo: form.titulo,
        descricao: form.descricao || null,
        frequency: form.frequency,
        responsavel: form.responsavel || null,
        co_responsavel: form.co_responsavel || null,
        telegram_enabled: form.telegram_enabled,
        telegram_chat_id: form.telegram_chat_id || null,
        active: true,
        next_run: calcNextRun(form.frequency),
        created_by: user?.id || null,
      });
      if (error) throw error;
      toast.success('Tarefa recorrente criada!');
      setForm(emptyForm());
      setShowForm(false);
      await load();
    } catch (err: any) {
      toast.error('Erro ao criar tarefa: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (task: RecurringTask) => {
    const { error } = await (supabase as any)
      .from('task_recurrence')
      .update({ active: !task.active })
      .eq('id', task.id);
    if (error) toast.error('Erro ao atualizar');
    else await load();
  };

  const remove = async (id: string) => {
    if (!confirm('Remover tarefa recorrente?')) return;
    const { error } = await (supabase as any)
      .from('task_recurrence')
      .delete()
      .eq('id', id);
    if (error) toast.error('Erro ao remover');
    else { toast.success('Removida'); await load(); }
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <CalendarClock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Tarefas Recorrentes</h1>
              <p className="text-sm text-muted-foreground">Agendamento automático com notificações</p>
            </div>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4 mr-2" />Nova Recorrência
          </Button>
        </div>

        {/* Formulário */}
        {showForm && (
          <Card className="p-5 border-primary/30">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Plus className="h-4 w-4" />Nova Tarefa Recorrente
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="rec-title" className="text-xs">Título *</Label>
                <Input id="rec-title" value={form.titulo} onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))} placeholder="Nome da tarefa" className="mt-1" />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="rec-desc" className="text-xs">Descrição</Label>
                <Textarea id="rec-desc" value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} rows={2} className="mt-1 resize-none" />
              </div>
              <div>
                <Label htmlFor="rec-freq" className="text-xs">Frequência</Label>
                <Select value={form.frequency} onValueChange={v => setForm(f => ({ ...f, frequency: v as Frequency }))}>
                  <SelectTrigger id="rec-freq" className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {Object.entries(freqLabel).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="rec-resp" className="text-xs">Responsável</Label>
                <Input id="rec-resp" value={form.responsavel} onChange={e => setForm(f => ({ ...f, responsavel: e.target.value }))} placeholder="ex: Israel / WANDA" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="rec-coresp" className="text-xs">Co-responsável</Label>
                <Input id="rec-coresp" value={form.co_responsavel} onChange={e => setForm(f => ({ ...f, co_responsavel: e.target.value }))} placeholder="opcional" className="mt-1" />
              </div>
              <div className="flex items-center gap-3 pt-5">
                <Switch id="rec-telegram-switch" checked={form.telegram_enabled} onCheckedChange={v => setForm(f => ({ ...f, telegram_enabled: v }))} />
                <Label htmlFor="rec-telegram-switch" className="text-sm flex items-center gap-1 cursor-pointer">
                  <Bell className="h-3.5 w-3.5" />Notificar via Telegram
                </Label>
              </div>
              {form.telegram_enabled && (
                <div>
                  <Label htmlFor="rec-telegram-id" className="text-xs">Chat ID Telegram</Label>
                  <Input id="rec-telegram-id" value={form.telegram_chat_id} onChange={e => setForm(f => ({ ...f, telegram_chat_id: e.target.value }))} placeholder="123456789" className="mt-1" />
                </div>
              )}
            </div>
            <div className="flex gap-2 mt-4">
              <Button onClick={handleAdd} disabled={!form.titulo || saving}>
                {saving && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
                Adicionar
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
            </div>
          </Card>
        )}

        {/* Lista */}
        {loading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />Carregando...
          </div>
        ) : tasks.length === 0 ? (
          <Card className="p-8 text-center">
            <CalendarClock className="h-8 w-8 mx-auto mb-2 text-muted-foreground/30" />
            <p className="text-muted-foreground">Nenhuma tarefa recorrente criada ainda.</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {tasks.map(task => (
              <Card key={task.id} className={`p-4 ${!task.active ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h4 className="font-semibold">{task.titulo}</h4>
                      <Badge className={`border-0 text-xs ${freqColor[task.frequency]}`}>
                        <RefreshCw className="h-3 w-3 mr-1" />{freqLabel[task.frequency]}
                      </Badge>
                      {task.telegram_enabled && (
                        <Badge className="bg-blue-500/15 text-blue-400 border-0 text-xs">
                          <Bell className="h-3 w-3 mr-1" />Telegram
                        </Badge>
                      )}
                      {!task.active && <Badge className="bg-zinc-800 text-zinc-400 border-0 text-xs">Pausada</Badge>}
                    </div>
                    {task.descricao && <p className="text-sm text-muted-foreground mb-2">{task.descricao}</p>}
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      {task.responsavel && <span>👤 {task.responsavel}</span>}
                      {task.co_responsavel && <span>👥 {task.co_responsavel}</span>}
                      {task.next_run && (
                        <span>📅 Próxima: {new Date(task.next_run).toLocaleDateString('pt-BR')}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Switch checked={task.active} onCheckedChange={() => toggleActive(task)} />
                    <Button variant="ghost" size="sm" className="text-destructive h-7 w-7 p-0" onClick={() => remove(task.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {task.telegram_enabled && selectedTask?.id === task.id && (
                  <div className="mt-3 pt-3 border-t">
                    <TelegramNotification
                      defaultChatId={task.telegram_chat_id || ''}
                      taskTitle={task.titulo}
                      taskDescription={task.descricao || ''}
                    />
                  </div>
                )}
                {task.telegram_enabled && (
                  <Button
                    variant="ghost" size="sm" className="mt-2 h-7 text-xs"
                    onClick={() => setSelectedTask(selectedTask?.id === task.id ? null : task)}
                  >
                    <Bell className="h-3 w-3 mr-1" />
                    {selectedTask?.id === task.id ? 'Fechar' : 'Testar notificação'}
                  </Button>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
