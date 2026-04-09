// Serviço de processamento de transcrições de TikTok via Ollama

import { ollamaGenerate, DEFAULT_TRANSCRIPTION_MODEL } from './ollamaService';
import { TranscriptionSkillInput, SkillExecutionResult } from '@/types/transcription';

// ============================================================
// SKILL 1: Extrator de Insights
// ============================================================
export const extractInsights = async (
  input: TranscriptionSkillInput,
  model = DEFAULT_TRANSCRIPTION_MODEL
): Promise<SkillExecutionResult> => {
  const start = Date.now();
  try {
    const prompt = `Analise a transcrição abaixo e extraia 3 a 5 insights principais, claros e acionáveis sobre o conteúdo.

Transcrição: "${input.transcricao}"

Responda APENAS com um JSON no formato:
{"insights": ["insight 1", "insight 2", "insight 3"]}`;

    const raw = await ollamaGenerate({ model, prompt });
    const json = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] || '{}');
    return { skill: 'Extrator de Insights', output: json, model, execution_ms: Date.now() - start, success: true };
  } catch (err: any) {
    return { skill: 'Extrator de Insights', output: null, model, execution_ms: Date.now() - start, success: false, error: err.message };
  }
};

// ============================================================
// SKILL 2: Classificador de Conteúdo
// ============================================================
export const classifyContent = async (
  input: TranscriptionSkillInput,
  model = DEFAULT_TRANSCRIPTION_MODEL
): Promise<SkillExecutionResult> => {
  const start = Date.now();
  try {
    const prompt = `Classifique o conteúdo do vídeo abaixo em uma categoria principal.

Subject: "${input.subject}"
Transcrição: "${input.transcricao}"

Categorias possíveis: Educação, Entretenimento, Marketing, Lifestyle, Tecnologia, Saúde, Finanças, Humor, Notícias, Outro.

Responda APENAS com JSON: {"categoria": "...", "subcategoria": "...", "confianca": 0.0}`;

    const raw = await ollamaGenerate({ model, prompt });
    const json = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] || '{}');
    return { skill: 'Classificador de Conteúdo', output: json, model, execution_ms: Date.now() - start, success: true };
  } catch (err: any) {
    return { skill: 'Classificador de Conteúdo', output: null, model, execution_ms: Date.now() - start, success: false, error: err.message };
  }
};

// ============================================================
// SKILL 3: Gerador de Tags
// ============================================================
export const generateTags = async (
  input: TranscriptionSkillInput,
  model = DEFAULT_TRANSCRIPTION_MODEL
): Promise<SkillExecutionResult> => {
  const start = Date.now();
  try {
    const prompt = `Gere exatamente 10 hashtags relevantes para o TikTok baseado na transcrição abaixo.

Transcrição: "${input.transcricao}"

Regras: Use hashtags em português, sem espaços, comecem com #.
Responda APENAS com JSON: {"hashtags": ["#tag1", "#tag2", ...]}`;

    const raw = await ollamaGenerate({ model, prompt });
    const json = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] || '{}');
    return { skill: 'Gerador de Tags', output: json, model, execution_ms: Date.now() - start, success: true };
  } catch (err: any) {
    return { skill: 'Gerador de Tags', output: null, model, execution_ms: Date.now() - start, success: false, error: err.message };
  }
};

// ============================================================
// SKILL 4: Resumidor de Vídeo
// ============================================================
export const summarizeVideo = async (
  input: TranscriptionSkillInput,
  model = DEFAULT_TRANSCRIPTION_MODEL
): Promise<SkillExecutionResult> => {
  const start = Date.now();
  try {
    const prompt = `Resuma o conteúdo do vídeo em 100-150 palavras, em português claro e objetivo.

Transcrição: "${input.transcricao}"

Responda APENAS com JSON: {"resumo": "..."}`;

    const raw = await ollamaGenerate({ model, prompt });
    const json = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] || '{}');
    return { skill: 'Resumidor de Vídeo', output: json, model, execution_ms: Date.now() - start, success: true };
  } catch (err: any) {
    return { skill: 'Resumidor de Vídeo', output: null, model, execution_ms: Date.now() - start, success: false, error: err.message };
  }
};

