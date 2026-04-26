import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Bot,
  Brain,
  CheckCircle2,
  Copy,
  Download,
  FileText,
  Loader2,
  MessageSquareText,
  Send,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { PageHeader, DataPanel, EmptyState, Toolbar } from "@/components/ui/patterns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import { useAgents } from "@/hooks/useAgents";
import { sendMessageToAI, hasAIConfig, getDefaultProvider, type AIProvider } from "@/services/aiService";
import { askAnythingLlm, workspaceForAgent } from "@/services/anythingLlm";
import { createArtifactFromSources } from "@/services/hermioneArtifacts";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

type ChatMessage =
  | { id: string; type: "message"; role: "user" | "assistant"; content: string; timestamp: Date; sources?: string[] }
  | { id: string; type: "activity"; status: "running" | "done" | "error"; content: string; timestamp: Date };

type GeneratorKind = "social-plan" | "ad-copy" | "social-posts" | "seo-growth" | "support-bot" | "carousel";

const GENERATORS: Array<{
  id: GeneratorKind;
  title: string;
  description: string;
  recommendedModel: string;
  outputName: string;
}> = [
  {
    id: "social-plan",
    title: "Planejamento de Redes Sociais",
    description: "Calendário, pilares, formatos, canais, rotina e métricas.",
    recommendedModel: "Claude ou GPT-4.1",
    outputName: "Planejamento editorial",
  },
  {
    id: "ad-copy",
    title: "Copywriter de Ads",
    description: "Headlines, ângulos, CTAs, variações e matriz de teste.",
    recommendedModel: "Claude, GPT-4.1 ou Kimi",
    outputName: "Kit de anúncios",
  },
  {
    id: "social-posts",
    title: "Posts Estáticos",
    description: "Posts prontos para Instagram, LinkedIn, X/Twitter ou TikTok.",
    recommendedModel: "GPT-4.1 ou Gemini",
    outputName: "Pacote de posts",
  },
  {
    id: "seo-growth",
    title: "SEO e Growth",
    description: "Hipóteses, experimentos, keywords, funil e priorização ICE.",
    recommendedModel: "Gemini ou Claude",
    outputName: "Plano de growth",
  },
  {
    id: "support-bot",
    title: "Bot de Atendimento",
    description: "FAQ, fluxos, tom de voz, escalonamento e respostas padrão.",
    recommendedModel: "GPT-4.1 mini ou Claude Haiku",
    outputName: "Playbook de atendimento",
  },
  {
    id: "carousel",
    title: "Carrossel",
    description: "Estrutura slide a slide, copy visual e prompts de imagem.",
    recommendedModel: "Claude para roteiro + Gemini/ChatGPT para variações",
    outputName: "Roteiro de carrossel",
  },
];

const MODELS: Array<{ value: AIProvider | "anythingllm"; label: string }> = [
  { value: "anythingllm", label: "AnythingLLM workspace" },
  { value: "kimi", label: "Kimi" },
  { value: "groq", label: "Groq" },
  { value: "openai", label: "OpenAI" },
];

