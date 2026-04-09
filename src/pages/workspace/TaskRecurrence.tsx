import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import TelegramNotification from '@/components/workspace/TelegramNotification';
import { CalendarClock, Plus, Trash2, Bell, RefreshCw } from 'lucide-react';

type Frequency = 'daily' | 'weekly' | 'monthly';

interface RecurringTask {
  id: string;
  title: string;
  description: string;
  frequency: Frequency;
  responsavel: string;
  coResponsavel: string;
  telegramEnabled: boolean;
  telegramChatId: string;
  active: boolean;
  nextRun: string;
}

const freqLabel: Record<Frequency, string> = {
  daily: 'Diário', weekly: 'Semanal', monthly: 'Mensal',
};
const freqColor: Record<Frequency, string> = {
  daily: 'bg-blue-100 text-blue-700',
  weekly: 'bg-purple-100 text-purple-700',
  monthly: 'bg-amber-100 text-amber-700',
};

const calcNextRun = (freq: Frequency): string => {
  const d = new Date();
  if (freq === 'daily') d.setDate(d.getDate() + 1);
  else if (freq === 'weekly') d.setDate(d.getDate() + 7);
  else d.setMonth(d.getMonth() + 1);
  return d.toLocaleDateString('pt-BR');
};

export default function TaskRecurrence() {
  const [tasks, setTasks] = useState<RecurringTask[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState<RecurringTask | null>(null);
  const [form, setForm] = useState({
    title: '', description: '', frequency: 'weekly' as Frequency,
    responsavel: '', coResponsavel: '', telegramEnabled: false, telegramChatId: '',
  });

  const handleAdd = () => {
    if (!form.title) return;
    const newTask: RecurringTask = {
      id: crypto.randomUUID(), ...form, active: true, nextRun: calcNextRun(form.frequency),
    };
    setTasks(prev => [...prev, newTask]);
    setForm({ title: '', description: '', frequency: 'weekly', responsavel: '', coResponsavel: '', telegramEnabled: false, telegramChatId: '' });
    setShowForm(false);
  };

  const toggleActive = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, active: !t.active } : t));
  };

  const remove = (id: string) => setTasks(prev => prev.filter(t => t.id !== id));

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10"><CalendarClock className="h-6 w-6 text-primary" /></div>
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
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Plus className="h-4 w-4" />Nova Tarefa Recorrente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label className="text-xs">Título *</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Nome da tarefa" className="mt-1" />
            </div>
            <div className="md:col-span-2">
              <Label className="text-xs">Descrição</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} className="mt-1 resize-none" />
            </div>
            <div>
              <Label className="text-xs">Frequência</Label>
              <Select value={form.frequency} onValueChange={v => setForm(f => ({ ...f, frequency: v as Frequency }))}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(freqLabel).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Responsável (humano/robô)</Label>
              <Input value={form.responsavel} onChange={e => setForm(f => ({ ...f, responsavel: e.target.value }))} placeholder="ex: Israel / WANDA" className="mt-1" />
            </div>
            <div>
              <Label className="text-xs">Co-responsável</Label>
              <Input value={form.coResponsavel} onChange={e => setForm(f => ({ ...f, coResponsavel: e.target.value }))} placeholder="opcional" className="mt-1" />
            </div>
            <div className="flex items-center gap-3 pt-5">
              <Switch checked={form.telegramEnabled} onCheckedChange={v => setForm(f => ({ ...f, telegramEnabled: v }))} />
              <Label className="text-sm flex items-center gap-1"><Bell className="h-3.5 w-3.5" />Notificar via Telegram</Label>
            </div>
            {form.telegramEnabled && (
              <div>
                <Label className="text-xs">Chat ID Telegram</Label>
                <Input value={form.telegramChatId} onChange={e => setForm(f => ({ ...f, telegramChatId: e.target.value }))} placeholder="123456789" className="mt-1" />
              </div>
            )}
          </div>
          <div className="flex gap-2 mt-4">
            <Button onClick={handleAdd} disabled={!form.title}>Adicionar</Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancelar</Button>
          </div>
        </Card>
      )}

      {/* Lista */}
      {tasks.length === 0 ? (
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
                    <h4 className="font-semibold">{task.title}</h4>
                    <Badge className={`border-0 text-xs ${freqColor[task.frequency]}`}>
                      <RefreshCw className="h-3 w-3 mr-1" />{freqLabel[task.frequency]}
                    </Badge>
                    {task.telegramEnabled && <Badge className="bg-blue-100 text-blue-700 border-0 text-xs"><Bell className="h-3 w-3 mr-1" />Telegram</Badge>}
                    {!task.active && <Badge className="bg-gray-100 text-gray-500 border-0 text-xs">Pausada</Badge>}
                  </div>
                  {task.description && <p className="text-sm text-muted-foreground mb-2">{task.description}</p>}
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    {task.responsavel && <span>👤 {task.responsavel}</span>}
                    {task.coResponsavel && <span>👥 {task.coResponsavel}</span>}
                    <span>📅 Próxima: {task.nextRun}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Switch checked={task.active} onCheckedChange={() => toggleActive(task.id)} />
                  <Button variant="ghost" size="sm" className="text-destructive h-7 w-7 p-0" onClick={() => remove(task.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {task.telegramEnabled && selectedTask?.id === task.id && (
                <div className="mt-3 pt-3 border-t">
                  <TelegramNotification defaultChatId={task.telegramChatId} taskTitle={task.title} taskDescription={task.description} />
                </div>
              )}
              {task.telegramEnabled && (
                <Button variant="ghost" size="sm" className="mt-2 h-7 text-xs" onClick={() => setSelectedTask(selectedTask?.id === task.id ? null : task)}>
                  <Bell className="h-3 w-3 mr-1" />{selectedTask?.id === task.id ? 'Fechar' : 'Testar notificação'}
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