// ============================================================
// SKILL 5: Extrator de CTAs
// ============================================================
export const extractCTAs = async (
  input: TranscriptionSkillInput,
  model = DEFAULT_TRANSCRIPTION_MODEL
): Promise<SkillExecutionResult> => {
  const start = Date.now();
  try {
    const prompt = `Identifique todos os calls-to-action (CTAs) explícitos e implícitos na transcrição.

Transcrição: "${input.transcricao}"

Responda APENAS com JSON: {"ctas": [{"texto": "...", "tipo": "explicito|implicito", "intencao": "..."}]}`;

    const raw = await ollamaGenerate({ model, prompt });
    const json = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] || '{}');
    return { skill: 'Extrator de CTAs', output: json, model, execution_ms: Date.now() - start, success: true };
  } catch (err: any) {
    return { skill: 'Extrator de CTAs', output: null, model, execution_ms: Date.now() - start, success: false, error: err.message };
  }
};

// ============================================================
// SKILL 6: Detector de Trending Topics
// ============================================================
export const detectTrendingTopics = async (
  input: TranscriptionSkillInput,
  model = DEFAULT_TRANSCRIPTION_MODEL
): Promise<SkillExecutionResult> => {
  const start = Date.now();
  try {
    const prompt = `Identifique tópicos em alta e tendências presentes na transcrição abaixo.

Transcrição: "${input.transcricao}"

Responda APENAS com JSON: {"topicos": [{"nome": "...", "relevancia": "alta|media|baixa", "contexto": "..."}]}`;

    const raw = await ollamaGenerate({ model, prompt });
    const json = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] || '{}');
    return { skill: 'Detector de Trending Topics', output: json, model, execution_ms: Date.now() - start, success: true };
  } catch (err: any) {
    return { skill: 'Detector de Trending Topics', output: null, model, execution_ms: Date.now() - start, success: false, error: err.message };
  }
};

// ============================================================
// SKILL 7: Gerador de Scripts
// ============================================================
export const generateScript = async (
  input: TranscriptionSkillInput,
  model = DEFAULT_TRANSCRIPTION_MODEL
): Promise<SkillExecutionResult> => {
  const start = Date.now();
  try {
    const prompt = `Baseado na transcrição abaixo, crie um script similar para um novo vídeo TikTok sobre o tema "${input.tema || input.subject}".

Transcrição de referência: "${input.transcricao}"

O script deve ter gancho inicial forte, desenvolvimento e CTA final.
Responda APENAS com JSON: {"script": {"gancho": "...", "desenvolvimento": "...", "cta": "...", "duracao_estimada": "30-60s"}}`;

    const raw = await ollamaGenerate({ model, prompt });
    const json = JSON.parse(raw.match(/\{[\s\S]*\}/)?.[0] || '{}');
    return { skill: 'Gerador de Scripts', output: json, model, execution_ms: Date.now() - start, success: true };
  } catch (err: any) {
    return { skill: 'Gerador de Scripts', output: null, model, execution_ms: Date.now() - start, success: false, error: err.message };
  }
};

// Executa todas as 7 skills em uma transcrição
export const processAllSkills = async (
  input: TranscriptionSkillInput,
  model = DEFAULT_TRANSCRIPTION_MODEL
): Promise<SkillExecutionResult[]> => {
  const results = await Promise.allSettled([
    extractInsights(input, model),
    classifyContent(input, model),
    generateTags(input, model),
    summarizeVideo(input, model),
    extractCTAs(input, model),
    detectTrendingTopics(input, model),
    generateScript(input, model),
  ]);

  return results.map((r) =>
    r.status === 'fulfilled' ? r.value : { skill: 'unknown', output: null, model, execution_ms: 0, success: false, error: String(r.reason) }
  );
};