function nowId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function downloadMarkdown(title: string, content: string) {
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${title.toLowerCase().replace(/[^a-z0-9]+/gi, "-").replace(/(^-|-$)/g, "") || "totum-os"}.md`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function buildGeneratorOutput(kind: GeneratorKind, fields: Record<string, string>) {
  const generator = GENERATORS.find((item) => item.id === kind)!;
  const title = `${generator.outputName}: ${fields.project || fields.brand || "Novo artefato"}`;
  const today = new Date().toLocaleDateString("pt-BR");

  const sections: Record<GeneratorKind, string> = {
    "social-plan": `## Estratégia Editorial\n\n- Objetivo: ${fields.objective || "Definir presença consistente e mensurável"}\n- Público: ${fields.audience || "Público a validar"}\n- Canais: ${fields.channels || "Instagram, LinkedIn e TikTok"}\n- Tom: ${fields.tone || "Claro, útil e direto"}\n\n## Pilares\n\n| Pilar | Papel | Formatos |\n|---|---|---|\n| Educação | Ensinar e gerar confiança | Carrossel, post curto, tutorial |\n| Prova | Demonstrar resultado | Case, bastidor, antes/depois |\n| Conversão | Chamar para ação | Oferta, checklist, diagnóstico |\n\n## Calendário Inicial\n\n| Semana | Tema | Entregáveis | Métrica |\n|---|---|---|---|\n| 1 | Diagnóstico e autoridade | 2 posts + 1 carrossel | Salvamentos |\n| 2 | Problema e solução | 3 posts + 1 roteiro | Cliques |\n| 3 | Prova social | 2 cases + 1 sequência | Leads |\n| 4 | Conversão | 2 posts + CTA | Conversões |`,
    "ad-copy": `## Ângulos de Anúncio\n\n| Ângulo | Promessa | Gancho |\n|---|---|---|\n| Dor atual | Resolver ${fields.problem || "o gargalo principal"} | "Você ainda perde tempo com isso?" |\n| Resultado | ${fields.objective || "Melhorar performance"} | "O caminho mais curto para..." |\n| Prova | Evidência/case | "Veja o que mudou quando..." |\n\n## Variações\n\n1. Headline: ${fields.offer || "Oferta principal"} sem complicação\n   Texto: Para ${fields.audience || "seu público"}, uma forma direta de transformar ${fields.problem || "o problema"} em resultado.\n   CTA: Quero ver como funciona\n\n2. Headline: Pare de improvisar ${fields.topic || "sua operação"}\n   Texto: Use um processo claro, mensurável e pronto para ajustar conforme os dados aparecem.\n   CTA: Solicitar diagnóstico\n\n## Matriz de Teste\n\n| Criativo | Headline | Público | Métrica |\n|---|---|---|---|\n| A | Dor | Frio | CTR |\n| B | Resultado | Morno | CPL |\n| C | Prova | Remarketing | Conversão |`,
    "social-posts": `## Posts Prontos\n\n### Post 1\nGancho: ${fields.topic || "O erro invisível que trava seus resultados"}\nTexto: ${fields.problem || "Muitos negócios tentam crescer sem transformar conhecimento em processo."} A solução começa com clareza: objetivo, contexto, execução e revisão.\nCTA: Salve para revisar com seu time.\n\n### Post 2\nGancho: Antes de criar mais conteúdo, responda isto.\nTexto: Para quem é? Qual ação queremos? Qual prova sustenta a promessa? Sem essas respostas, o post vira ruído.\nCTA: Compartilhe com quem aprova conteúdo.\n\n### Post 3\nGancho: Um bom sistema de IA não substitui estratégia.\nTexto: Ele organiza contexto, acelera variações e reduz retrabalho. A decisão continua humana, só que mais bem informada.\nCTA: Quer transformar isso em processo? Vamos mapear.`,
    "seo-growth": `## Hipóteses de Growth\n\n| Hipótese | Impacto | Confiança | Esforço | Prioridade |\n|---|---:|---:|---:|---:|\n| Melhorar páginas de alta intenção | Alto | Média | Médio | P1 |\n| Criar clusters sobre ${fields.topic || "tema principal"} | Alto | Alta | Médio | P1 |\n| Testar lead magnet por dor | Médio | Média | Baixo | P2 |\n\n## SEO\n\n- Tema central: ${fields.topic || "tema a validar"}\n- Público: ${fields.audience || "persona principal"}\n- Intenção: comparação, solução, implementação e prova\n\n## Próximos 30 dias\n\n1. Mapear 20 keywords por intenção.\n2. Criar 4 conteúdos pilares.\n3. Medir cliques, leads e avanço no funil.\n4. Repriorizar por ICE.`,
    "support-bot": `## Playbook do Bot\n\n- Persona: atendente objetivo, cordial e resolutivo.\n- Objetivo: resolver dúvidas recorrentes e escalar casos complexos.\n- Base: ${fields.context || "FAQ, políticas, serviços e histórico do cliente"}\n\n## Fluxos\n\n| Situação | Resposta | Escalar quando |\n|---|---|---|\n| Dúvida comum | Responder com passo a passo | Usuário pedir humano |\n| Reclamação | Acolher, pedir dados e abrir triagem | Sentimento negativo alto |\n| Orçamento | Qualificar necessidade | Lead com intenção clara |\n\n## Respostas Base\n\n1. "Entendi. Vou te ajudar com isso agora."\n2. "Para te orientar melhor, me diga: prazo, objetivo e contexto."\n3. "Esse caso merece análise humana. Vou encaminhar com o resumo."`,
    carousel: `## Estrutura do Carrossel\n\nTema: ${fields.topic || "Tema principal"}\nObjetivo: ${fields.objective || "Educar e converter"}\n\n| Slide | Função | Copy |\n|---|---|---|\n| 1 | Hook | ${fields.hook || "Você está resolvendo o problema errado"} |\n| 2 | Contexto | O que parece simples vira gargalo quando não há processo. |\n| 3 | Dor | Sem contexto, cada IA responde de um jeito. |\n| 4 | Virada | Uma biblioteca viva muda o jogo. |\n| 5 | Método | Fonte, skill, prompt, POP e decisão em um só pacote. |\n| 6 | Exemplo | Um briefing vira plano, copy, anúncio e contexto exportável. |\n| 7 | CTA | Salve este roteiro e teste no próximo projeto. |\n\n## Prompt Visual\n\nCriar arte minimalista, layout editorial limpo, alto contraste, tipografia forte, elementos de sistema operacional e biblioteca digital.`,
  };

  return `# ${title}\n\n> Gerado no Totum OS em ${today}. IA recomendada: ${generator.recommendedModel}.\n\n## Briefing\n\n- Projeto/marca: ${fields.project || fields.brand || "Não informado"}\n- Produto/serviço: ${fields.offer || "Não informado"}\n- Público: ${fields.audience || "Não informado"}\n- Objetivo: ${fields.objective || "Não informado"}\n- Tom de voz: ${fields.tone || "Não informado"}\n- Contexto extra: ${fields.context || "Não informado"}\n\n${sections[kind]}\n\n## Feedback e Próxima Versão\n\n- O que manter:\n- O que remover:\n- O que aprofundar:\n- Nova direção:\n`;
}

