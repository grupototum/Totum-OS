/**
 * ADA Diagram Service
 * Gera diagramas Mermaid de arquitetura a partir de repositórios GitHub
 * usando Gemini como cérebro — inspirado no GitDiagram.
 *
 * Pipeline 2 passos:
 *   1. file tree → explicação de arquitetura em texto
 *   2. explicação + file tree → diagrama Mermaid flowchart
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent';

// ─── GitHub tree fetcher ──────────────────────────────────────────────────────

interface TreeItem {
  path: string;
  type: 'blob' | 'tree';
}

/** Busca a árvore de arquivos de um repo público no GitHub */
export async function fetchRepoTree(repo: string): Promise<string> {
  // tenta main → master → develop
  const branches = ['main', 'master', 'develop'];
  const [owner, repoName] = repo.replace(/^https?:\/\/github\.com\//, '').split('/');

  for (const branch of branches) {
    try {
      const res = await fetch(
        `https://api.github.com/repos/${owner}/${repoName}/git/trees/${branch}?recursive=1`,
        { headers: { Accept: 'application/vnd.github.v3+json' } }
      );
      if (!res.ok) continue;
      const data = await res.json();
      if (!data.tree) continue;

      const filtered: string[] = (data.tree as TreeItem[])
        .filter(
          item =>
            item.type === 'blob' &&
            !item.path.includes('node_modules/') &&
            !item.path.includes('.min.') &&
            !item.path.endsWith('.lock') &&
            !item.path.endsWith('package-lock.json') &&
            !item.path.endsWith('yarn.lock') &&
            !item.path.includes('dist/') &&
            !item.path.includes('build/') &&
            !item.path.includes('.next/') &&
            !item.path.includes('__pycache__/') &&
            !item.path.includes('.git/')
        )
        .map(item => item.path)
        .slice(0, 400); // limita para não explodir o prompt

      return filtered.join('\n');
    } catch {
      continue;
    }
  }
  throw new Error(`Não foi possível acessar o repositório ${repo}. Verifique se é público.`);
}

// ─── Gemini caller ────────────────────────────────────────────────────────────

async function callGemini(prompt: string, maxTokens = 1024): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error('VITE_GEMINI_API_KEY não configurada');

  const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: maxTokens },
    }),
  });

  if (!res.ok) throw new Error(`Gemini retornou ${res.status}`);
  const data = await res.json();
  const text: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
  if (!text) throw new Error('Gemini retornou resposta vazia');
  return text.trim();
}

// ─── Pass 1 — Architecture explanation ───────────────────────────────────────

async function explainArchitecture(repo: string, fileTree: string): Promise<string> {
  const prompt = `Você é um engenheiro de software sênior analisando o repositório "${repo}".
Abaixo está a lista de arquivos do projeto. Com base nos nomes e caminhos, escreva uma explicação
arquitetural concisa em 8-14 pontos curtos (sem Mermaid, sem JSON, sem código).

Foque em:
- Principais subsistemas e camadas (frontend, backend, banco, infra)
- Fluxos de dados entre componentes
- Padrões arquiteturais identificados (MVC, microserviços, monolito, etc.)
- Tecnologias principais detectadas pelos arquivos
- Pontos de entrada da aplicação

ARQUIVOS:
${fileTree.slice(0, 6000)}

Responda em português, sem introdução, direto aos pontos.`;

  return callGemini(prompt, 800);
}

// ─── Pass 2 — Mermaid diagram ─────────────────────────────────────────────────

async function generateMermaidDiagram(
  repo: string,
  fileTree: string,
  explanation: string
): Promise<string> {
  const prompt = `Você é um especialista em arquitetura de software. Com base na explicação abaixo e na árvore de arquivos do repositório "${repo}", gere um diagrama Mermaid flowchart TD.

REGRAS OBRIGATÓRIAS:
- Use APENAS sintaxe Mermaid válida (flowchart TD)
- 12-22 nós, 8-28 arestas — foco em clareza, não em completude
- Labels dos nós: 1-4 palavras, descritivos
- Agrupe em subgraphs por camada (Frontend, Backend, Database, Infra, etc.)
- NÃO inclua: arquivos de teste, configs isoladas, utilitários menores
- Use formas variadas: [] retângulo, () arredondado, {} losango (decisão), [( )] cilindro (banco), (( )) círculo
- RETORNE APENAS O CÓDIGO MERMAID, sem explicações, sem \`\`\`mermaid, sem markdown

EXPLICAÇÃO ARQUITETURAL:
${explanation}

ÁRVORE DE ARQUIVOS (amostra):
${fileTree.slice(0, 3000)}`;

  const raw = await callGemini(prompt, 1200);

  // Limpa eventuais blocos markdown que o modelo insira mesmo sendo instruído a não
  return raw
    .replace(/```mermaid\n?/gi, '')
    .replace(/```\n?/g, '')
    .trim();
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface DiagramResult {
  mermaid: string;
  explanation: string;
  fileTree: string;
  repo: string;
}

export interface DiagramProgress {
  step: 1 | 2 | 3;
  label: string;
}

/**
 * Pipeline completo: repo → DiagramResult
 * onProgress chamado em cada etapa para feedback visual
 */
export async function generateRepoDiagram(
  repo: string,
  onProgress: (p: DiagramProgress) => void
): Promise<DiagramResult> {
  onProgress({ step: 1, label: 'Buscando árvore de arquivos no GitHub…' });
  const fileTree = await fetchRepoTree(repo);

  onProgress({ step: 2, label: 'Analisando arquitetura com Gemini…' });
  const explanation = await explainArchitecture(repo, fileTree);

  onProgress({ step: 3, label: 'Gerando diagrama Mermaid…' });
  const mermaid = await generateMermaidDiagram(repo, fileTree, explanation);

  return { mermaid, explanation, fileTree, repo };
}
