import {
  createArtifactFromSources,
  createSources,
  type HermioneArtifact,
  type HermioneSourceInput,
} from "@/services/hermioneArtifacts";

export type BridgePrivacyZone = "green" | "yellow" | "red";

export interface BridgeFileInput {
  name: string;
  content: string;
}

export interface BridgeFileAnalysis extends BridgeFileInput {
  zone: BridgePrivacyZone;
  label: string;
  reason: string;
  suggestedAction: string;
  tags: string[];
}

export interface AlexandriaBridgePackage {
  source: "bulma_logseq_bridge";
  generatedAt: string;
  files: BridgeFileAnalysis[];
  allowedFiles: BridgeFileAnalysis[];
  blockedFiles: BridgeFileAnalysis[];
  manifest?: Record<string, unknown>;
}

const RED_SIGNALS = [
  "financas/app",
  "localstorage",
  "cartao",
  "cpf",
  "senha",
  "access token",
  "bearer ",
  "api_key",
  "chave secreta",
  "secret",
  "saúde",
  "saude",
  "doença",
  "doenca",
  "família",
  "familia",
  "miguel",
  "mylena",
  "dados banc",
];

const YELLOW_SIGNALS = [
  "preferencia",
  "preferência",
  "rotina",
  "agenda",
  "memoria quente",
  "memória quente",
  "pessoal",
  "diario",
  "diário",
  "logseq",
];

const GREEN_SIGNALS = [
  "totum",
  "alexandria",
  "skill",
  "pop",
  "prompt",
  "decisao",
  "decisão",
  "contexto-sanitizado",
  "preferencias-permitidas",
  "manifest",
];

export function analyzeBridgeFiles(files: BridgeFileInput[]): AlexandriaBridgePackage {
  const analyses = files.map(analyzeBridgeFile);
  const manifestFile = files.find((file) => file.name.toLowerCase().endsWith("manifest.json"));

  return {
    source: "bulma_logseq_bridge",
    generatedAt: new Date().toISOString(),
    files: analyses,
    allowedFiles: analyses.filter((file) => file.zone !== "red"),
    blockedFiles: analyses.filter((file) => file.zone === "red"),
    manifest: manifestFile ? safeParseJson(manifestFile.content) : undefined,
  };
}

export function analyzeBridgeFile(file: BridgeFileInput): BridgeFileAnalysis {
  const text = `${file.name}\n${file.content}`.toLowerCase();
  const redSignal = RED_SIGNALS.find((signal) => text.includes(signal));
  const yellowSignal = YELLOW_SIGNALS.find((signal) => text.includes(signal));
  const greenSignal = GREEN_SIGNALS.find((signal) => text.includes(signal));

  if (redSignal) {
    return {
      ...file,
      zone: "red",
      label: "Bloqueado",
      reason: `Sinal sensível detectado: ${redSignal}.`,
      suggestedAction: "Manter apenas no Mac/Bulma e gerar um resumo sanitizado antes de enviar.",
      tags: ["privacy:red", "blocked", redSignal.replace(/\s+/g, "-")],
    };
  }

  if (yellowSignal) {
    return {
      ...file,
      zone: "yellow",
      label: "Permitido com cuidado",
      reason: `Contexto pessoal permitido ou operacional detectado: ${yellowSignal}.`,
      suggestedAction: "Importar como contexto temporário ou preferência permitida, sem detalhes íntimos.",
      tags: ["privacy:yellow", "sanitized", yellowSignal.replace(/\s+/g, "-")],
    };
  }

  return {
    ...file,
    zone: "green",
    label: greenSignal ? "Permitido" : "Permitido após revisão",
    reason: greenSignal
      ? `Conteúdo operacional detectado: ${greenSignal}.`
      : "Nenhum sinal sensível conhecido foi encontrado nesta primeira análise.",
    suggestedAction: "Importar para Alexandria como fonte rastreável.",
    tags: ["privacy:green", "bulma-bridge", greenSignal || "reviewed"],
  };
}

export async function importBulmaBridgePackage(
  bridgePackage: AlexandriaBridgePackage
): Promise<HermioneArtifact> {
  if (!bridgePackage.allowedFiles.length) {
    throw new Error("Nenhum arquivo permitido para importar. Gere um pacote sanitizado na Bulma antes.");
  }

  const sourceInputs: HermioneSourceInput[] = bridgePackage.allowedFiles.map((file) => ({
    name: file.name,
    content: withBridgeHeader(file),
    origin: "bulma_logseq_bridge",
    author: "Bulma",
  }));

  const sources = await createSources(sourceInputs);

  return createArtifactFromSources(sourceInputs, {
    type: "context_pack",
    status: "review",
    scope: "personal_allowed",
    sourceIds: sources.map((source) => source.id),
    changeNote: "Importação de pacote sanitizado da Bulma/Logseq Bridge",
    metadata: {
      bridge: "bulma_logseq_bridge",
      privacyModel: "green-yellow-red",
      allowedFiles: bridgePackage.allowedFiles.map(({ name, zone, tags }) => ({ name, zone, tags })),
      blockedFiles: bridgePackage.blockedFiles.map(({ name, reason }) => ({ name, reason })),
      manifest: bridgePackage.manifest || null,
    },
  });
}

export function createBridgeManifestTemplate(): string {
  return JSON.stringify(
    {
      name: "bulma-to-alexandria-context-pack",
      source: "bulma_logseq_bridge",
      generated_at: "2026-04-27T00:00:00.000Z",
      vault: "Logseq local sanitizado",
      privacy_policy: {
        green: "Pode entrar na Alexandria.",
        yellow: "Pode entrar apenas como resumo permitido.",
        red: "Nunca enviar para Alexandria.",
      },
      files: [
        "contexto-sanitizado.md",
        "preferencias-permitidas.md",
        "decisoes.md",
        "tags.json",
      ],
    },
    null,
    2
  );
}

export function createBridgeReadmeTemplate(): string {
  return `# Pacote Bulma -> Alexandria

Origem: Bulma / Logseq local
Destino: Alexandria / Totum OS
Status: sanitizado

## O que este pacote pode conter

- Preferências permitidas de trabalho
- Decisões que afetam Totum OS ou operação
- Contexto de estudo que pode ajudar agentes
- Resumos sem dados íntimos

## O que este pacote não pode conter

- Finanças pessoais detalhadas
- Saúde e família
- Tokens, senhas, chaves ou dados bancários
- Journals brutos do Logseq

## Checklist antes de importar

- [ ] Revisei arquivos vermelhos e removi do pacote
- [ ] Mantive apenas verde/amarelo
- [ ] O pacote tem manifest.json
- [ ] A Bulma/Xavier validou o roteamento
`;
}

function withBridgeHeader(file: BridgeFileAnalysis): string {
  return `---
source: bulma_logseq_bridge
privacy_zone: ${file.zone}
privacy_label: ${file.label}
review_status: pending
---

${file.content}`;
}

function safeParseJson(content: string): Record<string, unknown> | undefined {
  try {
    return JSON.parse(content) as Record<string, unknown>;
  } catch {
    return undefined;
  }
}
