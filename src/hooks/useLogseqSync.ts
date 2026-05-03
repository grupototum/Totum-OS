import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { pickLogseqGraph, readLogseqPages } from '@/lib/logseq';
import { useAuth } from '@/contexts/AuthContext';

const ALEXANDRIA_API = 'https://alexandria.grupototum.com';

export type SyncStatus = 'idle' | 'picking' | 'reading' | 'syncing' | 'done' | 'error';

export interface SyncLogEntry {
  id?: string;
  source_path: string;
  document_title: string;
  status: 'success' | 'error' | 'skipped';
  error_message?: string;
  synced_at: string;
}

export interface SyncSummary {
  total: number;
  success: number;
  error: number;
  skipped: number;
  duration_ms: number;
  entries: SyncLogEntry[];
}

export function useLogseqSync() {
  const { user } = useAuth();
  const [status, setStatus] = useState<SyncStatus>('idle');
  const [progress, setProgress] = useState({ current: 0, total: 0, label: '' });
  const [lastRun, setLastRun] = useState<SyncSummary | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [graphName, setGraphName] = useState<string | null>(null);

  const runSync = useCallback(async () => {
    setError(null);
    setLastRun(null);
    const startedAt = Date.now();

    try {
      setStatus('picking');
      setProgress({ current: 0, total: 0, label: 'Selecione a pasta do graph Logseq...' });

      const dirHandle = await pickLogseqGraph();
      const name = dirHandle.name;
      setGraphName(name);

      setStatus('reading');
      setProgress({ current: 0, total: 0, label: `Lendo páginas de "${name}"...` });

      const pages = await readLogseqPages(dirHandle, name);
      setProgress({ current: 0, total: pages.length, label: `${pages.length} páginas encontradas. Iniciando ingestão...` });

      setStatus('syncing');
      const entries: SyncLogEntry[] = [];
      let success = 0, errors = 0, skipped = 0;

      for (let i = 0; i < pages.length; i++) {
        const page = pages[i];
        setProgress({ current: i + 1, total: pages.length, label: page.title });

        // Check if content changed (by source_path)
        const { data: existing } = await (supabase as any)
          .from('alexandria_documents')
          .select('id, source_id')
          .eq('source_path', page.sourcePath)
          .maybeSingle();

        if (existing?.source_id === page.hash) {
          entries.push({
            source_path: page.sourcePath,
            document_title: page.title,
            status: 'skipped',
            synced_at: new Date().toISOString(),
          });
          skipped++;
          continue;
        }

        try {
          const res = await fetch(`${ALEXANDRIA_API}/alexandria/ingest`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: page.title,
              content: page.content,
              doc_type: page.docType,
              path: page.sourcePath,
              metadata: {
                source_type: 'logseq',
                source_path: page.sourcePath,
                source_id: page.hash,
                tags: page.tags,
                graph: name,
                last_modified: page.lastModified,
              },
            }),
          });

          const json = await res.json();
          if (!res.ok || json.error) throw new Error(json.error || `HTTP ${res.status}`);

          // Update source columns directly
          await (supabase as any)
            .from('alexandria_documents')
            .update({
              source_type: 'logseq',
              source_path: page.sourcePath,
              source_id: page.hash,
              last_synced_at: new Date().toISOString(),
            })
            .eq('id', json.id);

          // Log to sync_log
          await (supabase as any).from('alexandria_sync_log').insert({
            user_id: user?.id ?? null,
            source_type: 'logseq',
            source_path: page.sourcePath,
            document_id: json.id,
            status: 'success',
            synced_at: new Date().toISOString(),
          });

          entries.push({
            source_path: page.sourcePath,
            document_title: page.title,
            status: 'success',
            synced_at: new Date().toISOString(),
          });
          success++;
        } catch (e) {
          const msg = (e as Error).message;
          entries.push({
            source_path: page.sourcePath,
            document_title: page.title,
            status: 'error',
            error_message: msg,
            synced_at: new Date().toISOString(),
          });
          errors++;
        }
      }

      const summary: SyncSummary = {
        total: pages.length,
        success,
        error: errors,
        skipped,
        duration_ms: Date.now() - startedAt,
        entries,
      };
      setLastRun(summary);
      setStatus('done');
    } catch (e) {
      const msg = (e as Error).message;
      if (msg.includes('aborted') || msg.includes('cancel')) {
        setStatus('idle');
        return;
      }
      setError(msg);
      setStatus('error');
    }
  }, [user]);

  const reset = useCallback(() => {
    setStatus('idle');
    setError(null);
    setLastRun(null);
    setProgress({ current: 0, total: 0, label: '' });
  }, []);

  return { status, progress, lastRun, error, graphName, runSync, reset };
}