export default function AICommandCenter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("tab") === "generators" ? "generators" : "chat";
  const { agents, isLoading } = useAgents();
  const [tab, setTab] = useState(initialTab);
  const [selectedAgent, setSelectedAgent] = useState(searchParams.get("agent") || "hermione");
  const [provider, setProvider] = useState<AIProvider | "anythingllm">("anythingllm");
  const [contextFileName, setContextFileName] = useState("contexto-skill.md");
  const [contextMarkdown, setContextMarkdown] = useState("");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      type: "message",
      role: "assistant",
      content:
        "Bem-vindo ao AI Command Center. Escolha um agente, envie contexto/skill em Markdown quando quiser, e eu mostro o que estou fazendo enquanto gero a resposta.",
      timestamp: new Date(),
    },
  ]);
  const [isSending, setIsSending] = useState(false);
  const [generatorKind, setGeneratorKind] = useState<GeneratorKind>("social-plan");
  const [briefing, setBriefing] = useState<Record<string, string>>({});
  const [generatedDoc, setGeneratedDoc] = useState("");
  const [saveStatus, setSaveStatus] = useState("");

  const selectedAgentData = useMemo(() => {
    return agents.find((agent) => agent.slug === selectedAgent || agent.id === selectedAgent || agent.name.toLowerCase() === selectedAgent);
  }, [agents, selectedAgent]);

  const selectedGenerator = GENERATORS.find((item) => item.id === generatorKind)!;

  function pushActivity(content: string, status: "running" | "done" | "error" = "running") {
    const id = nowId();
    setMessages((prev) => [...prev, { id, type: "activity", status, content, timestamp: new Date() }]);
    return id;
  }

  function completeActivity(id: string, status: "done" | "error", content?: string) {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === id && message.type === "activity"
          ? { ...message, status, content: content || message.content }
          : message
      )
    );
  }

  async function logChatEvent(summary: string, status: "running" | "done" | "error" = "done", metadata: Record<string, unknown> = {}) {
    try {
      await (supabase as any).from("agent_chat_events").insert({
        conversation_id: `totum-os-${selectedAgent}`,
        agent_id: selectedAgentData?.id || null,
        agent_slug: selectedAgentData?.slug || selectedAgent,
        event_type: "activity",
        status,
        summary,
        metadata,
      });
    } catch {
      // Logging should never block the conversation.
    }
  }

  async function handleSend() {
    if (!input.trim() || isSending) return;
    const userMessage = input.trim();
    setInput("");
    setIsSending(true);
    setMessages((prev) => [
      ...prev,
      { id: nowId(), type: "message", role: "user", content: userMessage, timestamp: new Date() },
    ]);

    const contextStep = pushActivity("Organizando agente, contexto e skill recebidos...");
    logChatEvent("Organizando agente, contexto e skill recebidos", "running", { hasContext: !!contextMarkdown.trim() });
    await new Promise((resolve) => setTimeout(resolve, 180));
    completeActivity(contextStep, "done");

    const engineStep = pushActivity(
      provider === "anythingllm"
        ? "Consultando workspace AnythingLLM do agente..."
        : `Chamando ${provider.toUpperCase()} com o DNA do agente...`
    );
    logChatEvent("Consultando motor do agente", "running", { provider });

    try {
      let responseText = "";
      let sources: string[] = [];

      if (provider === "anythingllm") {
        const result = await askAnythingLlm({
          workspaceSlug: workspaceForAgent(selectedAgentData?.slug || selectedAgent),
          message: userMessage,
          sessionId: `totum-os-${selectedAgent}`,
          agentSlug: selectedAgentData?.slug || selectedAgent,
          attachments: contextMarkdown.trim()
            ? [{ name: contextFileName || "contexto-skill.md", content: contextMarkdown, mime: "text/markdown" }]
            : [],
        });
        responseText = result.text || "O workspace respondeu sem texto. Verifique a configuração do AnythingLLM.";
        sources = result.sources.map((source) => source.title || source.document || source.url || "Fonte AnythingLLM");
      } else if (hasAIConfig()) {
        const result = await sendMessageToAI(
          [
            {
              role: "system",
              content: `Você está no Totum OS. Responda como o agente ${selectedAgentData?.name || selectedAgent}. Se houver contexto em Markdown, use-o e cite lacunas. Contexto:\n\n${contextMarkdown || "Sem contexto externo."}`,
            },
            { role: "user", content: userMessage },
          ],
          provider
        );
        if (result.error) throw new Error(result.error);
        responseText = result.content;
      } else {
        responseText =
          "Não encontrei uma API de IA configurada neste ambiente. Ainda assim, o AI Command Center está pronto: selecione um agente, envie contexto/skill em Markdown e configure AnythingLLM ou uma chave Kimi/Groq/OpenAI para respostas reais.";
      }

      completeActivity(engineStep, "done", "Resposta gerada e pronta para revisão.");
      logChatEvent("Resposta gerada e pronta para revisão", "done", { provider, sourceCount: sources.length });
      setMessages((prev) => [
        ...prev,
        {
          id: nowId(),
          type: "message",
          role: "assistant",
          content: responseText,
          timestamp: new Date(),
          sources,
        },
      ]);
    } catch (error) {
      completeActivity(engineStep, "error", "Motor de chat indisponível; usando fallback explicativo.");
      logChatEvent("Motor de chat indisponível; fallback exibido", "error", {
        provider,
        error: error instanceof Error ? error.message : "unknown",
      });
      setMessages((prev) => [
        ...prev,
        {
          id: nowId(),
          type: "message",
          role: "assistant",
          content: `Não consegui acionar o motor selecionado agora. Detalhe: ${error instanceof Error ? error.message : "erro desconhecido"}.\n\nFallback: mantenha o briefing/contexto em Markdown e tente novamente quando o AnythingLLM ou a API de modelo estiver configurada.`,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  function handleTabChange(value: string) {
    setTab(value);
    const next = new URLSearchParams(searchParams);
    if (value === "generators") next.set("tab", "generators");
    else next.delete("tab");
    setSearchParams(next, { replace: true });
  }

  function setBriefingValue(key: string, value: string) {
    setBriefing((prev) => ({ ...prev, [key]: value }));
  }

  function generateDocument() {
    const output = buildGeneratorOutput(generatorKind, briefing);
    setGeneratedDoc(output);
    setSaveStatus("");
  }

  async function saveGeneratedToAlexandria() {
    if (!generatedDoc.trim()) return;
    setSaveStatus("Salvando na Alexandria...");
    try {
      await createArtifactFromSources(
        [
          {
            name: `${selectedGenerator.outputName}.md`,
            content: generatedDoc,
            origin: "AI Command Center",
            author: selectedAgentData?.name || "Totum OS",
          },
        ],
        { type: "document", status: "draft" }
      );
      setSaveStatus("Salvo como artefato draft na Alexandria.");
    } catch (error) {
      setSaveStatus(error instanceof Error ? error.message : "Não foi possível salvar na Alexandria.");
    }
  }

  return (
    <AppLayout>
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:p-6">
        <PageHeader
          eyebrow="Totum OS"
          title="AI Command Center"
          description="Chat único para chamar agentes, trocar IA/modelo, enviar contexto ou skill em Markdown e gerar documentos operacionais prontos para revisão."
          icon={MessageSquareText}
          actions={
            <Button variant="outline" onClick={() => downloadMarkdown("contexto-totum-os", contextMarkdown || "# Contexto Totum OS\n")}>
              <Download className="h-4 w-4" />
              Baixar contexto
            </Button>
          }
        />

        <Tabs value={tab} onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2 md:w-[420px]">
            <TabsTrigger value="chat">Chat único</TabsTrigger>
            <TabsTrigger value="generators">Input para Output</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
              <Card className="min-h-[620px]">
                <CardContent className="flex h-full min-h-[620px] flex-col p-0">
                  <div className="border-b border-border p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {selectedAgentData?.emoji || ""} {selectedAgentData?.name || "Hermione"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Workspace: {workspaceForAgent(selectedAgentData?.slug || selectedAgent)}
                        </p>
                      </div>
                      <Badge variant="outline">log resumido ativo</Badge>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4 overflow-y-auto p-4">
                    {messages.map((message) =>
                      message.type === "activity" ? (
                        <div key={message.id} className="mx-auto flex max-w-xl items-center justify-center gap-2 text-xs text-muted-foreground">
                          {message.status === "running" ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <CheckCircle2 className={cn("h-3.5 w-3.5", message.status === "error" ? "text-destructive" : "text-emerald-600")} />
                          )}
                          <span>{message.content}</span>
                        </div>
                      ) : (
                        <div key={message.id} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
                          <div
                            className={cn(
                              "max-w-[82%] border p-4 text-sm",
                              message.role === "user"
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-card text-card-foreground"
                            )}
                          >
                            <MarkdownRenderer content={message.content} className="text-sm" />
                            {!!message.sources?.length && (
                              <div className="mt-3 border-t border-current/20 pt-2 text-xs opacity-75">
                                Fontes: {message.sources.join(", ")}
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    )}
                  </div>

                  <div className="border-t border-border p-4">
                    <div className="flex gap-2">
                      <Input
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" && !event.shiftKey) {
                            event.preventDefault();
                            handleSend();
                          }
                        }}
                        placeholder="Chame um agente, peça uma análise ou envie uma tarefa..."
                        disabled={isSending}
                      />
                      <Button onClick={handleSend} disabled={!input.trim() || isSending} size="icon">
                        {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <DataPanel title="Agente e IA">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Agente</Label>
                      <Select value={selectedAgent} onValueChange={setSelectedAgent}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um agente" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hermione">Hermione</SelectItem>
                          {isLoading ? (
                            <SelectItem value="loading" disabled>Carregando agentes...</SelectItem>
                          ) : (
                            agents.slice(0, 80).map((agent) => (
                              <SelectItem key={agent.id} value={agent.slug || agent.id}>
                                {agent.emoji} {agent.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Motor/modelo</Label>
                      <Select value={provider} onValueChange={(value) => setProvider(value as AIProvider | "anythingllm")}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MODELS.map((model) => (
                            <SelectItem key={model.value} value={model.value}>
                              {model.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        Fallback atual: {getDefaultProvider().toUpperCase()} quando AnythingLLM não estiver disponível.
                      </p>
                    </div>
                  </div>
                </DataPanel>

                <DataPanel title="Enviar contexto e skill">
                  <div className="space-y-3">
                    <Input value={contextFileName} onChange={(event) => setContextFileName(event.target.value)} />
                    <Textarea
                      value={contextMarkdown}
                      onChange={(event) => setContextMarkdown(event.target.value)}
                      placeholder="# Skill ou contexto\nCole aqui um MD para usar no chat ou baixar para Claude, Kimi, ChatGPT, Gemini..."
                      className="min-h-[220px]"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" onClick={() => navigator.clipboard.writeText(contextMarkdown)} disabled={!contextMarkdown.trim()}>
                        <Copy className="h-4 w-4" />
                        Copiar
                      </Button>
                      <Button variant="outline" onClick={() => downloadMarkdown(contextFileName, contextMarkdown)} disabled={!contextMarkdown.trim()}>
                        <Download className="h-4 w-4" />
                        MD
                      </Button>
                    </div>
                  </div>
                </DataPanel>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="generators" className="mt-6">
            <div className="grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
              <DataPanel title="Geradores">
                <div className="space-y-2">
                  {GENERATORS.map((generator) => (
                    <button
                      key={generator.id}
                      onClick={() => setGeneratorKind(generator.id)}
                      className={cn(
                        "w-full border p-3 text-left transition-colors",
                        generatorKind === generator.id ? "border-primary bg-primary/10" : "border-border bg-card hover:bg-muted"
                      )}
                    >
                      <p className="text-sm font-semibold text-foreground">{generator.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{generator.description}</p>
                      <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                        {generator.recommendedModel}
                      </p>
                    </button>
                  ))}
                </div>
              </DataPanel>

              <div className="space-y-6">
                <Toolbar>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{selectedGenerator.title}</p>
                    <p className="text-xs text-muted-foreground">Preencha o briefing, gere um MD único e refine com feedback.</p>
                  </div>
                  <Button onClick={generateDocument}>
                    <WandSparkles className="h-4 w-4" />
                    Gerar documento
                  </Button>
                </Toolbar>

                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    ["project", "Projeto ou marca"],
                    ["offer", "Produto, serviço ou oferta"],
                    ["audience", "Público-alvo"],
                    ["objective", "Objetivo"],
                    ["topic", "Tema central"],
                    ["tone", "Tom de voz"],
                  ].map(([key, label]) => (
                    <div key={key} className="space-y-2">
                      <Label>{label}</Label>
                      <Input value={briefing[key] || ""} onChange={(event) => setBriefingValue(key, event.target.value)} />
                    </div>
                  ))}
                  <div className="space-y-2 md:col-span-2">
                    <Label>Contexto, referências, restrições ou feedback</Label>
                    <Textarea
                      value={briefing.context || ""}
                      onChange={(event) => setBriefingValue("context", event.target.value)}
                      className="min-h-[120px]"
                    />
                  </div>
                  {generatorKind === "carousel" && (
                    <div className="space-y-2 md:col-span-2">
                      <Label>Hook do primeiro slide</Label>
                      <Input value={briefing.hook || ""} onChange={(event) => setBriefingValue("hook", event.target.value)} />
                    </div>
                  )}
                </div>

                {generatedDoc ? (
                  <Card>
                    <CardContent className="space-y-4 p-5">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-semibold text-foreground">Documento gerado</p>
                          <p className="text-xs text-muted-foreground">Revise, dê feedback, salve na Alexandria ou baixe em Markdown.</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button variant="outline" onClick={() => navigator.clipboard.writeText(generatedDoc)}>
                            <Copy className="h-4 w-4" />
                            Copiar
                          </Button>
                          <Button variant="outline" onClick={() => downloadMarkdown(selectedGenerator.outputName, generatedDoc)}>
                            <Download className="h-4 w-4" />
                            Baixar
                          </Button>
                          <Button onClick={saveGeneratedToAlexandria}>
                            <Brain className="h-4 w-4" />
                            Salvar Alexandria
                          </Button>
                        </div>
                      </div>
                      {saveStatus && <p className="text-xs text-muted-foreground">{saveStatus}</p>}
                      <div className="border border-border bg-muted/40 p-4">
                        <MarkdownRenderer content={generatedDoc} className="text-sm" />
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <EmptyState
                    icon={FileText}
                    title="Nenhum documento gerado ainda"
                    description="Preencha o briefing e gere a primeira versão. O resultado já sai em Markdown para revisão e exportação."
                  />
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </AppLayout>
  );
}
