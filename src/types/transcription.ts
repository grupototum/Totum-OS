// Tipos para processamento de transcrições de TikTok

export interface TranscriptionCSVRow {
  Subject: string;
  Transcrição: string;
  Criador: string;
  Error: string | null;
}

export interface TranscriptionImport {
  id: string;
  subject: string;
  transcricao: string;
  criador: string;
  error: string | null;
  status: 'pending' | 'processing' | 'done' | 'failed';
  imported_at: string;
  processed_at?: string;
}

export interface TranscriptionAnalysis {
  id: string;
  import_id: string;
  skill_id: string;
  skill_name: string;
  input_data: Record<string, any>;
  output_data: Record<string, any>;
  model_used: string;
  execution_time_ms: number;
  status: 'success' | 'failed';
  created_at: string;
}

export interface TranscriptionInsight {
  insight: string;
  relevance: 'high' | 'medium' | 'low';
}

export interface SkillExecutionResult {
  skill: string;
  output: any;
  model: string;
  execution_ms: number;
  success: boolean;
  error?: string;
}

export interface TranscriptionSkillInput {
  transcricao: string;
  subject?: string;
  criador?: string;
  tema?: string;
}

export type SkillName =
  | 'Extrator de Insights'
  | 'Classificador de Conteúdo'
  | 'Gerador de Tags'
  | 'Resumidor de Vídeo'
  | 'Extrator de CTAs'
  | 'Detector de Trending Topics'
  | 'Gerador de Scripts';
