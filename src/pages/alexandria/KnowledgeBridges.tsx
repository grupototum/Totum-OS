import { useMemo, useRef, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { PageBreadcrumb } from "@/components/navigation/PageBreadcrumb";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { PageHeader, DataPanel, EmptyState } from "@/components/ui/patterns";
import {
  analyzeBridgeFiles,
  createBridgeManifestTemplate,
  createBridgeReadmeTemplate,
  importBulmaBridgePackage,
  type AlexandriaBridgePackage,
  type BridgeFileAnalysis,
  type BridgePrivacyZone,
} from "@/services/alexandriaBridge";
import {
  AlertTriangle,
  Brain,
  CheckCircle2,
  Download,
  FileCheck2,
  GitBranch,
  Link2,
  Lock,
  ShieldCheck,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

const zoneStyle: Record<BridgePrivacyZone, string> = {
  green: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700",
  yellow: "border-amber-500/30 bg-amber-500/10 text-amber-700",
  red: "border-destructive/30 bg-destructive/10 text-destructive",
};

const zoneCopy: Record<BridgePrivacyZone, { title: string; description: string }> = {
  green: {
    title: "Verde",
    description: "Pode entrar na Alexandria: Totum, skills, POPs, prompts, decisões e contexto empresarial.",
  },
  yellow: {
    title: "Amarelo",
    description: "Entra só como resumo permitido: preferências, rotina de trabalho e contexto pessoal sanitizado.",
  },
  red: {
    title: "Vermelho",
    description: "Não entra: finanças pessoais, saúde, família, senhas, tokens e journals brutos.",
  },
};

export default function KnowledgeBridges() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [bridgePackage, setBridgePackage] = useState<AlexandriaBridgePackage | null>(null);
  const [isImporting, setIsImporting] = useState(false);

  const score = useMemo(() => {
    if (!bridgePackage?.files.length) return 0;
    return Math.round((bridgePackage.allowedFiles.length / bridgePackage.files.length) * 100);
  }, [bridgePackage]);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;

    const accepted = Array.from(files).filter((file) =>
      /\.(md|markdown|txt|json)$/i.test(file.name)
    );

    if (!accepted.length) {
      toast.error("Envie arquivos Markdown, texto ou JSON.");
      return;
    }

    const contents = await Promise.all(
      accepted.map(async (file) => ({
        name: file.webkitRelativePath || file.name,
        content: await file.text(),
      }))
    );

    const nextPackage = analyzeBridgeFiles(contents);
    setBridgePackage(nextPackage);
    toast.success("Pacote analisado pela ponte da Alexandria.");
  }

  async function handleImport() {
    if (!bridgePackage) return;

    setIsImporting(true);
    try {
      const artifact = await importBulmaBridgePackage(bridgePackage);
      toast.success(`Pacote importado: ${artifact.title}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha ao importar pacote.";
      toast.error(message);
    } finally {
      setIsImporting(false);
    }
  }

  function downloadTemplate(name: string, body: string, type: string) {
    const blob = new Blob([body], { type });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = name;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <AppLayout>
      <PageBreadcrumb />
      <div className="space-y-6 p-4 sm:p-6">
        <PageHeader
          eyebrow="Knowledge Bridges"
          title="Conexões da Alexandria"
          description="Ponte segura entre Bulma/Logseq local e Alexandria. Aqui entram apenas pacotes sanitizados, com rastreio de origem e política clara de privacidade."
          icon={GitBranch}
          actions={
            <>
              <Button variant="outline" onClick={() => inputRef.current?.click()} className="gap-2">
                <Upload className="h-4 w-4" />
                Enviar pacote
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  downloadTemplate("manifest.json", createBridgeManifestTemplate(), "application/json")
                }
                className="gap-2"
              >
                <Download className="h-4 w-4" />
                Manifesto modelo
              </Button>
            </>
          }
        />

        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".md,.markdown,.txt,.json"
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />

        <div className="grid gap-4 lg:grid-cols-3">
          <DataPanel>
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center border border-primary/30 bg-primary/10 text-primary">
                <Brain className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Bulma continua local</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  A Alexandria não acessa o vault inteiro. Ela só recebe exports autorizados pela Bulma/Xavier.
                </p>
              </div>
            </div>
          </DataPanel>

          <DataPanel>
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center border border-emerald-500/30 bg-emerald-500/10 text-emerald-700">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Importação sanitizada</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Verde entra direto. Amarelo entra com cuidado. Vermelho é bloqueado antes de virar fonte.
                </p>
              </div>
            </div>
          </DataPanel>

          <DataPanel>
            <div className="flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center border border-sky-500/30 bg-sky-500/10 text-sky-700">
                <Link2 className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">MCP depois</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Esta tela define contrato, formato e privacidade. O servidor MCP usa a mesma fronteira.
                </p>
              </div>
            </div>
          </DataPanel>
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <Card>
            <CardHeader>
              <CardTitle>Política de fronteira</CardTitle>
              <CardDescription>
                Alexandria é operacional; Bulma é pessoal. A ponte só transporta o que foi permitido.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {(Object.keys(zoneCopy) as BridgePrivacyZone[]).map((zone) => (
                <div key={zone} className="border border-border p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium">{zoneCopy[zone].title}</p>
                    <Badge variant="outline" className={zoneStyle[zone]}>
                      {zone}
                    </Badge>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{zoneCopy[zone].description}</p>
                </div>
              ))}

              <Separator />

              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() =>
                  downloadTemplate(
                    "README-bulma-alexandria.md",
                    createBridgeReadmeTemplate(),
                    "text/markdown"
                  )
                }
              >
                <Download className="h-4 w-4" />
                Baixar checklist da Bulma
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Análise do pacote</CardTitle>
              <CardDescription>
                Envie os arquivos de <span className="font-medium">exports/totum-os</span> para revisar antes da assimilação.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!bridgePackage ? (
                <EmptyState
                  icon={Upload}
                  title="Nenhum pacote analisado"
                  description="Escolha arquivos .md, .txt ou .json exportados pela Bulma. A Alexandria classifica a privacidade antes de salvar."
                  actionLabel="Selecionar arquivos"
                  onAction={() => inputRef.current?.click()}
                />
              ) : (
                <>
                  <div className="flex flex-col gap-3 border border-border bg-muted/40 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium">Pronto para importar</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {bridgePackage.allowedFiles.length} permitido(s), {bridgePackage.blockedFiles.length} bloqueado(s)
                      </p>
                    </div>
                    <div className="min-w-40">
                      <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                        <span>Score seguro</span>
                        <span>{score}%</span>
                      </div>
                      <Progress value={score} />
                    </div>
                  </div>

                  {bridgePackage.blockedFiles.length > 0 && (
                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Arquivos bloqueados não serão importados</AlertTitle>
                      <AlertDescription>
                        A ponte detectou sinais vermelhos. Gere resumo sanitizado na Bulma antes de reenviar.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-3">
                    {bridgePackage.files.map((file) => (
                      <BridgeFileRow key={`${file.name}-${file.zone}`} file={file} />
                    ))}
                  </div>

                  <div className="flex flex-wrap justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={() => inputRef.current?.click()} className="gap-2">
                      <Upload className="h-4 w-4" />
                      Trocar pacote
                    </Button>
                    <Button
                      onClick={handleImport}
                      disabled={isImporting || !bridgePackage.allowedFiles.length}
                      className="gap-2"
                    >
                      <FileCheck2 className="h-4 w-4" />
                      {isImporting ? "Importando..." : "Assimilar na Alexandria"}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
}

function BridgeFileRow({ file }: { file: BridgeFileAnalysis }) {
  const Icon = file.zone === "red" ? Lock : file.zone === "yellow" ? AlertTriangle : CheckCircle2;

  return (
    <div className="border border-border p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className={`grid h-9 w-9 shrink-0 place-items-center border ${zoneStyle[file.zone]}`}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium">{file.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{file.reason}</p>
            <p className="mt-1 text-xs text-muted-foreground">{file.suggestedAction}</p>
          </div>
        </div>
        <Badge variant="outline" className={zoneStyle[file.zone]}>
          {file.label}
        </Badge>
      </div>
    </div>
  );
}
