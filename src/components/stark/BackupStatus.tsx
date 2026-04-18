import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HardDrive, CheckCircle, AlertCircle, Clock, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BackupJob {
  name: string;
  lastRun: string;
  status: 'success' | 'warning' | 'failed' | 'pending';
  size?: string;
  nextRun?: string;
}

const statusIcon = (status: BackupJob['status']) => {
  if (status === 'success') return <CheckCircle className="h-4 w-4 text-emerald-500" />;
  if (status === 'failed') return <AlertCircle className="h-4 w-4 text-red-500" />;
  if (status === 'warning') return <AlertCircle className="h-4 w-4 text-yellow-500" />;
  return <Clock className="h-4 w-4 text-muted-foreground" />;
};

const statusBadge: Record<BackupJob['status'], string> = {
  success: 'bg-emerald-500/15 text-emerald-400',
  warning: 'bg-yellow-500/15 text-yellow-400',
  failed: 'bg-red-500/15 text-red-400',
  pending: 'bg-zinc-800 text-zinc-400',
};

/**
 * BackupStatus — integração com Duplicati (quando configurado).
 * Sem URL configurada, mostra empty state com CTA.
 */
export default function BackupStatus() {
  const [jobs, setJobs] = useState<BackupJob[]>([]);
  const [loading, setLoading] = useState(false);

  const duplicatiUrl = import.meta.env.VITE_DUPLICATI_URL || '';

  useEffect(() => {
    if (!duplicatiUrl) return;

    const fetchBackups = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${duplicatiUrl}/api/v1/backups`);
        if (!res.ok) throw new Error('Falha ao buscar backups');
        const data = await res.json();
        // Mapear resposta do Duplicati para nosso formato
        setJobs(
          data.map((b: any) => ({
            name: b.Name || 'Backup',
            lastRun: b.Metadata?.LastBackupDate || '—',
            status: (b.Metadata?.LastBackupStatus || 'pending') as BackupJob['status'],
            size: b.Metadata?.LastBackupSize || undefined,
            nextRun: b.Schedule?.Repeat || '—',
          }))
        );
      } catch {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBackups();
  }, [duplicatiUrl]);

  // Empty state: Duplicati não configurado
  if (!duplicatiUrl && jobs.length === 0) {
    return (
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <HardDrive className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Backups (Duplicati)</h3>
        </div>
        <div className="text-center py-4">
          <HardDrive className="h-8 w-8 mx-auto mb-2 text-muted-foreground opacity-50" />
          <p className="text-sm text-muted-foreground">Duplicati não configurado</p>
          <p className="text-xs text-muted-foreground mt-1">
            Adicione <code className="bg-muted px-1 rounded">VITE_DUPLICATI_URL</code> no .env
          </p>
        </div>
      </Card>
    );
  }

  const allOk = jobs.length > 0 && jobs.every((j) => j.status === 'success');
  const hasWarning = jobs.some((j) => j.status === 'warning');
  const hasFailed = jobs.some((j) => j.status === 'failed');

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <HardDrive className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Backups (Duplicati)</h3>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            className={`text-xs border-0 ${hasFailed ? statusBadge.failed : hasWarning ? statusBadge.warning : jobs.length > 0 ? statusBadge.success : statusBadge.pending}`}
          >
            {hasFailed ? 'FALHA' : hasWarning ? 'ATENÇÃO' : jobs.length > 0 ? 'OK' : '—'}
          </Badge>
          {duplicatiUrl && (
            <Button variant="ghost" size="icon" className="h-6 w-6" asChild>
              <a href={duplicatiUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          )}
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground text-center py-4">Carregando backups...</p>
      ) : jobs.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">Nenhum backup encontrado</p>
      ) : (
        <>
          <div className="space-y-3">
            {jobs.map((job) => (
              <div key={job.name} className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  {statusIcon(job.status)}
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{job.name}</p>
                    <p className="text-xs text-muted-foreground">{job.lastRun}</p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  {job.size && <p className="text-xs text-muted-foreground">{job.size}</p>}
                  <Badge className={`text-xs border-0 ${statusBadge[job.status]}`}>
                    {job.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 pt-3 border-t">
            Próximo: {jobs[0]?.nextRun || '—'}
          </p>
        </>
      )}
    </Card>
  );
}
