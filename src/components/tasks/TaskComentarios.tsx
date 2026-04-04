import { useState, useEffect, useRef } from 'react';
import { Comentario } from '@/hooks/useTasks';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Icon } from '@iconify/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';

interface Tarefa {
  id: string;
  [key: string]: any;
}

interface TaskComentariosProps {
  tarefa: Tarefa;
  onAddComentario?: (tarefaId: string, conteudo: string) => Promise<void>;
  currentUser?: string;
}

export function TaskComentarios({ tarefa, onAddComentario, currentUser = 'Usuário' }: TaskComentariosProps) {
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [novoComentario, setNovoComentario] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // No DB table yet - just show empty state
  useEffect(() => {
    setCarregando(false);
    setComentarios([]);
  }, [tarefa.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comentarios]);

  const handleSubmit = async () => {
    if (!novoComentario.trim() || !onAddComentario) return;
    setEnviando(true);
    await onAddComentario(tarefa.id, novoComentario.trim());
    setEnviando(false);
    setNovoComentario('');
  };

  const getInitials = (nome: string) => {
    return nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getAvatarColor = (nome: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 
      'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'
    ];
    const index = nome.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {carregando ? (
          <div className="flex items-center justify-center h-32">
            <Icon icon="solar:refresh-circle-bold" className="w-6 h-6 text-stone-400 animate-spin" />
          </div>
        ) : comentarios.length === 0 ? (
          <div className="text-center py-12 text-stone-400">
            <Icon icon="solar:chat-dots-linear" className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Nenhum comentário ainda</p>
            <p className="text-xs">Seja o primeiro a comentar</p>
          </div>
        ) : (
          <AnimatePresence>
            {comentarios.map((comentario, index) => (
              <motion.div
                key={comentario.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex gap-3"
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0 ${getAvatarColor(comentario.autor)}`}>
                  {getInitials(comentario.autor)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-stone-900">{comentario.autor}</span>
                    <span className="text-xs text-stone-400">
                      {format(new Date(comentario.criado_em), "dd MMM 'às' HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                  <p className="text-sm text-stone-700 whitespace-pre-wrap">{comentario.conteudo}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <div className="border-t border-stone-300 p-4 bg-white/50">
        <div className="space-y-3">
          <Textarea
            value={novoComentario}
            onChange={(e) => setNovoComentario(e.target.value)}
            placeholder="Escreva um comentário..."
            rows={3}
            className="bg-white border-stone-300 resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.metaKey) handleSubmit();
            }}
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-stone-400">Cmd + Enter para enviar</span>
            <Button
              onClick={handleSubmit}
              disabled={!novoComentario.trim() || enviando || !onAddComentario}
              size="sm"
              className="bg-stone-900 hover:bg-stone-800"
            >
              {enviando ? (
                <Icon icon="solar:refresh-circle-bold" className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Icon icon="solar:paper-plane-linear" className="w-4 h-4 mr-2" />
                  Enviar
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}