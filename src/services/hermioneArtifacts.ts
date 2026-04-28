import { supabase } from "@/integrations/supabase/client";

export type HermioneArtifactType =
  | "skill"
  | "pop"
  | "prompt"
  | "decision"
  | "summary"
  | "document"
  | "context_pack";

export type HermioneArtifactStatus = "draft" | "review" | "approved" | "deprecated" | "superseded";

export interface HermioneSourceInput {
  name: string;
  content: string;
  origin?: string;
  author?: string;
}

export interface SanitizedHermioneSourceInput extends HermioneSourceInput {
  originalContent: string;
  contentHash: string;
  sanitizationWarnings: string[];
  privacyZone: "green" | "yellow" | "red";
  privacyReason: string;
}

export interface HermioneSource {
  id: string;
  title: string;
  file_name: string;
  source_type: string;
  origin: string | null;
  author: string | null;
  content: string;
  content_hash: string;
  detected_type: HermioneArtifactType;
  tags: string[];
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface HermioneArtifact {
  id: string;
  title: string;
  artifact_type: HermioneArtifactType;
  status: HermioneArtifactStatus;
  scope: string;
  content: string;
  summary: string;
  tags: string[];
  metadata: Record<string, unknown>;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface HermioneSourceAnalysis {
  name: string;
  detectedType: HermioneArtifactType;
  title: string;
  headings: string[];
  tags: string[];
  keywords: string[];
  keyIdeas: string[];
  risks: string[];
  gaps: string[];
  conflicts: string[];
  recommendedOutput: HermioneArtifactType;
}

export interface HermioneConsolidation {
  title: string;
  artifactType: HermioneArtifactType;
  summary: string;
  tags: string[];
  analysis: HermioneSourceAnalysis[];
  content: string;
  conflicts: string[];
  gaps: string[];
}

export interface HermioneDuplicateMatch {
  name: string;
  match: string;
  reason: string;
  severity: "exact" | "near";
}

export interface HermioneConflictReport {
  topic: string;
  severity: "medium" | "high";
  sources: string[];
  recommendation: string;
}

export interface HermioneAssimilationPreview {
  generatedAt: string;
  files: SanitizedHermioneSourceInput[];
  allowedFiles: SanitizedHermioneSourceInput[];
  blockedFiles: SanitizedHermioneSourceInput[];
  analyses: HermioneSourceAnalysis[];
  exactDuplicates: HermioneDuplicateMatch[];
  nearDuplicates: HermioneDuplicateMatch[];
  conflicts: HermioneConflictReport[];
  gaps: string[];
  relatedArtifacts: HermioneArtifact[];
  recommendedStatus: HermioneArtifactStatus;
  recommendedArtifactType: HermioneArtifactType;
  reportMarkdown: string;
}

const STOP_WORDS = new Set([
  "para",
  "com",
  "uma",
  "que",
  "dos",
  "das",
  "como",
  "mais",
  "isso",
  "essa",
  "esse",
  "pela",
  "pelo",
  "the",
  "and",
  "with",
  "from",
  "this",
  "that",
  "your",
  "about",
  "into",
]);

const SENSITIVE_SIGNALS = [
  "senha",
  "password",
  "token:",
  "access token",
  "bearer ",
  "api_key",
  "secret",
  "service_role",
  "cpf",
  "cartao",
  "cartão",
  "dados banc",
];

export async function hashContent(content: string): Promise<string> {
  if (globalThis.crypto?.subtle) {
    const bytes = new TextEncoder().encode(content);
    const digest = await globalThis.crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  let hash = 0;
  for (let i = 0; i < content.length; i += 1) {
    hash = (hash << 5) - hash + content.charCodeAt(i);
    hash |= 0;
  }
  return `fallback-${Math.abs(hash)}`;
}

export async function sanitizeSourceInput(file: HermioneSourceInput): Promise<SanitizedHermioneSourceInput> {
  const normalizedLineEndings = file.content.replace(/\r\n?/g, "\n");
  const warnings: string[] = [];
  let content = removeUnsafeControlCharacters(normalizedLineEndings, warnings);

  if (content !== file.content) warnings.push("Conteúdo normalizado antes de salvar.");
  content = content.normalize("NFC");

  const privacy = detectPrivacyZone(file.name, content);

  return {
    ...file,
    content,
    originalContent: file.content,
    contentHash: await hashContent(content),
    sanitizationWarnings: unique(warnings),
    privacyZone: privacy.privacyZone,
    privacyReason: privacy.reason,
  };
}

function removeUnsafeControlCharacters(content: string, warnings: string[]): string {
  let output = "";
  for (const char of content) {
    const code = char.charCodeAt(0);
    const isUnsafeControl = (code < 32 && code !== 9 && code !== 10 && code !== 13) || code === 127;
    if (isUnsafeControl) {
      warnings.push(`Caractere de controle removido: U+${code.toString(16).padStart(4, "0")}`);
      continue;
    }
    output += char;
  }
  return output;
}

export async function simulateAssimilation(files: HermioneSourceInput[]): Promise<HermioneAssimilationPreview> {
  const sanitizedFiles = await Promise.all(files.map(sanitizeSourceInput));
  const allowedFiles = sanitizedFiles.filter((file) => file.privacyZone !== "red");
  const blockedFiles = sanitizedFiles.filter((file) => file.privacyZone === "red");
  const analyses = allowedFiles.map((file) => analyzeSourceContent(file.name, file.content));
  const existingSources = await findExistingSources(allowedFiles);
  const relatedArtifacts = await findRelatedArtifacts(analyses);
  const exactDuplicates = findExactDuplicates(allowedFiles, existingSources);
  const nearDuplicates = findNearDuplicates(analyses, relatedArtifacts, allowedFiles, exactDuplicates);
  const conflicts = findAssimilationConflicts(analyses, relatedArtifacts);
  const gaps = unique(analyses.flatMap((analysis) => analysis.gaps)).slice(0, 12);
  const recommendedArtifactType = chooseArtifactType(analyses.length ? analyses : [{ recommendedOutput: "document" } as HermioneSourceAnalysis]);
  const recommendedStatus: HermioneArtifactStatus =
    blockedFiles.length || conflicts.some((conflict) => conflict.severity === "high") || nearDuplicates.length
      ? "review"
      : "draft";

  const previewBase = {
    generatedAt: new Date().toISOString(),
    files: sanitizedFiles,
    allowedFiles,
    blockedFiles,
    analyses,
    exactDuplicates,
    nearDuplicates,
    conflicts,
    gaps,
    relatedArtifacts,
    recommendedStatus,
    recommendedArtifactType,
  };

  return {
    ...previewBase,
    reportMarkdown: renderAssimilationReport(previewBase),
  };
}

export function analyzeSourceContent(name: string, content: string): HermioneSourceAnalysis {
  const headings = extractHeadings(content);
  const keywords = getTopKeywords(`${name} ${content}`).slice(0, 12);
  const detectedType = detectArtifactType(name, content);
  const keyIdeas = extractKeyIdeas(content);
  const conflicts = extractLines(content, [
    "conflito",
    "contradi",
    "diverg",
    "versus",
    " vs ",
    "não usar",
    "evitar",
    "problema",
  ]);
  const risks = extractLines(content, ["risco", "cuidado", "atenção", "falha", "erro", "bloqueio"]);
  const gaps = detectGaps(content, detectedType);
  const tags = Array.from(new Set([detectedType, ...keywords.slice(0, 6)])).slice(0, 8);

  return {
    name,
    detectedType,
    title: headings[0] || titleFromFilename(name),
    headings,
    tags,
    keywords,
    keyIdeas,
    risks,
    gaps,
    conflicts,
    recommendedOutput: detectedType === "document" ? inferRecommendedOutput(content) : detectedType,
  };
}

export async function createSources(files: HermioneSourceInput[]): Promise<HermioneSource[]> {
  const sanitizedFiles = await Promise.all(files.map(sanitizeSourceInput));
  const allowedFiles = sanitizedFiles.filter((file) => file.privacyZone !== "red");
  const rowsByHash = new Map<string, Record<string, unknown>>();

  for (const file of allowedFiles) {
      const analysis = analyzeSourceContent(file.name, file.content);
      if (rowsByHash.has(file.contentHash)) continue;
      rowsByHash.set(file.contentHash, {
        title: analysis.title,
        file_name: file.name,
        source_type: file.name.toLowerCase().match(/\.(md|markdown)$/) ? "markdown" : "text",
        origin: file.origin || "upload",
        author: file.author || inferAuthor(file.name, file.content),
        content: file.content,
        content_hash: file.contentHash,
        detected_type: analysis.detectedType,
        tags: analysis.tags,
        metadata: {
          headings: analysis.headings,
          keywords: analysis.keywords,
          keyIdeas: analysis.keyIdeas,
          risks: analysis.risks,
          gaps: analysis.gaps,
          conflicts: analysis.conflicts,
          recommendedOutput: analysis.recommendedOutput,
          originalName: file.name,
          privacyZone: file.privacyZone,
          privacyReason: file.privacyReason,
          sanitizationWarnings: file.sanitizationWarnings,
        },
      });
  }

  const rows = Array.from(rowsByHash.values());

  if (!rows.length) return [];

  const { data, error } = await (supabase as any)
    .from("hermione_sources")
    .upsert(rows, { onConflict: "content_hash" })
    .select("*");

  if (error) throw new Error(`Não consegui salvar as fontes da Hermione: ${error.message}`);
  return (data || []) as HermioneSource[];
}

export async function assimilatePreview(preview: HermioneAssimilationPreview): Promise<{
  sources: HermioneSource[];
  artifact: HermioneArtifact;
}> {
  if (!preview.allowedFiles.length) {
    throw new Error("Nenhum arquivo permitido para assimilar na Alexandria.");
  }

  const files = preview.allowedFiles
    .filter((file) => !preview.exactDuplicates.some((duplicate) => duplicate.name === file.name))
    .map(({ name, content, origin, author }) => ({ name, content, origin, author }));

  const filesToSave = files.length ? files : preview.allowedFiles.map(({ name, content, origin, author }) => ({ name, content, origin, author }));
  const sources = await createSources(filesToSave);
  const artifact = await createArtifactFromSources(filesToSave, {
    sourceIds: sources.map((source) => source.id),
    type: preview.recommendedArtifactType,
    status: preview.recommendedStatus,
    changeNote: "Assimilação após simulação da Hermione",
    metadata: {
      assimilationPreview: {
        generatedAt: preview.generatedAt,
        exactDuplicates: preview.exactDuplicates,
        nearDuplicates: preview.nearDuplicates,
        conflicts: preview.conflicts,
        blockedFiles: preview.blockedFiles.map((file) => ({ name: file.name, reason: file.privacyReason })),
        relatedArtifacts: preview.relatedArtifacts.map((artifact) => ({
          id: artifact.id,
          title: artifact.title,
          status: artifact.status,
          artifact_type: artifact.artifact_type,
        })),
      },
      assimilationReport: preview.reportMarkdown,
    },
  });

  await logConsultation({
    query: `Relatório de assimilação: ${preview.allowedFiles.map((file) => file.name).join(", ")}`,
    response: preview.reportMarkdown,
    sourceIds: sources.map((source) => source.id),
    artifactIds: [artifact.id],
    metadata: {
      exactDuplicates: preview.exactDuplicates.length,
      nearDuplicates: preview.nearDuplicates.length,
      conflicts: preview.conflicts.length,
      blockedFiles: preview.blockedFiles.length,
    },
  });

  return { sources, artifact };
}

export function downloadAssimilationReport(
  preview: HermioneAssimilationPreview,
  format: "markdown" | "json" = "markdown"
) {
  const body = format === "json" ? JSON.stringify(preview, null, 2) : preview.reportMarkdown;
  const type = format === "json" ? "application/json" : "text/markdown";
  const extension = format === "json" ? "json" : "md";
  downloadBlob(body, `relatorio-assimilacao-hermione.${extension}`, type);
}

export function consolidateSourceInputs(files: HermioneSourceInput[]): HermioneConsolidation {
  const analysis = files.map((file) => analyzeSourceContent(file.name, file.content));
  const artifactType = chooseArtifactType(analysis);
  const title = chooseTitle(analysis, artifactType);
  const conflicts = unique(analysis.flatMap((item) => item.conflicts)).slice(0, 8);
  const gaps = unique(analysis.flatMap((item) => item.gaps)).slice(0, 8);
  const tags = unique(analysis.flatMap((item) => item.tags)).slice(0, 12);
  const summary = buildSummary(analysis, artifactType, files.length);
  const content = renderConsolidatedMarkdown({
    title,
    artifactType,
    summary,
    tags,
    analysis,
    conflicts,
    gaps,
    files,
  });

  return { title, artifactType, summary, tags, analysis, content, conflicts, gaps };
}

export async function createArtifactFromSources(
  files: HermioneSourceInput[],
  options: {
    sourceIds?: string[];
    type?: HermioneArtifactType;
    status?: HermioneArtifactStatus;
    scope?: string;
    metadata?: Record<string, unknown>;
    changeNote?: string;
  } = {}
): Promise<HermioneArtifact> {
  const consolidation = consolidateSourceInputs(files);
  const artifactType = options.type || consolidation.artifactType;

  const artifactPayload = {
    title: consolidation.title,
    artifact_type: artifactType,
    status: options.status || "draft",
    scope: options.scope || "totum",
    content: artifactType === consolidation.artifactType
      ? consolidation.content
      : convertConsolidationToType(consolidation, artifactType),
    summary: consolidation.summary,
    tags: consolidation.tags,
    metadata: {
      sourceCount: files.length,
      conflicts: consolidation.conflicts,
      gaps: consolidation.gaps,
      analyses: consolidation.analysis,
      ...(options.metadata || {}),
    },
    version: 1,
  };

  const { data, error } = await (supabase as any)
    .from("hermione_artifacts")
    .insert(artifactPayload)
    .select("*")
    .single();

  if (error) throw new Error(`Não consegui criar o artefato da Hermione: ${error.message}`);

  await (supabase as any).from("hermione_artifact_versions").insert({
    artifact_id: data.id,
    version: 1,
    content: artifactPayload.content,
    change_note: options.changeNote || "Criação a partir do chat consultivo da Hermione",
    metadata: artifactPayload.metadata,
  });

  if (options.sourceIds?.length) {
    await (supabase as any).from("hermione_artifact_sources").insert(
      options.sourceIds.map((sourceId) => ({
        artifact_id: data.id,
        source_id: sourceId,
        contribution_type: "source",
      }))
    );
  }

  return data as HermioneArtifact;
}

export async function searchArtifacts(query = "", limit = 12): Promise<HermioneArtifact[]> {
  let builder = (supabase as any)
    .from("hermione_artifacts")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(limit);

  if (query.trim()) {
    const safeQuery = query.trim().replace(/[,%]/g, "");
    builder = builder.or(`title.ilike.%${safeQuery}%,summary.ilike.%${safeQuery}%,content.ilike.%${safeQuery}%`);
  }

  const { data, error } = await builder;
  if (error) {
    console.warn("Hermione artifacts unavailable:", error.message);
    return [];
  }

  return (data || []) as HermioneArtifact[];
}

export async function logConsultation(input: {
  query: string;
  response?: string;
  sourceIds?: string[];
  artifactIds?: string[];
  metadata?: Record<string, unknown>;
}) {
  await (supabase as any).from("hermione_consultations").insert({
    query: input.query,
    response: input.response || null,
    source_ids: input.sourceIds || [],
    artifact_ids: input.artifactIds || [],
    metadata: input.metadata || {},
  });
}

export function downloadArtifact(artifact: HermioneArtifact, format: "markdown" | "json" = "markdown") {
  const body = format === "json" ? JSON.stringify(artifact, null, 2) : artifact.content;
  const type = format === "json" ? "application/json" : "text/markdown";
  const extension = format === "json" ? "json" : "md";
  downloadBlob(body, `${slugify(artifact.title)}.${extension}`, type);
}

function downloadBlob(body: string, name: string, type: string) {
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

function detectPrivacyZone(name: string, content: string): Pick<SanitizedHermioneSourceInput, "privacyZone" | "privacyReason"> {
  const text = `${name}\n${content}`.toLowerCase();
  const signal = SENSITIVE_SIGNALS.find((item) => text.includes(item));
  if (signal) {
    return {
      privacyZone: "red",
      privacyReason: `Sinal sensível detectado: ${signal}.`,
    };
  }

  if (/pessoal|rotina|prefer[eê]ncia|logseq|journal|di[aá]rio/i.test(text)) {
    return {
      privacyZone: "yellow",
      privacyReason: "Contexto pessoal/operacional permitido somente com revisão.",
    };
  }

  return {
    privacyZone: "green",
    privacyReason: "Nenhum sinal sensível conhecido detectado.",
  };
}

async function findExistingSources(files: SanitizedHermioneSourceInput[]): Promise<HermioneSource[]> {
  const hashes = unique(files.map((file) => file.contentHash));
  if (!hashes.length) return [];

  const { data, error } = await (supabase as any)
    .from("hermione_sources")
    .select("*")
    .in("content_hash", hashes);

  if (error) {
    console.warn("Hermione sources unavailable for preview:", error.message);
    return [];
  }

  return (data || []) as HermioneSource[];
}

async function findRelatedArtifacts(analyses: HermioneSourceAnalysis[]): Promise<HermioneArtifact[]> {
  const query = unique(analyses.flatMap((analysis) => [analysis.title, ...analysis.tags])).slice(0, 6);
  if (!query.length) return searchArtifacts("", 8);

  const related = await Promise.all(query.map((item) => searchArtifacts(item, 4)));
  const byId = new Map<string, HermioneArtifact>();
  related.flat().forEach((artifact) => byId.set(artifact.id, artifact));
  return Array.from(byId.values()).slice(0, 10);
}

function findExactDuplicates(
  files: SanitizedHermioneSourceInput[],
  existingSources: HermioneSource[]
): HermioneDuplicateMatch[] {
  const matches: HermioneDuplicateMatch[] = [];
  const seen = new Map<string, string>();
  const existingByHash = new Map(existingSources.map((source) => [source.content_hash, source]));

  files.forEach((file) => {
    const existing = existingByHash.get(file.contentHash);
    if (existing) {
      matches.push({
        name: file.name,
        match: existing.file_name,
        severity: "exact",
        reason: "Mesmo hash de uma fonte já catalogada na Alexandria.",
      });
      return;
    }

    const previous = seen.get(file.contentHash);
    if (previous) {
      matches.push({
        name: file.name,
        match: previous,
        severity: "exact",
        reason: "Mesmo hash de outro arquivo selecionado nesta assimilação.",
      });
      return;
    }

    seen.set(file.contentHash, file.name);
  });

  return matches;
}

function findNearDuplicates(
  analyses: HermioneSourceAnalysis[],
  relatedArtifacts: HermioneArtifact[],
  files: SanitizedHermioneSourceInput[],
  exactDuplicates: HermioneDuplicateMatch[]
): HermioneDuplicateMatch[] {
  const exactNames = new Set(exactDuplicates.map((item) => item.name));
  const matches: HermioneDuplicateMatch[] = [];

  analyses.forEach((analysis, index) => {
    const source = files[index];
    if (!source || exactNames.has(source.name)) return;

    const candidate = relatedArtifacts.find((artifact) => {
      const sharedTags = analysis.tags.filter((tag) => artifact.tags?.includes(tag)).length;
      return sharedTags >= 2 || similarText(analysis.title, artifact.title) >= 0.65;
    });

    if (candidate) {
      matches.push({
        name: source.name,
        match: candidate.title,
        severity: "near",
        reason: `Tema parecido com artefato existente (${candidate.status}/${candidate.artifact_type}).`,
      });
    }
  });

  return matches;
}

function findAssimilationConflicts(
  analyses: HermioneSourceAnalysis[],
  relatedArtifacts: HermioneArtifact[]
): HermioneConflictReport[] {
  const explicitConflicts = analyses
    .filter((analysis) => analysis.conflicts.length > 0)
    .map((analysis) => ({
      topic: analysis.title,
      severity: "high" as const,
      sources: [analysis.name],
      recommendation: "Manter em revisão humana antes de aprovar ou substituir conhecimento existente.",
    }));

  const approvedRelated = relatedArtifacts.filter((artifact) => artifact.status === "approved");
  const updateAgainstApproved = analyses
    .filter((analysis) => approvedRelated.some((artifact) => similarText(analysis.title, artifact.title) >= 0.65))
    .map((analysis) => ({
      topic: `Possível atualização de conhecimento aprovado: ${analysis.title}`,
      severity: "medium" as const,
      sources: [analysis.name, ...approvedRelated.map((artifact) => artifact.title).slice(0, 2)],
      recommendation: "Não sobrescrever automaticamente. Gerar nova versão em review e pedir aprovação.",
    }));

  return uniqueBy([...explicitConflicts, ...updateAgainstApproved], (item) => `${item.topic}-${item.sources.join(",")}`).slice(0, 12);
}

function renderAssimilationReport(input: Omit<HermioneAssimilationPreview, "reportMarkdown">): string {
  const sourceLines = input.allowedFiles
    .map((file) => `- **${file.name}**: ${file.privacyZone}; hash \`${file.contentHash.slice(0, 12)}\`; ${file.privacyReason}`)
    .join("\n") || "- Nenhuma fonte permitida.";
  const blockedLines = input.blockedFiles
    .map((file) => `- **${file.name}**: ${file.privacyReason}`)
    .join("\n") || "- Nenhuma fonte bloqueada.";
  const exactLines = input.exactDuplicates
    .map((item) => `- **${item.name}** duplica **${item.match}**: ${item.reason}`)
    .join("\n") || "- Nenhuma duplicata exata encontrada.";
  const nearLines = input.nearDuplicates
    .map((item) => `- **${item.name}** parece relacionado a **${item.match}**: ${item.reason}`)
    .join("\n") || "- Nenhuma duplicata próxima relevante encontrada.";
  const conflictLines = input.conflicts
    .map((item) => `- **${item.topic}** (${item.severity}): ${item.recommendation} Fontes: ${item.sources.join(", ")}`)
    .join("\n") || "- Nenhum conflito crítico detectado.";
  const relatedLines = input.relatedArtifacts
    .map((artifact) => `- **${artifact.title}**: ${artifact.status}/${artifact.artifact_type}`)
    .join("\n") || "- Nenhum artefato relacionado encontrado.";
  const gaps = input.gaps.map((gap) => `- ${gap}`).join("\n") || "- Nenhuma lacuna crítica detectada.";

  return `# Relatório de Assimilação Hermione

Gerado em: ${input.generatedAt}

## Resumo

- Arquivos analisados: ${input.files.length}
- Fontes permitidas: ${input.allowedFiles.length}
- Fontes bloqueadas: ${input.blockedFiles.length}
- Duplicatas exatas: ${input.exactDuplicates.length}
- Duplicatas próximas: ${input.nearDuplicates.length}
- Conflitos: ${input.conflicts.length}
- Artefato recomendado: ${input.recommendedArtifactType}
- Status recomendado: ${input.recommendedStatus}

## Fontes Permitidas

${sourceLines}

## Fontes Bloqueadas

${blockedLines}

## Conhecimento Existente Relacionado

${relatedLines}

## Duplicatas Exatas

${exactLines}

## Duplicatas Próximas

${nearLines}

## Conflitos

${conflictLines}

## Lacunas

${gaps}

## Recomendações da Hermione

- Não sobrescrever conhecimento aprovado automaticamente.
- Usar autoridade/status antes de data; data serve como desempate.
- Criar ou atualizar artefato em revisão quando houver conflito, duplicata próxima ou fonte amarela.
- Preservar todas as fontes e decisões de síntese para rastreabilidade.
`;
}

function similarText(a: string, b: string): number {
  const left = new Set(getTopKeywords(a).slice(0, 8));
  const right = new Set(getTopKeywords(b).slice(0, 8));
  if (!left.size || !right.size) return 0;
  const intersection = Array.from(left).filter((item) => right.has(item)).length;
  return intersection / Math.max(left.size, right.size);
}

function uniqueBy<T>(items: T[], keyFn: (item: T) => string): T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function detectArtifactType(name: string, content: string): HermioneArtifactType {
  const text = `${name} ${content}`.toLowerCase();
  if (text.includes("skill.md") || text.includes("quando usar") || text.includes("entrada") && text.includes("saída")) return "skill";
  if (text.includes("pop-") || text.includes("procedimento operacional") || text.includes("sla")) return "pop";
  if (text.includes("system prompt") || text.includes("prompt") || text.includes("instruções do agente")) return "prompt";
  if (text.includes("decisão") || text.includes("adr") || text.includes("decision record")) return "decision";
  if (text.includes("contexto") || text.includes("context pack") || text.includes("memória")) return "context_pack";
  if (text.includes("resumo") || text.includes("summary")) return "summary";
  return "document";
}

function inferRecommendedOutput(content: string): HermioneArtifactType {
  const text = content.toLowerCase();
  if (text.includes("passo") || text.includes("checklist")) return "pop";
  if (text.includes("habilidade") || text.includes("capability") || text.includes("workflow")) return "skill";
  if (text.includes("decidir") || text.includes("tradeoff")) return "decision";
  return "document";
}

function extractHeadings(content: string): string[] {
  return content
    .split("\n")
    .map((line) => line.match(/^#{1,4}\s+(.+)$/)?.[1]?.trim())
    .filter(Boolean)
    .slice(0, 12) as string[];
}

function extractKeyIdeas(content: string): string[] {
  const candidates = content
    .split(/\n+/)
    .map((line) => line.replace(/^[-*]\s+/, "").trim())
    .filter((line) => line.length >= 48 && line.length <= 220)
    .filter((line) => /deve|precisa|permite|central|skill|contexto|agente|documento|conhecimento|gerar|unificar|analisar/i.test(line));

  return unique(candidates).slice(0, 8);
}

function extractLines(content: string, needles: string[]): string[] {
  return unique(
    content
      .split(/\n+/)
      .map((line) => line.replace(/^[-*]\s+/, "").trim())
      .filter((line) => line.length > 20)
      .filter((line) => needles.some((needle) => line.toLowerCase().includes(needle)))
  ).slice(0, 6);
}

function detectGaps(content: string, type: HermioneArtifactType): string[] {
  const text = content.toLowerCase();
  const gaps: string[] = [];
  if (!text.includes("fonte") && !text.includes("source")) gaps.push("Fonte/origem pouco explícita.");
  if (!text.includes("exemplo")) gaps.push("Faltam exemplos de uso.");
  if (type === "skill" && !text.includes("entrada")) gaps.push("Skill sem schema claro de entrada.");
  if (type === "skill" && !text.includes("saída")) gaps.push("Skill sem schema claro de saída.");
  if ((type === "pop" || type === "decision") && !text.includes("status")) gaps.push("Status editorial não definido.");
  return gaps;
}

function getTopKeywords(text: string): string[] {
  const freq: Record<string, number> = {};
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .forEach((word) => {
      if (word.length > 3 && !STOP_WORDS.has(word)) freq[word] = (freq[word] || 0) + 1;
    });

  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .map(([word]) => word);
}

function chooseArtifactType(analysis: HermioneSourceAnalysis[]): HermioneArtifactType {
  const votes = analysis.map((item) => item.recommendedOutput);
  const counts = votes.reduce<Record<string, number>>((acc, type) => {
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});
  return (Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "document") as HermioneArtifactType;
}

function chooseTitle(analysis: HermioneSourceAnalysis[], artifactType: HermioneArtifactType): string {
  const firstMeaningful = analysis.find((item) => item.title && item.title.length > 3)?.title;
  const prefix: Record<HermioneArtifactType, string> = {
    skill: "Skill consolidada",
    pop: "POP consolidado",
    prompt: "Prompt consolidado",
    decision: "Decisão consolidada",
    summary: "Resumo consolidado",
    document: "Documento consolidado",
    context_pack: "Pacote de contexto consolidado",
  };
  return firstMeaningful ? `${prefix[artifactType]}: ${firstMeaningful}` : prefix[artifactType];
}

function buildSummary(analysis: HermioneSourceAnalysis[], artifactType: HermioneArtifactType, sourceCount: number): string {
  const commonTags = unique(analysis.flatMap((item) => item.tags)).slice(0, 5).join(", ");
  return `Hermione analisou ${sourceCount} fonte${sourceCount === 1 ? "" : "s"} e recomenda gerar um artefato do tipo ${artifactType}. Temas principais: ${commonTags || "conhecimento geral"}.`;
}

function renderConsolidatedMarkdown(input: {
  title: string;
  artifactType: HermioneArtifactType;
  summary: string;
  tags: string[];
  analysis: HermioneSourceAnalysis[];
  conflicts: string[];
  gaps: string[];
  files: HermioneSourceInput[];
}): string {
  const keyIdeas = unique(input.analysis.flatMap((item) => item.keyIdeas)).slice(0, 12);
  const sourceList = input.analysis
    .map((item, index) => `- ${index + 1}. **${item.name}**: ${item.detectedType}; ${item.keywords.slice(0, 5).join(", ")}`)
    .join("\n");

  return `# ${input.title}

> Artefato criado pela Hermione a partir do chat consultivo da Alexandria.

## Resumo

${input.summary}

## Síntese Consolidada

${keyIdeas.length ? keyIdeas.map((idea) => `- ${idea}`).join("\n") : "- O material foi consolidado em uma base única, pronta para curadoria e uso por agentes."}

## Recomendação da Hermione

- Tipo recomendado: **${input.artifactType}**
- Status inicial: **draft**
- Próximo passo: revisar, aprovar e publicar na biblioteca da Alexandria.

## Divergências Encontradas

${input.conflicts.length ? input.conflicts.map((item) => `- ${item}`).join("\n") : "- Nenhuma divergência explícita encontrada nos documentos enviados."}

## Lacunas

${input.gaps.length ? input.gaps.map((item) => `- ${item}`).join("\n") : "- Nenhuma lacuna crítica detectada nesta primeira análise."}

## Fontes

${sourceList}

## Tags

${input.tags.map((tag) => `\`${tag}\``).join(" ")}
`;
}

function convertConsolidationToType(
  consolidation: HermioneConsolidation,
  targetType: HermioneArtifactType
): string {
  if (targetType === "skill") {
    return `# ${consolidation.title}

## Quando Usar

Use esta skill quando a tarefa envolver ${consolidation.tags.slice(0, 5).join(", ")}.

## Instruções

${consolidation.content}

## Entrada

- \`documentos\`: lista de fontes ou contexto bruto.
- \`objetivo\`: resultado esperado pelo usuário.

## Saída

- Documento Markdown consolidado.
- Fontes utilizadas.
- Lacunas e divergências.
`;
  }

  if (targetType === "prompt") {
    return `# ${consolidation.title}

Você é Hermione, bibliotecária da Alexandria. Analise as fontes abaixo, preserve rastreabilidade, aponte conflitos e gere uma síntese utilizável por agentes.

${consolidation.content}
`;
  }

  return consolidation.content;
}

function inferAuthor(name: string, content: string): string {
  const text = `${name} ${content}`.toLowerCase();
  if (text.includes("notebooklm") || text.includes("notebook lm")) return "NotebookLM";
  if (text.includes("kimi")) return "Kimi";
  if (text.includes("claude")) return "Claude";
  if (text.includes("chatgpt") || text.includes("openai")) return "ChatGPT";
  if (text.includes("gemini")) return "Gemini";
  return "upload";
}

function titleFromFilename(name: string): string {
  return name
    .replace(/\.(md|txt|markdown)$/i, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

function unique<T>(items: T[]): T[] {
  return Array.from(new Set(items.filter(Boolean)));
}
