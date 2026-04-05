import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useAgentTasks, AgenteType, TarefaAgente, AGENTES } from '@/hooks/useAgentTasks';
import { useToast } from '@/hooks/use-toast';
import { 
  Play, 
  Pause, 
  Clock, 
  Calendar, 
  Repeat, 
  Terminal, 
  CheckCircle2, 
  XCircle, 
  Loader2,
  Plus,
  Trash2,
  Edit3,
  Activity,
  Bot
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

export function AgentTaskManager() {
  const {
    tarefas,
    logs,
    loading,
    executando,
    agentes,
    criarTarefaAgente,
    atualizarTarefaAgente,
    executarTarefa,
    getTarefasPorAgente,
    getEstatisticas,
  } = useAgentTasks();

  const [modalOpen, setModalOpen] = useState(false);
  const [tarefaEditando, setTarefaEditando] = useState<TarefaAgente | null>(null);
  const [agenteFiltro, setAgenteFiltro] = useState<AgenteType | 'todos'>('todos');

  const estatisticas = getEstatisticas();

  const tarefasFiltradas = agenteFiltro === 'todos' 
    ? tarefas 
    : getTarefasPorAgente(agenteFiltro);

  return (
    <div className="space-y-6">
      {/* Header com Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-stone-800 to-stone-900 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-stone-400 uppercase tracking-wider">Total de Tarefas</p>
                <p className="text-2xl font-bold">{estatisticas.total}</p>
              </div>
              <Bot className="w-8 h-8 text-stone-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wider">Executadas Hoje</p>
                <p className="text-2xl font-bold text-emerald-600">{estatisticas.executadasHoje}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wider">Agendadas</p>
                <p className="text-2xl font-bold text-blue-600">
                  {tarefas.filter(t => t.proxima_execucao).length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-stone-500 uppercase tracking-wider">Em Execução</p>
                <p className="text-2xl font-bold text-amber-600">{executando.size}</p>
              </div>
              <Activity className="w-8 h-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cards dos Agentes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {estatisticas.porAgente.map((agente) => (
          <motion.div
            key={agente.id}
            whileHover={{ scale: 1.02 }}
            className="cursor-pointer"
            onClick={() => setAgenteFiltro(agenteFiltro === agente.id ? 'todos' : agente.id)}
          >
            <Card 
              className={`transition-all ${
                agenteFiltro === agente.id 
                  ? 'ring-2 ring-offset-2' 
                  : 'hover:shadow-lg'
              }`}
              style={{ 
                ringColor: agenteFiltro === agente.id ? agente.cor : undefined 
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${agente.cor}20` }}
                    >
                      {agente.icone}
                    </div>
                    <div>
                      <p className="font-semibold text-stone-900">{agente.nome}</p>
                      <p className="text-xs text-stone-500">{agente.totalTarefas} tarefas</p>
                    </div>
                  </div>
                  
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: agente.cor }}
                  />
                </div>
                
                <p className="text-xs text-stone-600 mt-3 line-clamp-2">
                  {agente.descricao}
                </p>
                
                <div className="flex flex-wrap gap-1 mt-3">
                  {agente.capabilities.slice(0, 3).map(cap => (
                    <Badge key={cap} variant="secondary" className="text-[10px]">
                      {cap}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant={agenteFiltro === 'todos' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setAgenteFiltro('todos')}
          >
            Todos
          </Button>
          
          {agentes.map(agente => (
            <Button
              key={agente.id}
              variant={agenteFiltro === agente.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setAgenteFiltro(agente.id)}
              style={agenteFiltro === agente.id ? { backgroundColor: agente.cor, borderColor: agente.cor } : {}}
            >
              {agente.icone} {agente.nome}
            </Button>
          ))}
        </div>

        <Button onClick={() => { setTarefaEditando(null); setModalOpen(true); }}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Tarefa de Agente
        </Button>
      </div>

      {/* Lista de Tarefas */}
      <div className="space-y-3">
        <AnimatePresence>
          {tarefasFiltradas.map((tarefa) => (
            <TarefaAgenteCard
              key={tarefa.id}
              tarefa={tarefa}
              executando={executando.has(tarefa.id)}
              onEditar={() => { setTarefaEditando(tarefa); setModalOpen(true); }}
              onExecutar={() => executarTarefa(tarefa.id)}
            />
          ))}
        </AnimatePresence>

        {tarefasFiltradas.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center text-stone-500">
              <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhuma tarefa de agente encontrada.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => { setTarefaEditando(null); setModalOpen(true); }}
              >
                Criar primeira tarefa
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Modal Criar/Editar */}
      <AgentTaskModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        tarefa={tarefaEditando}
        onSalvar={async (dados) => {
          if (tarefaEditando) {
            await atualizarTarefaAgente(tarefaEditando.id, dados);
          } else {
            await criarTarefaAgente(dados as TarefaAgente);
          }
          setModalOpen(false);
        }}
      />
    </div>
  );
}

// ============================================
// CARD DE TAREFA
// ============================================

interface TarefaAgenteCardProps {
  tarefa: TarefaAgente;
  executando: boolean;
  onEditar: () => void;
  onExecutar: () => void;
}

