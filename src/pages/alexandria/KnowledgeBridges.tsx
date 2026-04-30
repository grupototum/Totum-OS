import { useEffect, useMemo, useRef, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { PageBreadcrumb } from "@/components/navigation/PageBreadcrumb";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { PageHeader, DataPanel, EmptyState } from "@/components/ui/patterns";
import { openDirectoryPicker } from "@/lib/directoryPicker";
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
  buildGoogleDriveOAuthUrl,
  buildKnowledgeSyncPreview,
  fetchGoogleDriveSkillFiles,
  getStoredGoogleDriveToken,
  importKnowledgeSyncPreview,
  normalizeGoogleDriveFolderId,
  type KnowledgeSyncPreview,
  type KnowledgeSyncSource,
} from "@/services/alexandriaKnowledgeSync";
import {
  AlertTriangle,
  Brain,
  CheckCircle2,
  Cloud,
  Download,
  FileCheck2,
  FolderOpen,
  GitBranch,
  Link2,
  Lock,
  RefreshCw,
  ShieldCheck,
  Upload,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";

const GOOGLE_DRIVE_FOLDER_STORAGE_KEY = "totum.googleDriveSkillsFolderId";

type SkillImportSummary = {
  importedSkills: number;
  review: number;
  blocked: number;
  artifactTitle: string;
};

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
  const [logseqSkillPreview, setLogseqSkillPreview] = useState<KnowledgeSyncPreview | null>(null);
  const [googleSkillPreview, setGoogleSkillPreview] = useState<KnowledgeSyncPreview | null>(null);
  const [googleFolderId, setGoogleFolderId] = useState(() => localStorage.getItem(GOOGLE_DRIVE_FOLDER_STORAGE_KEY) || "");
  const [googleConnected, setGoogleConnected] = useState(() => !!getStoredGoogleDriveToken());
  const [googleSyncing, setGoogleSyncing] = useState(false);
  const [importingSkillSource, setImportingSkillSource] = useState<KnowledgeSyncSource | null>(null);
  const [logseqImportSummary, setLogseqImportSummary] = useState<SkillImportSummary | null>(null);
  const [googleImportSummary, setGoogleImportSummary] = useState<SkillImportSummary | null>(null);
  const [importSummary, setImportSummary] = useState<{
    imported: number;
    review: BridgeFileAnalysis[];
    blocked: BridgeFileAnalysis[];
    artifactTitle: string;
  } | null>(null);

  const score = useMemo(() => {
    if (!bridgePackage?.files.length) return 0;
    return Math.round((bridgePackage.importableFiles.length / bridgePackage.files.length) * 100);
  }, [bridgePackage]);

  useEffect(() => {
    function handleGoogleDriveAuth(event: MessageEvent) {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type !== "totum-google-drive-auth") return;

      setGoogleConnected(true);
      toast.success("Google Drive conectado à Alexandria.");
    }

    window.addEventListener("message", handleGoogleDriveAuth);
    return () => window.removeEventListener("message", handleGoogleDriveAuth);
  }, []);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;

    const accepted = Array.from(files).filter((file) =>
      /\.(md|markdown|txt|json)$/i.test(file.webkitRelativePath || file.name)
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
    setImportSummary(null);
    toast.success("Pacote analisado pela ponte da Alexandria.");
  }

  async function handleLogseqSkillFiles(files: FileList | null) {
    if (!files?.length) return;

    const accepted = Array.from(files).filter((file) =>
      /\.(md|markdown|txt|json)$/i.test(file.webkitRelativePath || file.name)
    );

    if (!accepted.length) {
      toast.error("Nenhum arquivo de skill compatível foi encontrado.");
      return;
    }

    const contents = await Promise.all(
      accepted.map(async (file) => ({
        name: file.name,
        sourcePath: file.webkitRelativePath || file.name,
        content: await file.text(),
      }))
    );

    const preview = buildKnowledgeSyncPreview("logseq_local", contents);
    setLogseqSkillPreview(preview);
    setLogseqImportSummary(null);
    toast.success(`${preview.skillCandidates.length} skill(s) detectada(s) no Logseq local.`);
  }

  function openFolderPicker() {
    openDirectoryPicker({
      accept: ".md,.markdown,.txt,.json",
      onFiles: (files) => {
        void handleFiles(files);
      },
    });
  }

  function openLogseqSkillPicker() {
    openDirectoryPicker({
      accept: ".md,.markdown,.txt,.json",
      onFiles: (files) => {
        void handleLogseqSkillFiles(files);
      },
    });
  }

  function handleConnectGoogleDrive() {
    try {
      const popup = window.open(
        buildGoogleDriveOAuthUrl(),
        "totum-google-drive-auth",
        "width=540,height=720"
      );

      if (!popup) {
        toast.error("O navegador bloqueou o popup do Google Drive.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível iniciar a conexão com o Google Drive.");
    }
  }

  async function handleGoogleDriveSkillSync() {
    try {
      setGoogleSyncing(true);
      const normalizedFolderId = normalizeGoogleDriveFolderId(googleFolderId);
      localStorage.setItem(GOOGLE_DRIVE_FOLDER_STORAGE_KEY, normalizedFolderId);
      setGoogleFolderId(normalizedFolderId);

      const files = await fetchGoogleDriveSkillFiles(normalizedFolderId);
      const preview = buildKnowledgeSyncPreview("google_drive", files);
      setGoogleSkillPreview(preview);
      setGoogleImportSummary(null);
      toast.success(`${preview.skillCandidates.length} skill(s) detectada(s) no Google Drive.`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Não foi possível sincronizar skills do Google Drive.";
      if (/conecte o google drive/i.test(message)) {
        setGoogleConnected(false);
      }
      toast.error(message);
    } finally {
      setGoogleSyncing(false);
    }
  }

  async function handleImportSkills(
    preview: KnowledgeSyncPreview,
    setSummary: (summary: SkillImportSummary | null) => void
  ) {
    try {
      setImportingSkillSource(preview.source);
      const result = await importKnowledgeSyncPreview(preview);
      setSummary({
        importedSkills: result.importedSkills,
        review: preview.reviewFiles.length,
        blocked: preview.blockedFiles.length,
        artifactTitle: result.artifact.title,
      });
      toast.success(`${result.importedSkills} skill(s) importada(s) para a Alexandria.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Não foi possível importar as skills.");
    } finally {
      setImportingSkillSource(null);
    }
  }

  async function handleImport() {
    if (!bridgePackage) return;

    setIsImporting(true);
    try {
      const artifact = await importBulmaBridgePackage(bridgePackage);
      setImportSummary({
        imported: bridgePackage.importableFiles.length,
        review: bridgePackage.reviewFiles,
        blocked: bridgePackage.blockedFiles,
        artifactTitle: artifact.title,
      });
      toast.success(`${bridgePackage.importableFiles.length} arquivo(s) verde(s) importado(s).`);
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
                Enviar arquivos
              </Button>
              <Button variant="outline" onClick={openFolderPicker} className="gap-2">
                <FolderOpen className="h-4 w-4" />
                Abrir pasta
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

        <div className="grid gap-4 xl:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Sync de skills · Logseq local</CardTitle>
              <CardDescription>
                Escolha uma pasta do vault ou export local. A Alexandria detecta apenas arquivos que parecem skill e importa só os verdes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!logseqSkillPreview ? (
                <EmptyState
                  icon={FolderOpen}
                  title="Nenhuma pasta do Logseq analisada"
                  description="Use este fluxo para começar com skills antes de sincronizar prompts, POPs e contexto geral."
                  actionLabel="Escolher pasta do Logseq"
                  onAction={openLogseqSkillPicker}
                />
              ) : (
                <>
                  <SkillSyncOverview preview={logseqSkillPreview} />
                  {logseqImportSummary ? (
                    <SyncSummaryCard summary={logseqImportSummary} />
                  ) : null}
                  <div className="space-y-3">
                    {logseqSkillPreview.skillCandidates.slice(0, 8).map((file) => (
                      <SkillSyncFileRow key={`${file.name}-${file.sourcePath || ""}`} file={file} />
                    ))}
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button variant="outline" onClick={openLogseqSkillPicker} className="gap-2">
                      <FolderOpen className="h-4 w-4" />
                      Trocar pasta
                    </Button>
                    <Button
                      onClick={() => handleImportSkills(logseqSkillPreview, setLogseqImportSummary)}
                      disabled={!logseqSkillPreview.importableSkills.length || importingSkillSource === "logseq_local"}
                      className="gap-2"
                    >
                      <Wand2 className="h-4 w-4" />
                      {importingSkillSource === "logseq_local" ? "Importando..." : "Sincronizar skills"}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sync de skills · Google Drive</CardTitle>
              <CardDescription>
                Conecte uma pasta canônica do Drive e sincronize somente os arquivos de skill na primeira fase.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={googleConnected ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700" : ""}>
                  {googleConnected ? "Conectado" : "Desconectado"}
                </Badge>
                <Button variant="outline" onClick={handleConnectGoogleDrive} className="gap-2">
                  <Cloud className="h-4 w-4" />
                  {googleConnected ? "Reconectar Drive" : "Conectar Drive"}
                </Button>
              </div>

              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <Input
                  value={googleFolderId}
                  onChange={(event) => setGoogleFolderId(event.target.value)}
                  placeholder="Cole o link ou ID da pasta de skills no Google Drive"
                />
                <Button onClick={handleGoogleDriveSkillSync} disabled={googleSyncing} className="gap-2">
                  <RefreshCw className={`h-4 w-4 ${googleSyncing ? "animate-spin" : ""}`} />
                  {googleSyncing ? "Lendo Drive..." : "Ler pasta"}
                </Button>
              </div>

              {!googleSkillPreview ? (
                <Alert>
                  <Cloud className="h-4 w-4" />
                  <AlertTitle>Drive pronto para skills</AlertTitle>
                  <AlertDescription>
                    Comece apontando a pasta da empresa onde ficam apenas skills ou documentos equivalentes.
                  </AlertDescription>
                </Alert>
              ) : (
                <>
                  <SkillSyncOverview preview={googleSkillPreview} />
                  {googleImportSummary ? (
                    <SyncSummaryCard summary={googleImportSummary} />
                  ) : null}
                  <div className="space-y-3">
                    {googleSkillPreview.skillCandidates.slice(0, 8).map((file) => (
                      <SkillSyncFileRow key={`${file.name}-${file.externalId || ""}`} file={file} />
                    ))}
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button
                      onClick={() => handleImportSkills(googleSkillPreview, setGoogleImportSummary)}
                      disabled={!googleSkillPreview.importableSkills.length || importingSkillSource === "google_drive"}
                      className="gap-2"
                    >
                      <Wand2 className="h-4 w-4" />
                      {importingSkillSource === "google_drive" ? "Importando..." : "Sincronizar skills"}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
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
                  description="Escolha arquivos ou uma pasta exportada pela Bulma. A Alexandria lê .md, .txt e .json, preserva os caminhos da pasta e classifica a privacidade antes de salvar."
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
                      <p className="mt-1 text-xs text-muted-foreground">
                        A assimilação automática importa apenas os {bridgePackage.importableFiles.length} verde(s). {bridgePackage.reviewFiles.length} amarelo(s) ficam para revisão.
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

                  {bridgePackage.reviewFiles.length > 0 && (
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>Arquivos amarelos ficarão fora da importação automática</AlertTitle>
                      <AlertDescription>
                        A ponte encontrou {bridgePackage.reviewFiles.length} arquivo(s) que precisam de revisão ou resumo sanitizado antes de entrar na Alexandria.
                      </AlertDescription>
                    </Alert>
                  )}

                  {importSummary && (
                    <div className="space-y-3 border border-emerald-500/30 bg-emerald-500/10 p-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-700" />
                        <div>
                          <p className="font-semibold text-emerald-800">Assimilação concluída</p>
                          <p className="mt-1 text-sm text-emerald-800">
                            {importSummary.imported} arquivo(s) verde(s) importado(s) em {importSummary.artifactTitle}.
                          </p>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {importSummary.review.length} amarelo(s) e {importSummary.blocked.length} vermelho(s) não foram importados e continuam no Mac/Bulma.
                          </p>
                        </div>
                      </div>

                      {(importSummary.review.length > 0 || importSummary.blocked.length > 0) && (
                        <div className="max-h-44 overflow-y-auto border border-border bg-background/70 p-3">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Não importados
                          </p>
                          {[...importSummary.review, ...importSummary.blocked].map((file) => (
                            <div key={`${file.name}-${file.zone}`} className="mb-2 last:mb-0">
                              <p className="truncate text-sm font-medium">{file.name}</p>
                              <p className="text-xs text-muted-foreground">{file.label}: {file.reason}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-3">
                    {bridgePackage.files.map((file) => (
                      <BridgeFileRow key={`${file.name}-${file.zone}`} file={file} />
                    ))}
                  </div>

                  <div className="flex flex-wrap justify-end gap-2 pt-2">
                    <Button variant="outline" onClick={() => inputRef.current?.click()} className="gap-2">
                      <Upload className="h-4 w-4" />
                      Trocar arquivos
                    </Button>
                    <Button variant="outline" onClick={openFolderPicker} className="gap-2">
                      <FolderOpen className="h-4 w-4" />
                      Trocar pasta
                    </Button>
                    <Button
                      onClick={handleImport}
                      disabled={isImporting || !bridgePackage.importableFiles.length}
                      className="gap-2"
                    >
                      <FileCheck2 className="h-4 w-4" />
                      {isImporting ? "Importando..." : "Assimilar apenas o permitido"}
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

function SkillSyncOverview({ preview }: { preview: KnowledgeSyncPreview }) {
  return (
    <div className="grid gap-3 sm:grid-cols-4">
      <DataPanel>
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Arquivos lidos</p>
        <p className="mt-2 text-2xl font-semibold">{preview.files.length}</p>
      </DataPanel>
      <DataPanel>
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Skills detectadas</p>
        <p className="mt-2 text-2xl font-semibold">{preview.skillCandidates.length}</p>
      </DataPanel>
      <DataPanel>
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Verdes</p>
        <p className="mt-2 text-2xl font-semibold text-emerald-700">{preview.importableSkills.length}</p>
      </DataPanel>
      <DataPanel>
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-muted-foreground">Revisão/Bloqueio</p>
        <p className="mt-2 text-2xl font-semibold text-amber-700">
          {preview.reviewFiles.length + preview.blockedFiles.length}
        </p>
      </DataPanel>
    </div>
  );
}

function SyncSummaryCard({ summary }: { summary: SkillImportSummary }) {
  return (
    <div className="space-y-3 border border-emerald-500/30 bg-emerald-500/10 p-4">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-700" />
        <div>
          <p className="font-semibold text-emerald-800">Sincronização concluída</p>
          <p className="mt-1 text-sm text-emerald-800">
            {summary.importedSkills} skill(s) importada(s) em {summary.artifactTitle}.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {summary.review} em revisão e {summary.blocked} bloqueada(s) ficaram fora desta rodada.
          </p>
        </div>
      </div>
    </div>
  );
}

function SkillSyncFileRow({ file }: { file: KnowledgeSyncPreview["files"][number] }) {
  const Icon = file.zone === "red" ? Lock : file.zone === "yellow" ? AlertTriangle : CheckCircle2;

  return (
    <div className="border border-border p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <div className={`grid h-9 w-9 shrink-0 place-items-center border ${zoneStyle[file.zone]}`}>
            <Icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium">{file.sourcePath || file.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{file.skillReason}</p>
            <p className="mt-1 text-xs text-muted-foreground">{file.zoneReason}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={zoneStyle[file.zone]}>
            {file.zoneLabel}
          </Badge>
          <Badge variant={file.isSkillCandidate ? "default" : "outline"}>
            {file.isSkillCandidate ? "Skill" : "Fora do escopo"}
          </Badge>
        </div>
      </div>
    </div>
  );
}
