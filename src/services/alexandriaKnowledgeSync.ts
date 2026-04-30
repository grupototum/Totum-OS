import {
  createArtifactFromSources,
  createSources,
  type HermioneArtifact,
  type HermioneSource,
  type HermioneSourceInput,
} from "@/services/hermioneArtifacts";
import { analyzeBridgeFile, type BridgePrivacyZone } from "@/services/alexandriaBridge";

export type KnowledgeSyncSource = "logseq_local" | "google_drive";

export interface KnowledgeSyncFileInput {
  name: string;
  content: string;
  sourcePath?: string;
  externalId?: string;
  webViewLink?: string;
  modifiedTime?: string;
}

export interface KnowledgeSyncFileAnalysis extends KnowledgeSyncFileInput {
  zone: BridgePrivacyZone;
  zoneLabel: string;
  zoneReason: string;
  suggestedAction: string;
  tags: string[];
  isSkillCandidate: boolean;
  skillReason: string;
}

export interface KnowledgeSyncPreview {
  source: KnowledgeSyncSource;
  scope: "skills";
  generatedAt: string;
  files: KnowledgeSyncFileAnalysis[];
  skillCandidates: KnowledgeSyncFileAnalysis[];
  importableSkills: KnowledgeSyncFileAnalysis[];
  blockedFiles: KnowledgeSyncFileAnalysis[];
  reviewFiles: KnowledgeSyncFileAnalysis[];
}

export interface KnowledgeSyncImportResult {
  sources: HermioneSource[];
  artifact: HermioneArtifact;
  importedSkills: number;
}

export interface GoogleDriveTokenPayload {
  accessToken: string;
  expiresAt: number;
  tokenType?: string;
}

export interface GoogleDriveRemoteFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  webViewLink?: string;
  parents?: string[];
}

const GOOGLE_DRIVE_STORAGE_KEY = "totum.googleDriveToken";
const GOOGLE_DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.readonly";
const GOOGLE_DRIVE_SUPPORTED_MIME_TYPES = new Set([
  "text/markdown",
  "text/plain",
  "application/json",
  "application/vnd.google-apps.document",
]);

export function buildKnowledgeSyncPreview(
  source: KnowledgeSyncSource,
  files: KnowledgeSyncFileInput[]
): KnowledgeSyncPreview {
  const analyses = files.map((file) => analyzeKnowledgeSyncFile(file));
  const skillCandidates = analyses.filter((file) => file.isSkillCandidate);

  return {
    source,
    scope: "skills",
    generatedAt: new Date().toISOString(),
    files: analyses,
    skillCandidates,
    importableSkills: skillCandidates.filter((file) => file.zone === "green"),
    blockedFiles: analyses.filter((file) => file.zone === "red"),
    reviewFiles: skillCandidates.filter((file) => file.zone === "yellow"),
  };
}

export async function importKnowledgeSyncPreview(
  preview: KnowledgeSyncPreview
): Promise<KnowledgeSyncImportResult> {
  if (!preview.importableSkills.length) {
    throw new Error("Nenhuma skill verde pronta para importar.");
  }

  const sourceInputs: HermioneSourceInput[] = preview.importableSkills.map((file) => ({
    name: file.sourcePath || file.name,
    content: addSyncHeader(preview.source, file),
    origin: preview.source,
    author: preview.source === "google_drive" ? "Google Drive" : "Logseq local",
  }));

  const sources = await createSources(sourceInputs);
  const artifactType = preview.importableSkills.length === 1 ? "skill" : "context_pack";
  const artifact = await createArtifactFromSources(sourceInputs, {
    sourceIds: sources.map((source) => source.id),
    type: artifactType,
    status: "review",
    scope: "totum",
    changeNote: `Sincronização inicial de skills via ${preview.source}`,
    metadata: {
      syncSource: preview.source,
      syncScope: preview.scope,
      importedSkills: preview.importableSkills.map((file) => ({
        name: file.name,
        sourcePath: file.sourcePath || null,
        externalId: file.externalId || null,
        webViewLink: file.webViewLink || null,
        modifiedTime: file.modifiedTime || null,
        skillReason: file.skillReason,
        privacyZone: file.zone,
        tags: file.tags,
      })),
      reviewFiles: preview.reviewFiles.map((file) => ({
        name: file.name,
        reason: file.zoneReason,
        skillReason: file.skillReason,
      })),
      blockedFiles: preview.blockedFiles.map((file) => ({
        name: file.name,
        reason: file.zoneReason,
      })),
    },
  });

  return {
    sources,
    artifact,
    importedSkills: preview.importableSkills.length,
  };
}

export function analyzeKnowledgeSyncFile(file: KnowledgeSyncFileInput): KnowledgeSyncFileAnalysis {
  const privacy = analyzeBridgeFile({
    name: file.sourcePath || file.name,
    content: file.content,
  });
  const skillSignal = detectSkillCandidate(file);

  return {
    ...file,
    zone: privacy.zone,
    zoneLabel: privacy.label,
    zoneReason: privacy.reason,
    suggestedAction: privacy.suggestedAction,
    tags: privacy.tags,
    isSkillCandidate: skillSignal.isSkillCandidate,
    skillReason: skillSignal.reason,
  };
}

