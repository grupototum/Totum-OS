import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  driveLogin, driveLogout, isLoggedIn,
  listDriveFiles, fetchDriveFileContent,
  type DriveFile, type DriveFolder,
} from '@/lib/drive';
import { inferDocType, sha256 } from '@/lib/sync-utils';
import { useAuth } from '@/contexts/AuthContext';

const ALEXANDRIA_API = 'https://alexandria.grupototum.com';

export type DriveStatus = 'idle' | 'auth' | 'listing' | 'syncing' | 'done' | 'error';

export interface DriveSyncEntry {
  file_id: string;
  file_name: string;
  status: 'success' | 'error' | 'skipped' | 'unsupported';
  error_message?: string;
  synced_at: string;
}

export interface DriveSyncSummary {
  total: number;
  success: number;
  error: number;
  skipped: number;
  duration_ms: number;
  entries: DriveSyncEntry[];
}

export function useGoogleDriveSync() {
  const { user } = useAuth();
  const [authenticated, setAuthenticated] = useState(isLoggedIn());
  const [status, setStatus] = useState<DriveStatus>('idle');
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [progress, setProgress] = useState({ current: 0, total: 0, label: '' });
  const [lastRun, setLastRun] = useState<DriveSyncSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async () => {
    setStatus('auth');
    setError(null);
    try {
      await driveLogin();
      setAuthenticated(true);
      setStatus('idle');
    } catch (e) {
      setError((e as Error).message);
      setStatus('error');
    }
  }, []);

  const logout = useCallback(() => {
    driveLogout();
    setAuthenticated(false);
    setFiles([]);
    setStatus('idle');
  }, []);

  const listFolder = useCallback(async (folderId = 'root') => {
    setStatus('listing');
    setError(null);
    try {
      const result = await listDriveFiles(folderId);
      setFiles(result.filter(f =>
        f.mimeType === 'application/vnd.google-apps.document' ||
        f.mimeType.startsWith('text/') ||
        f.name.endsWith('.md') ||
        f.name.endsWith('.txt')
      ));
      setStatus('idle');
    } catch (e) {
      setError((e as Error).message);
      setStatus('error');
    }
  }, []);

  const syncFiles = useCallback(async (selectedFiles: DriveFile[]) => {
    if (!selectedFiles.length) return;
    setError(null);
    setLastRun(null);
    const startedAt = Date.now();
    setStatus('syncing');

    const entries: DriveSyncEntry[] = [];
    let success = 0, errors = 0, skipped = 0;

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      setProgress({ current: i + 1, total: selectedFiles.length, label: file.name });

      try {
        const { content, mimeType } = await fetchDriveFileContent(file);
        if (!content.trim()) { skipped++; entries.push({ file_id: file.id, file_name: file.name, status: 'skipped', synced_at: new Date().toISOString() }); continue; }

        const hash = await sha256(content);
        const sourcePath = `gdrive:${file.id}`;

        const { data: existing } = await (supabase as any)
          .from('alexandria_documents')
          .select('id, source_id')
          .eq('source_path', sourcePath)
          .maybeSingle();

        if (existing?.source_id === hash) {
          skipped++;
          entries.push({ file_id: file.id, file_name: file.name, status: 'skipped', synced_at: new Date().toISOString() });
          continue;
        }

        const title = file.name.replace(/\.(md|txt|gdoc)$/i, '');
        const docType = inferDocType(file.name, []);

        const res = await fetch(`${ALEXANDRIA_API}/alexandria/ingest`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title,
            content,
            doc_type: docType,
            path: sourcePath,
            metadata: {
              source_type: 'google_drive',
              source_id: file.id,
              source_path: sourcePath,
              mime_type: mimeType,
              modified_time: file.modifiedTime,
            },
          }),
        });

        const json = await res.json();
        if (!res.ok || json.error) throw new Error(json.error || `HTTP ${res.status}`);

        await (supabase as any)
          .from('alexandria_documents')
          .update({ source_type: 'google_drive', source_path: sourcePath, source_id: hash, last_synced_at: new Date().toISOString() })
          .eq('id', json.id);

        await (supabase as any).from('alexandria_sync_log').insert({
          user_id: user?.id ?? null,
          source_type: 'google_drive',
          source_path: sourcePath,
          document_id: json.id,
          status: 'success',
          synced_at: new Date().toISOString(),
        });

        entries.push({ file_id: file.id, file_name: file.name, status: 'success', synced_at: new Date().toISOString() });
        success++;
      } catch (e) {
        const msg = (e as Error).message;
        entries.push({ file_id: file.id, file_name: file.name, status: 'error', error_message: msg, synced_at: new Date().toISOString() });
        errors++;
      }
    }

    setLastRun({ total: selectedFiles.length, success, error: errors, skipped, duration_ms: Date.now() - startedAt, entries });
    setStatus('done');
  }, [user]);

  return { authenticated, status, files, progress, lastRun, error, login, logout, listFolder, syncFiles };
}
