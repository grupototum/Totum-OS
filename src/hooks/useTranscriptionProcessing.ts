import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { processAllSkills } from '@/services/transcriptionService';
import { TranscriptionCSVRow, TranscriptionImport, SkillExecutionResult } from '@/types/transcription';

interface ProcessingState {
  isLoading: boolean;
  progress: number;
  total: number;
  current: string;
  results: Record<string, SkillExecutionResult[]>;
  error: string | null;
}

export const useTranscriptionProcessing = () => {
  const [state, setState] = useState<ProcessingState>({
    isLoading: false, progress: 0, total: 0, current: '', results: {}, error: null,
  });

  const parseCSV = useCallback((csvText: string): TranscriptionCSVRow[] => {
    const lines = csvText.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
    return lines.slice(1).map(line => {
      const values: string[] = [];
      let current = '';
      let inQuotes = false;

      for (const char of line) {
        if (char === '"') { inQuotes = !inQuotes; continue; }
        if (char === ',' && !inQuotes) { values.push(current.trim()); current = ''; continue; }
        current += char;
      }
      values.push(current.trim());

      return {
        Subject: values[headers.indexOf('Subject')] || '',
        Transcrição: values[headers.indexOf('Transcrição')] || '',
        Criador: values[headers.indexOf('Criador')] || '',
        Error: values[headers.indexOf('Error')] || null,
      };
    }).filter(r => r.Transcrição);
  }, []);

  const processTranscriptions = useCallback(async (
    rows: TranscriptionCSVRow[],
    model: string
  ) => {
    setState(s => ({ ...s, isLoading: true, progress: 0, total: rows.length, error: null }));

    const allResults: Record<string, SkillExecutionResult[]> = {};

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      setState(s => ({ ...s, progress: i + 1, current: row.Subject || `Linha ${i + 1}` }));

      try {
        const results = await processAllSkills({
          transcricao: row.Transcrição,
          subject: row.Subject,
          criador: row.Criador,
        }, model);

        allResults[row.Subject || String(i)] = results;
        await saveToSupabase(row, results);
      } catch (err: any) {
        console.error(`Erro ao processar "${row.Subject}":`, err);
      }
    }

    setState(s => ({ ...s, isLoading: false, results: allResults }));
  }, []);

  const saveToSupabase = async (
    row: TranscriptionCSVRow,
    results: SkillExecutionResult[]
  ) => {
    try {
      const { data: importData } = await (supabase as any)
        .from('transcription_imports')
        .insert({
          subject: row.Subject,
          transcricao: row.Transcrição,
          criador: row.Criador,
          error: row.Error,
          status: 'done',
          processed_at: new Date().toISOString(),
        })
        .select('id')
        .single();

      if (!importData?.id) return;

      const analyses = results
        .filter(r => r.success)
        .map(r => ({
          import_id: importData.id,
          skill_name: r.skill,
          output_data: r.output,
          model_used: r.model,
          execution_time_ms: r.execution_ms,
          status: 'success' as const,
        }));

      if (analyses.length > 0) {
        await (supabase as any).from('transcription_analysis').insert(analyses);
      }
    } catch (err) {
      console.error('[Supabase] Erro ao salvar transcrição:', err);
    }
  };

  const loadImports = useCallback(async (): Promise<TranscriptionImport[]> => {
    const { data } = await (supabase as any)
      .from('transcription_imports')
      .select('*')
      .order('imported_at', { ascending: false })
      .limit(100);
    return (data || []) as unknown as TranscriptionImport[];
  }, []);

  return { ...state, parseCSV, processTranscriptions, loadImports };
};