export function detectSkillCandidate(file: KnowledgeSyncFileInput): {
  isSkillCandidate: boolean;
  reason: string;
} {
  const pathText = `${file.sourcePath || file.name}`.toLowerCase();
  const content = file.content.toLowerCase();

  if (/(^|\/)(skills?|agents?)\//.test(pathText)) {
    return { isSkillCandidate: true, reason: "Caminho indica catálogo de skills." };
  }

  if (/(\n|^)type\s*[:=]{1,2}\s*skill(\n|$)/i.test(file.content) || /(\n|^)tipo\s*[:=]{1,2}\s*skill(\n|$)/i.test(file.content)) {
    return { isSkillCandidate: true, reason: "Frontmatter ou propriedade indica type=skill." };
  }

  if (/skill_id:|## entradas|## saídas|recommended_skills|execution_plan|quando usar|use esta skill/i.test(file.content)) {
    return { isSkillCandidate: true, reason: "Estrutura interna compatível com skill operacional." };
  }

  return { isSkillCandidate: false, reason: "Arquivo não parece ser skill nesta primeira varredura." };
}

export function buildGoogleDriveOAuthUrl(): string {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";
  if (!clientId) {
    throw new Error("Configure VITE_GOOGLE_CLIENT_ID para conectar o Google Drive.");
  }

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: googleDriveRedirectUri(),
    response_type: "token",
    scope: GOOGLE_DRIVE_SCOPE,
    include_granted_scopes: "true",
    prompt: "consent",
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export function googleDriveRedirectUri(): string {
  return `${window.location.origin}/google-drive/callback`;
}

export function storeGoogleDriveToken(payload: GoogleDriveTokenPayload) {
  localStorage.setItem(GOOGLE_DRIVE_STORAGE_KEY, JSON.stringify(payload));
}

export function clearGoogleDriveToken() {
  localStorage.removeItem(GOOGLE_DRIVE_STORAGE_KEY);
}

export function getStoredGoogleDriveToken(): GoogleDriveTokenPayload | null {
  const raw = localStorage.getItem(GOOGLE_DRIVE_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as GoogleDriveTokenPayload;
    if (!parsed.accessToken || !parsed.expiresAt || parsed.expiresAt <= Date.now()) {
      localStorage.removeItem(GOOGLE_DRIVE_STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    localStorage.removeItem(GOOGLE_DRIVE_STORAGE_KEY);
    return null;
  }
}

export function normalizeGoogleDriveFolderId(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";

  const match = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];

  const queryMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (queryMatch) return queryMatch[1];

  return trimmed;
}

export async function fetchGoogleDriveSkillFiles(
  folderInput: string
): Promise<KnowledgeSyncFileInput[]> {
  const token = getStoredGoogleDriveToken();
  if (!token) {
    throw new Error("Conecte o Google Drive antes de sincronizar.");
  }

  const folderId = normalizeGoogleDriveFolderId(folderInput);
  if (!folderId) {
    throw new Error("Informe o ID ou link da pasta do Google Drive.");
  }

  const files = await listDriveFilesRecursively(folderId, token.accessToken);
  const supportedFiles = files.filter((file) => isSupportedGoogleDriveFile(file));

  return Promise.all(
    supportedFiles.map(async (file) => ({
      name: file.name,
      content: await fetchGoogleDriveFileContent(file, token.accessToken),
      sourcePath: file.name,
      externalId: file.id,
      webViewLink: file.webViewLink,
      modifiedTime: file.modifiedTime,
    }))
  );
}

async function listDriveFilesRecursively(
  folderId: string,
  accessToken: string
): Promise<GoogleDriveRemoteFile[]> {
  const files: GoogleDriveRemoteFile[] = [];
  const queue: string[] = [folderId];

  while (queue.length) {
    const currentFolder = queue.shift();
    if (!currentFolder) continue;

    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(`'${currentFolder}' in parents and trashed = false`)}&fields=files(id,name,mimeType,modifiedTime,webViewLink,parents)&pageSize=200`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(payload?.error?.message || "Não consegui listar os arquivos do Google Drive.");
    }

    for (const file of (payload.files || []) as GoogleDriveRemoteFile[]) {
      if (file.mimeType === "application/vnd.google-apps.folder") {
        queue.push(file.id);
      } else {
        files.push(file);
      }
    }
  }

  return files;
}

function isSupportedGoogleDriveFile(file: GoogleDriveRemoteFile): boolean {
  if (GOOGLE_DRIVE_SUPPORTED_MIME_TYPES.has(file.mimeType)) return true;
  return /\.(md|markdown|txt|json)$/i.test(file.name);
}

async function fetchGoogleDriveFileContent(
  file: GoogleDriveRemoteFile,
  accessToken: string
): Promise<string> {
  const url =
    file.mimeType === "application/vnd.google-apps.document"
      ? `https://www.googleapis.com/drive/v3/files/${file.id}/export?mimeType=text/plain`
      : `https://www.googleapis.com/drive/v3/files/${file.id}?alt=media`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload?.error?.message || `Não consegui baixar ${file.name} do Google Drive.`);
  }

  return response.text();
}

function addSyncHeader(source: KnowledgeSyncSource, file: KnowledgeSyncFileAnalysis): string {
  return [
    "---",
    `source: ${source}`,
    "sync_scope: skills",
    `privacy_zone: ${file.zone}`,
    `skill_candidate: ${file.isSkillCandidate}`,
    ...(file.externalId ? [`external_id: ${file.externalId}`] : []),
    ...(file.webViewLink ? [`external_url: ${file.webViewLink}`] : []),
    "---",
    "",
    file.content,
  ].join("\n");
}
