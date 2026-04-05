import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, BookOpen, Sparkles, History, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { searchGiles, GilesChunk, logQuery } from '@/services/giles';
import { askGeminiAsGiles, isGeminiConfigured, GEMINI_MODELS, getModelInfo } from '@/services/gemini';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  context?: GilesChunk[];
}

interface ChatSession {
  id: string;
  title: string;
  date: Date;
  messageCount: number;
}

export default function GilesChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Olá! Eu sou o **GILES**, Cientista da Informação e Bibliotecário da Totum.\n\nPosso ajudar você a:\n• 🔍 Buscar conhecimento na Alexandria\n• 📚 Encontrar documentação\n• 🔗 Conectar informações relacionadas\n• 📖 Responder perguntas baseadas no nosso banco de dados\n\nO que gostaria de saber?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>(GEMINI_MODELS.FLASH);
  const [geminiError, setGeminiError] = useState<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock de sessões anteriores (futuramente virá do banco)
  const [sessions] = useState<ChatSession[]>([
    { id: '1', title: 'Arquitetura do projeto', date: new Date(Date.now() - 86400000), messageCount: 12 },
    { id: '2', title: 'POP de deploy', date: new Date(Date.now() - 172800000), messageCount: 8 },
    { id: '3', title: 'Configuração SSL', date: new Date(Date.now() - 259200000), messageCount: 5 },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Verificar se Gemini está configurado
      if (!isGeminiConfigured()) {
        setGeminiError('API key do Gemini não configurada. Adicione VITE_GEMINI_API_KEY no arquivo .env');
        setIsLoading(false);
        return;
      }

      // Buscar contexto relevante na Alexandria
      const contextResults = await searchGiles(userMessage.content, { limit: 5 });
      
      // Preparar histórico da conversa
      const conversationHistory = messages
        .filter(m => m.id !== 'welcome')
        .map(m => ({
          role: m.role,
          text: m.content
        }));
      
      // Gerar resposta com Gemini
      const geminiResponse = await askGeminiAsGiles(
        userMessage.content,
        contextResults.map(r => ({ 
          content: r.content, 
          dominio: r.dominio, 
          categoria: r.categoria 
        })),
        conversationHistory
      );
      
      if (geminiResponse.error) {
        setGeminiError(geminiResponse.error);
      }
      
      // Logar a consulta
      await logQuery(userMessage.content, 'user', contextResults);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: geminiResponse.text || 'Desculpe, não consegui processar sua pergunta no momento.',
        timestamp: new Date(),
        context: contextResults
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao buscar na Alexandria. Tente novamente.',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Hoje';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem';
    } else {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short'
      });
    }
  };

  const suggestedQuestions = [
    'Qual o POP de deploy?',
    'Como funciona a arquitetura?',
    'Quem são os agentes da Totum?',
    'Onde está documentado o SSL?',
    'Explique a estrutura do projeto'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto h-screen flex">
        
        {/* Sidebar - History */}
        {showHistory && (
          <div className="w-80 bg-slate-950 border-r border-slate-800 flex flex-col">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-amber-400" />
                <h2 className="text-white font-semibold">Histórico</h2>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowHistory(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {sessions.map((session) => (
                  <button
                    key={session.id}
                    className="w-full text-left p-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 transition-all group"
                  >
                    <p className="text-white font-medium text-sm group-hover:text-amber-400 transition-colors">
                      {session.title}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-slate-500">
                        {formatDate(session.date)}
                      </span>
                      <span className="text-xs text-slate-600">
                        {session.messageCount} msgs
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="h-16 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              {!showHistory && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowHistory(true)}
                  className="text-slate-400 hover:text-white"
                >
                  <History className="w-5 h-5" />
                </Button>
              )}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-purple-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-semibold">GILES</h1>
                <p className="text-xs text-slate-400">Cientista da Informação</p>
              </div>
              <Badge variant="outline" className="ml-2 border-green-500 text-green-400">
                🟢 Online
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              {/* Seletor de Modelo */}
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-slate-800 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-slate-700 focus:border-amber-500 focus:outline-none"
              >
                <option value={GEMINI_MODELS.FLASH_LITE}>⚡ Flash Lite</option>
                <option value={GEMINI_MODELS.FLASH}>⚡ Flash</option>
                <option value={GEMINI_MODELS.PRO}>🧠 Pro</option>
              </select>

              <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                <Sparkles className="w-3 h-3 mr-1" />
                Gemini
              </Badge>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-6">
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Alerta de configuração */}
              {geminiError && (
                <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-4">
                  <p className="text-red-300 text-sm">
                    ⚠️ <strong>Configuração necessária:</strong> {geminiError}
                  </p>
                  <p className="text-red-400 text-xs mt-2">
                    Obtenha sua API key em: <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a>
                  </p>
                </div>
              )}
              
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <Avatar className={message.role === 'assistant' ? 'bg-amber-600' : 'bg-purple-600'}
                  >
                    <AvatarFallback>
                      {message.role === 'assistant' ? <BookOpen className="w-5 h-5" /> : <User className="w-5 h-5" />}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`max-w-[80%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <Card className={`${
                      message.role === 'assistant' 
                        ? 'bg-slate-800 border-slate-700 text-white' 
                        : 'bg-purple-600 border-purple-500 text-white'
                    }`}>
                      <CardContent className="p-4">
                        <div className="whitespace-pre-wrap">
                          {message.content}
                        </div>
                        
                        {/* Mostrar contexto se existir */}
                        {message.context && message.context.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-slate-600">
                            <p className="text-xs text-slate-400 mb-2">Fontes consultadas:</p>
                            <div className="space-y-1">
                              {message.context.slice(0, 3).map((ctx, idx) => (
                                <div key={idx} className="text-xs text-slate-500 bg-slate-900/50 p-2 rounded">
                                  <span className="text-amber-400">{ctx.dominio}</span> → {ctx.content.substring(0, 60)}...
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    <span className="text-xs text-slate-500 mt-1">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-4">
                  <Avatar className="bg-amber-600">
                    <AvatarFallback><BookOpen className="w-5 h-5" /></AvatarFallback>
                  </Avatar>
                  <Card className="bg-slate-800 border-slate-700">
                    <CardContent className="p-4 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                      <span className="text-slate-400">Consultando a Alexandria...</span>
                    </CardContent>
                  </Card>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area */}
          <div className="p-6 border-t border-slate-800 bg-slate-950">
            <div className="max-w-3xl mx-auto">
              {/* Sugestões */}
              {messages.length === 1 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setInputMessage(question);
                      }}
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full transition-colors"
                    >
                      {question}
                    </button>
                  ))}
                </div>
              )}
              
              <div className="flex gap-3">
                <Input
                  placeholder="Pergunte algo à Alexandria..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 h-12"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="h-12 px-6 bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-600 hover:to-purple-700"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
              
              <p className="text-xs text-slate-600 mt-2 text-center">
                GILES consulta a Alexandria em tempo real • Respostas baseadas em documentação oficial
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
