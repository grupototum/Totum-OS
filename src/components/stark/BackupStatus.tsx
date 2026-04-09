import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HardDrive, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface BackupJob {
  name: string;
  lastRun: string;
  status: 'success' | 'warning' | 'failed' | 'pending';
  size?: string;
  nextRun?: string;
}

// Mock data – em produção viria da API do Duplicati
const MOCK_BACKUPS: BackupJob[] = [
  { name: 'Banco de Dados', lastRun: '2026-04-08 03:00', status: 'success', size: '2.1 GB', nextRun: '2026-04-09 03:00' },
  { name: 'Arquivos App', lastRun: '2026-04-08 03:15', status: 'success', size: '450 MB', nextRun: '2026-04-09 03:15' },
  { name: 'Configurações', lastRun: '2026-04-07 02:00', status: 'warning', size: '12 MB', nextRun: '2026-04-09 02:00' },
];

const statusIcon = (status: BackupJob['status']) => {
  if (status === 'success') return <CheckCircle className="h-4 w-4 text-green-500" />;
  if (status === 'failed') return <AlertCircle className="h-4 w-4 text-red-500" />;
  if (status === 'warning') return <AlertCircle className="h-4 w-4 text-yellow-500" />;
  return <Clock className="h-4 w-4 text-muted-foreground" />;
};

const statusBadge: Record<BackupJob['status'], string> = {
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700',
  pending: 'bg-gray-100 text-gray-600',
};

export default function BackupStatus() {
  const [jobs] = useState<BackupJob[]>(MOCK_BACKUPS);

  const allOk = jobs.every(j => j.status === 'success');
  const hasWarning = jobs.some(j => j.status === 'warning');
  const hasFailed = jobs.some(j => j.status === 'failed');

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <HardDrive className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Backups (Duplicati)</h3>
        </div>
        <Badge className={`text-xs border-0 ${hasFailed ? statusBadge.failed : hasWarning ? statusBadge.warning : statusBadge.success}`}>
          {hasFailed ? 'FALHA' : hasWarning ? 'ATENÇÃO' : 'OK'}
        </Badge>
      </div>
      <div className="space-y-3">
        {jobs.map(job => (
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
    </Card>
  );
}
