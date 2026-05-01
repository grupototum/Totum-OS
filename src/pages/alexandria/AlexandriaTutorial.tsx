import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  FileText,
  Library,
  Lightbulb,
  Link2,
  Cloud,
  Download,
  Sparkles,
} from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { PageBreadcrumb } from "@/components/navigation/PageBreadcrumb";
import { PageHeader, DataPanel, SectionHeader } from "@/components/ui/patterns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type TutorialItem = {
  id: string;
  name: string;
  path: string;
  icon: typeof BookOpen;
  what: string;
  impact: string;
  connections: string;
  example: string;
  outcome: string;
};

const tutorialItems: TutorialItem[] = [
  {
    id: "alexandria",
    name: "Alexandria",
    path: "/alexandria",
    icon: BookOpen,
    what: "Página-mãe da biblioteca operacional do Totum OS. É o ponto de entrada para fontes, artefatos, skills, POPs, contexto e exportação.",
    impact: "Centraliza o conhecimento do time e reduz o tempo perdido procurando decisões, materiais e instruções espalhadas.",
    connections: "Conecta com Hermione, Skills Central, POPs, Context Hub, Conexões e os exports para Claude, ChatGPT e Kimi.",
    example: "Quando surgir uma nova capacidade ou processo, abra a Alexandria para decidir se aquilo deve virar skill, POP, contexto ou pacote exportável.",
    outcome: "Resultado esperado: o conhecimento entra no lugar certo e fica governado para o resto da operação.",
  },
  {
    id: "hermione",
    name: "Hermione",
    path: "/hermione",
    icon: Brain,
    what: "Chat consultivo e camada de assimilação da Alexandria. Ela lê documentos, unifica conteúdos e transforma material bruto em artefatos reutilizáveis.",
    impact: "Acelera documentação prática, reduz retrabalho e transforma material solto de várias IAs em algo consistente para a operação.",
    connections: "Conecta com fontes da Alexandria, uploads locais, skill sync, Gemini e os artefatos versionados no ecossistema.",
    example: "Envie vários MDs sobre um processo e peça para analisar, unificar e gerar uma skill pronta para uso.",
    outcome: "Resultado esperado: você recebe uma versão consolidada, com lacunas e conflitos apontados, pronta para virar ativo operacional.",
  },
  {
    id: "pops",
    name: "Portal POPs & SLAs",
    path: "/alexandria/pops",
    icon: FileText,
    what: "Área dedicada a procedimentos operacionais, padrões e acordos de serviço do ecossistema Totum.",
    impact: "Padroniza a execução, reduz ambiguidade operacional e melhora onboarding e continuidade do trabalho.",
    connections: "Conecta com Hermione, Alexandria e a camada de artefatos operacionais que humanos e agentes consultam.",
    example: "Documente um fluxo de atendimento recorrente com etapas, responsáveis, entradas e critérios de qualidade.",
    outcome: "Resultado esperado: um POP reutilizável, fácil de consultar e útil tanto no treinamento quanto na execução.",
  },
  {
    id: "context",
    name: "Context Hub",
    path: "/alexandria/context",
    icon: Library,
    what: "Painel que organiza como contexto, conhecimento e instruções circulam entre agentes, execuções e fluxos internos.",
    impact: "Evita que agentes trabalhem cegos ou com contexto errado, melhorando previsibilidade e consistência nas respostas.",
    connections: "Conecta com agentes, skills, contexto da Alexandria e a orquestração geral do Totum OS.",
    example: "Revise qual contexto um agente deveria consumir antes de liberar um novo fluxo ou uma nova automação.",
    outcome: "Resultado esperado: o agente opera com base certa, menos incoerência e menos necessidade de correção manual.",
  },
  {
    id: "skills",
    name: "Skills Central",
    path: "/alexandria/skills",
    icon: Lightbulb,
    what: "Catálogo operacional das skills do Totum, com o skill router como skill principal e o botão único de sincronização.",
    impact: "Organiza capacidades da operação, facilita manutenção e distribui as skills certas para as IAs certas.",
    connections: "Conecta com `skills-registry`, `skill_router`, GitHub, sync para Claude, ChatGPT e Kimi e a malha de agentes.",
    example: "Abra a central para revisar skills ativas, validar a principal e disparar a sincronização multi-provider.",
    outcome: "Resultado esperado: as skills ficam organizadas, roteadas e prontas para consumo externo ou interno.",
  },
  {
    id: "bridges",
    name: "Conexões da Alexandria",
    path: "/alexandria/bridges",
    icon: Link2,
    what: "Ponte segura entre Alexandria e fontes externas, como Logseq local, Google Drive e outros pacotes assimiláveis.",
    impact: "Traz conhecimento útil para dentro da Alexandria sem misturar conteúdo sensível, pessoal ou irrelevante.",
    connections: "Conecta com Logseq local, Google Drive, Hermione, política verde/amarelo/vermelho e assimilação de artefatos.",
    example: "Importe uma pasta de skills do Logseq ou uma pasta do Drive com documentação operacional sanitizada.",
    outcome: "Resultado esperado: só o conteúdo permitido entra e vira fonte rastreável dentro da Alexandria.",
  },
  {
    id: "openclaw",
    name: "OpenClaw Dashboard",
    path: "/alexandria/openclaw",
    icon: Cloud,
    what: "Painel operacional da camada OpenClaw ligada à execução de agentes, contextos e skills no ecossistema.",
    impact: "Dá visibilidade para a operação inteligente, ajudando a identificar gargalos, dependências e oportunidades de ajuste.",
    connections: "Conecta com agentes, skills, fluxos internos e a infraestrutura que suporta execução de IA no Totum OS.",
    example: "Use o dashboard para entender como um agente está operando e se ele está consumindo as skills corretas.",
    outcome: "Resultado esperado: ajustes mais rápidos na orquestração e menos opacidade na execução dos agentes.",
  },
  {
    id: "exports",
    name: "Exportar",
    path: "/alexandria?tab=exports",
    icon: Download,
    what: "Área que empacota contexto e artefatos da Alexandria para uso fora do app, incluindo Claude, ChatGPT, Gemini, Kimi e fluxos locais.",
    impact: "Facilita continuidade de trabalho entre plataformas sem perder contexto, instrução e consistência operacional.",
    connections: "Conecta com skills, pacotes de contexto, GitHub e os ambientes externos de IA que consomem esse material.",
    example: "Monte um pacote para continuar uma tarefa fora do Totum usando a mesma base de instruções e contexto.",
    outcome: "Resultado esperado: a troca entre IAs fica muito mais fluida, com menos retrabalho manual de copiar e explicar.",
  },
];