function TarefaAgenteCard({ tarefa, executando, onEditar, onExecutar }: TarefaAgenteCardProps) {
  const agente = AGENTES.find(a => a.id === tarefa.agente_id);
  const isAtrasada = tarefa.proxima_execucao && new Date(tarefa.proxima_execucao) < new Date();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
    >
      <Accordion type="single" collapsible>
        <AccordionItem value={tarefa.id} className="border rounded-lg overflow-hidden">
          <div className="flex items-center p-4 bg-white">
            {/* Ícone do Agente */}
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center text-lg mr-4"
              style={{ backgroundColor: `${agente?.cor}20` }}
            >
              {agente?.icone}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-stone-900 truncate">{tarefa.titulo}</p>
                
                {tarefa.recorrencia !== 'unica' && (
                  <Badge variant="outline" className="text-[10px]">
                    <Repeat className="w-3 h-3 mr-1" />
                    {tarefa.recorrencia}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                <span>{agente?.nome}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {tarefa.horario_execucao}
                </span>
                
                {tarefa.proxima_execucao && (
                  <>
                    <span>•</span>
                    <span className={isAtrasada ? 'text-red-500' : ''}>
                      {isAtrasada ? 'Atrasada' : formatDistanceToNow(new Date(tarefa.proxima_execucao), { addSuffix: true, locale: ptBR })}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Ações */}
            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => { e.stopPropagation(); onExecutar(); }}
                disabled={executando}
              >
                {executando ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Play className="w-4 h-4 text-emerald-600" />
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => { e.stopPropagation(); onEditar(); }}
              >
                <Edit3 className="w-4 h-4" />
              </Button>

              <AccordionTrigger className="p-0 hover:no-underline">
                <span className="sr-only">Expandir</span>
              </AccordionTrigger>
            </div>
          </div>

          <AccordionContent className="px-4 pb-4 bg-stone-50">
            <div className="space-y-3 pt-2">
              <p className="text-sm text-stone-600">{tarefa.descricao || 'Sem descrição'}</p>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  <Terminal className="w-3 h-3 mr-1" />
                  {tarefa.params.comando}
                </Badge>
                
                {tarefa.data_inicio && (
                  <Badge variant="outline">
                    <Calendar className="w-3 h-3 mr-1" />
                    {format(new Date(tarefa.data_inicio), 'dd/MM/yyyy')}
                  </Badge>
                )}
              </div>

              {tarefa.ultimo_resultado && (
                <div className={`p-3 rounded-lg text-sm ${
                  tarefa.ultimo_resultado.sucesso 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>
                  <div className="flex items-center gap-2">
                    {tarefa.ultimo_resultado.sucesso ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <XCircle className="w-4 h-4" />
                    )}
                    <span className="font-medium">
                      Última execução: {tarefa.ultimo_resultado.mensagem}
                    </span>
                  </div>
                  
                  {tarefa.ultima_execucao && (
                    <p className="text-xs mt-1 opacity-75">
                      {format(new Date(tarefa.ultima_execucao), 'dd/MM/yyyy HH:mm')}
                    </p>
                  )}
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </motion.div>
  );
}

// ============================================
// MODAL CRIAR/EDITAR
// ============================================

interface AgentTaskModalProps {
  open: boolean;
  onClose: () => void;
  tarefa: TarefaAgente | null;
  onSalvar: (dados: Partial<TarefaAgente>) => void;
}

function AgentTaskModal({ open, onClose, tarefa, onSalvar }: AgentTaskModalProps) {
  const [formData, setFormData] = useState<Partial<TarefaAgente>>({
    titulo: '',
    descricao: '',
    agente_id: 'Pablo',
    recorrencia: 'diaria',
    horario_execucao: '08:00',
    data_inicio: new Date().toISOString().split('T')[0],
    params: { comando: 'relatorio' },
    ...tarefa,
  });

  const isEditing = !!tarefa;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSalvar(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar' : 'Nova'} Tarefa de Agente
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div>
            <label className="text-sm font-medium">Título</label>
            <Input
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              placeholder="Ex: Backup diário do sistema"
              required
            />
          </div>

          {/* Agente */}
          <div>
            <label className="text-sm font-medium">Agente</label>
            <Select 
              value={formData.agente_id} 
              onValueChange={(v) => setFormData({ ...formData, agente_id: v as AgenteType })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AGENTES.map(agente => (
                  <SelectItem key={agente.id} value={agente.id}>
                    <span className="flex items-center gap-2">
                      <span>{agente.icone}</span>
                      <span>{agente.nome}</span>
                      <span className="text-xs text-stone-400">- {agente.descricao}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Recorrência e Horário */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Recorrência</label>
              <Select 
                value={formData.recorrencia} 
                onValueChange={(v) => setFormData({ ...formData, recorrencia: v as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unica">Única</SelectItem>
                  <SelectItem value="diaria">Diária</SelectItem>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="mensal">Mensal</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Horário</label>
              <Input
                type="time"
                value={formData.horario_execucao}
                onChange={(e) => setFormData({ ...formData, horario_execucao: e.target.value })}
                required
              />
            </div>
          </div>

          {/* Comando */}
          <div>
            <label className="text-sm font-medium">Comando</label>
            <Select 
              value={formData.params?.comando} 
              onValueChange={(v) => setFormData({ 
                ...formData, 
                params: { ...formData.params, comando: v }
              })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="backup">🗄️ Backup</SelectItem>
                <SelectItem value="relatorio">📊 Gerar Relatório</SelectItem>
                <SelectItem value="scraping">🔍 Scraping/Web Scraping</SelectItem>
                <SelectItem value="monitoramento">👁️ Monitoramento</SelectItem>
                <SelectItem value="limpeza">🧹 Limpeza de Dados</SelectItem>
                <SelectItem value="sync">🔄 Sincronização</SelectItem>
                <SelectItem value="alerta">🚨 Verificar Alertas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Descrição */}
          <div>
            <label className="text-sm font-medium">Descrição (opcional)</label>
            <Textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              placeholder="Detalhes sobre o que o agente deve fazer..."
              rows={3}
            />
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? 'Salvar' : 'Criar'} Tarefa
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
