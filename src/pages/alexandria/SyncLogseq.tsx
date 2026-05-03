import AppLayout from '@/components/layout/AppLayout';
import { PageBreadcrumb } from '@/components/navigation/PageBreadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FolderOpen, RefreshCw, CheckCircle2, XCircle, SkipForward, Loader2, Clock, FileText } from 'lucide-react';
import { useLogseqSync } from '@/hooks/useLogseqSync';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const STATUS_LABELS: Record<string, string> = {
  idle:    'Pronto',
  picking: 'Aguardando seleção...',
  reading: 'Lendo arquivos...',
  syncing: 'Sincronizando...',
  done:    'Concluído',
  error:   'Erro',
};

export default function SyncLogseq() {
  const { status, progress, lastRun, error, graphName, runSync, reset } = useLogseqSync();
  const isBusy = status === 'picking' || status === 'reading' || status === 'syncing';
  const pct = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;

  return (
    <AppLayout>
      <PageBreadcrumb />
      <div className="space-y-6 p-4 sm:p-6">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Sync Logseq</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Importe páginas do seu graph Logseq para a Alexandria via File System Access API
            </p>
          </div>
          {status === 'done' || status === 'error' ? (
            <Button variant="outline" size="sm" onClick={reset}>
              <RefreshCw className="h-4 w-4 mr-2" />Novo sync
            </Button>
          ) : null}
        </div>

        {/* Como funciona */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 text-sm space-y-1">
            <p className="font-medium">Como funciona</p>
            <ol className="list-decimal list-inside space-y-0.5 text-muted-foreground">
              <li>Clique em "Sincronizar agora" e selecione a pasta raiz do seu graph Logseq</li>
              <li>O app lê todos os <code className="font-mono text-xs bg-muted px-1 rounded">.md</code> de <code className="font-mono text-xs bg-muted px-1 rounded">/pages</code></li>
              <li>Documentos novos ou alterados são ingeridos na Alexandria com embedding vetorial</li>
              <li>Documentos sem alteração (hash igual) são ignorados automaticamente</li>
            </ol>
            <p className="text-xs text-muted-foreground pt-1">Requer Chrome ou Edge (File System Access API).</p>
          </CardContent>
        </Card>

        {/* Action */}
        {status === 'idle' && (
          <Button onClick={runSync} size="lg" className="gap-2">
            <FolderOpen className="h-5 w-5" />
            Sincronizar agora
          </Button>
        )}

        {/* Progress */}
        {isBusy && (
          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{STATUS_LABELS[status]}</p>
                  {graphName && (
                    <p className="text-xs text-muted-foreground truncate">Graph: {graphName}</p>
                  )}
                </div>
                <Badge variant="outline">{STATUS_LABELS[status]}</Badge>
              </div>
              {progress.total > 0 && (
                <>
                  <Progress value={pct} />
                  <p className="text-xs text-muted-foreground">
                    {progress.current}/{progress.total} — {progress.label}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Error */}
        {status === 'error' && error && (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-destructive">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {lastRun && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Total', value: lastRun.total, color: '' },
                { label: 'Ingeridos', value: lastRun.success, color: 'text-emerald-600' },
                { label: 'Ignorados', value: lastRun.skipped, color: 'text-muted-foreground' },
                { label: 'Erros', value: lastRun.error, color: lastRun.error > 0 ? 'text-destructive' : '' },
              ].map(s => (
                <Card key={s.label}>
                  <CardContent className="p-4">
                    <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Concluído em {(lastRun.duration_ms / 1000).toFixed(1)}s
            </p>

            <Card>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm">Log de documentos ({lastRun.entries.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-96 overflow-y-auto divide-y">
                  {lastRun.entries.map((e, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30">
                      {e.status === 'success'
                        ? <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                        : e.status === 'error'
                        ? <XCircle className="h-4 w-4 shrink-0 text-destructive" />
                        : <SkipForward className="h-4 w-4 shrink-0 text-muted-foreground" />
                      }
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{e.document_title}</p>
                        {e.error_message && (
                          <p className="text-xs text-destructive">{e.error_message}</p>
                        )}
                        <p className="text-xs text-muted-foreground font-mono truncate">{e.source_path}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`text-[10px] shrink-0 ${
                          e.status === 'success' ? 'text-emerald-600 border-emerald-200' :
                          e.status === 'error' ? 'text-destructive border-destructive/20' :
                          'text-muted-foreground'
                        }`}
                      >
                        {e.status === 'success' ? 'ok' : e.status === 'skipped' ? 'sem alteração' : 'erro'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