export default function AlexandriaTutorial() {
  const navigate = useNavigate();
  const [activeId, setActiveId] = useState(tutorialItems[0].id);

  const activeIndex = tutorialItems.findIndex((item) => item.id === activeId);
  const activeItem = tutorialItems[activeIndex];

  const progress = useMemo(
    () => `${activeIndex + 1} de ${tutorialItems.length}`,
    [activeIndex],
  );

  const goToPrevious = () => {
    if (activeIndex > 0) setActiveId(tutorialItems[activeIndex - 1].id);
  };

  const goToNext = () => {
    if (activeIndex < tutorialItems.length - 1) setActiveId(tutorialItems[activeIndex + 1].id);
  };

  return (
    <AppLayout>
      <PageBreadcrumb />
      <div className="space-y-6 p-4 sm:p-6">
        <PageHeader
          eyebrow="Onboarding guiado"
          title="Tutorial Interativo da Alexandria"
          description="Um tour claro e amigável pelas páginas mais importantes da Alexandria, com foco em como cada área ajuda a operação, os agentes e a produtividade do dia a dia."
          icon={Sparkles}
          actions={
            <Button onClick={() => navigate(activeItem.path)} className="gap-2">
              Abrir página atual
              <ArrowRight className="h-4 w-4" />
            </Button>
          }
        />

        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <Card>
            <CardContent className="space-y-4 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[12px] tracking-[-0.01em] text-muted-foreground">Etapa atual</p>
                  <p className="mt-1 font-['SF_Pro_Display','SF_Pro_Icons','Helvetica_Neue',Helvetica,Arial,sans-serif] text-2xl font-semibold tracking-[-0.03em] text-foreground">
                    {progress}
                  </p>
                </div>
                <Badge variant="accent">Tutorial</Badge>
              </div>

              <div className="space-y-2">
                {tutorialItems.map((item, index) => {
                  const selected = item.id === activeId;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveId(item.id)}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-[20px] border p-4 text-left transition-all duration-200",
                        selected
                          ? "border-primary/20 bg-primary/10 shadow-[0_20px_40px_-34px_rgba(0,113,227,0.8)]"
                          : "border-border/80 bg-white hover:bg-secondary/75",
                      )}
                    >
                      <div className={cn(
                        "grid h-10 w-10 shrink-0 place-items-center rounded-full border",
                        selected ? "border-primary/20 bg-white text-primary" : "border-border bg-secondary text-muted-foreground",
                      )}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12px] tracking-[-0.01em] text-muted-foreground">
                          Etapa {index + 1}
                        </p>
                        <p className="mt-1 text-[16px] font-medium tracking-[-0.02em] text-foreground">
                          {item.name}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <DataPanel>
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-border bg-secondary text-primary">
                      <activeItem.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <Badge variant="outline">Página-chave</Badge>
                      <h2 className="mt-3 text-[clamp(2rem,4vw,3.2rem)] font-semibold leading-[1.1] tracking-[-0.03em] text-foreground">
                        {activeItem.name}
                      </h2>
                      <p className="paragraph-lg mt-3 max-w-3xl">{activeItem.what}</p>
                    </div>
                  </div>

                  <Button variant="outline" onClick={() => navigate(activeItem.path)} className="gap-2">
                    Ir para a página
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  <Card hoverGlow={false} className="bg-white">
                    <CardContent className="p-5">
                      <SectionHeader title="Impacto no projeto e produtividade" />
                      <p className="text-sm leading-relaxed text-muted-foreground">{activeItem.impact}</p>
                    </CardContent>
                  </Card>

                  <Card hoverGlow={false} className="bg-white">
                    <CardContent className="p-5">
                      <SectionHeader title="Onde conecta e com quem conversa" />
                      <p className="text-sm leading-relaxed text-muted-foreground">{activeItem.connections}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </DataPanel>

            <div className="grid gap-4 lg:grid-cols-2">
              <DataPanel title="Exemplo de uso">
                <p className="text-sm leading-relaxed text-muted-foreground">{activeItem.example}</p>
              </DataPanel>

              <DataPanel title="Resultado esperado">
                <p className="text-sm leading-relaxed text-muted-foreground">{activeItem.outcome}</p>
              </DataPanel>
            </div>

            <ToolbarTutorial
              onPrevious={goToPrevious}
              onNext={goToNext}
              canPrevious={activeIndex > 0}
              canNext={activeIndex < tutorialItems.length - 1}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function ToolbarTutorial({
  onPrevious,
  onNext,
  canPrevious,
  canNext,
}: {
  onPrevious: () => void;
  onNext: () => void;
  canPrevious: boolean;
  canNext: boolean;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-[24px] border border-border/80 bg-card p-4 shadow-[0_20px_48px_-34px_rgba(29,29,31,0.28)] sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-[12px] tracking-[-0.01em] text-muted-foreground">Navegação do tutorial</p>
        <p className="mt-1 text-sm text-foreground">Avance em ordem ou abra qualquer página direto pela lateral.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button variant="secondary" onClick={onPrevious} disabled={!canPrevious} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Anterior
        </Button>
        <Button onClick={onNext} disabled={!canNext} className="gap-2">
          Próximo
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
