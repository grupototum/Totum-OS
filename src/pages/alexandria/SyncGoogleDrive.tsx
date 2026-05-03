import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { PageBreadcrumb } from '@/components/navigation/PageBreadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  LogIn, LogOut, FolderOpen, RefreshCw, CheckCircle2,
  XCircle, SkipForward, Loader2, Clock, AlertCircle,
} from 'lucide-react';
import { useGoogleDriveSync } from '@/hooks/useGoogleDriveSync';
import type { DriveFile } from '@/lib/drive';

const CLIENT_ID_SET = !!import.meta.env.VITE_GOOGLE_DRIVE_CLIENT_ID;

export default function SyncGoogleDrive() {
  const {
    authenticated, status, files, progress, lastRun, error,
    login, logout, listFolder, syncFiles,
  } = useGoogleDriveSync();

  const [folderId, setFolderId] = useState('root');
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const isBusy = status === 'auth' || status === 'listing' || status === 'syncing';
  const pct = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;

  const toggleAll = () => {
    if (selected.size === files.length) setSelected(new Set());
    else setSelected(new Set(files.map(f => f.id)));
  };

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const handleSync = () => syncFiles(files.filter(f => selected.has(f.id)));

  if (!CLIENT_ID_SET) {
    return (
      <AppLayout>
        <PageBreadcrumb />
        <div className="p-4 sm:p-6 flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-md w-full">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-amber-600">
                <AlertCircle className="h-5 w-5" />
                <p className="font-semibold">Configuração necessária</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Para usar o sync com Google Drive, adicione seu OAuth Client ID no arquivo{' '}
                <code className="font-mono text-xs bg-muted px-1 rounded">.env.local</code>:
              </p>
              <pre className="text-xs bg-muted rounded p-3 font-mono">
                VITE_GOOGLE_DRIVE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
              </pre>
              <p className="text-xs text-muted-foreground">
                Crie o Client ID em{' '}
                <strong>Google Cloud Console → APIs &amp; Services → Credentials → OAuth 2.0 Client IDs</strong>.
                Tipo: <em>Web application</em>. Adicione{' '}
                <code className="font-mono text-xs bg-muted px-1 rounded">http://localhost:8080</code> e{' '}
                <code className="font-mono text-xs bg-muted px-1 rounded">https://app.grupototum.com</code> em
                Authorized JavaScript origins.
              </p>
            </CardContent>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <PageBreadcrumb />
      <div className="space-y-6 p-4 sm:p-6">

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Sync Google Drive</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Importe Google Docs e arquivos de texto do Drive para a Alexandria
            </p>
          </div>
          {authenticated && (
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />Sair
            </Button>
          )}
        </div>

        {/* Auth */}
        {!authenticated ? (
          <Card>
            <CardContent className="p-6 flex flex-col items-center gap-4 text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <LogIn className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-semibold">Conectar Google Drive</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Autenticação OAuth 2.0 — acesso somente leitura
                </p>
              </div>
              <Button onClick={login} disabled={status === 'auth'}>
                {status === 'auth'
                  ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Autenticando...</>
                  : <><LogIn className="h-4 w-4 mr-2" />Entrar com Google</>
                }
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Folder picker */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <Label className="text-sm font-medium">ID da pasta (deixe "root" para raiz)</Label>
                <div className="flex gap-2">
                  <Input
                    value={folderId}
                    onChange={e => setFolderId(e.target.value)}
                    placeholder="root ou ID da pasta do Drive"
                    className="font-mono text-sm"
                  />
                  <Button
                    variant="outline"
                    onClick={() => listFolder(folderId)}
                    disabled={isBusy}
                  >
                    {status === 'listing'
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <FolderOpen className="h-4 w-4" />
                    }
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Apenas Google Docs, .md e .txt são suportados. PDFs e planilhas são ignorados.
                </p>
              </CardContent>
            </Card>

            {/* File list */}
            {files.length > 0 && (
              <Card>
                <CardHeader className="py-3 px-4 flex-row items-center justify-between">
                  <CardTitle className="text-sm">{files.length} arquivos encontrados</CardTitle>
                  <Button variant="ghost" size="sm" onClick={toggleAll} className="text-xs">
                    {selected.size === files.length ? 'Desmarcar todos' : 'Selecionar todos'}
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-72 overflow-y-auto divide-y">
                    {files.map(f => (
                      <div
                        key={f.id}
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30 cursor-pointer"
                        onClick={() => toggle(f.id)}
                      >
                        <Checkbox checked={selected.has(f.id)} onCheckedChange={() => toggle(f.id)} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{f.name}</p>
                          <p className="text-xs text-muted-foreground">{new Date(f.modifiedTime).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Progress */}
            {status === 'syncing' && (
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <p className="text-sm font-medium">Sincronizando {progress.label}...</p>
                  </div>
                  <Progress value={pct} />
                  <p className="text-xs text-muted-foreground">{progress.current}/{progress.total}</p>
                </CardContent>
              </Card>
            )}

            {/* Action */}
            {(status === 'idle' || status === 'done') && files.length > 0 && (
              <Button
                onClick={handleSync}
                disabled={selected.size === 0}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Sincronizar {selected.size} arquivo(s)
              </Button>
            )}
          </>
        )}

        {/* Error */}
        {error && (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardContent className="p-4 text-sm text-destructive">{error}</CardContent>
          </Card>
        )}

        {/* Results */}
        {lastRun && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Total', value: lastRun.total },
                { label: 'Ingeridos', value: lastRun.success, color: 'text-emerald-600' },
                { label: 'Ignorados', value: lastRun.skipped },
                { label: 'Erros', value: lastRun.error, color: lastRun.error > 0 ? 'text-destructive' : '' },
              ].map(s => (
                <Card key={s.label}>
                  <CardContent className="p-4">
                    <p className={`text-2xl font-bold ${s.color || ''}`}>{s.value}</p>
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
                <CardTitle className="text-sm">Log ({lastRun.entries.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-80 overflow-y-auto divide-y">
                  {lastRun.entries.map((e, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-2.5">
                      {e.status === 'success' ? <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        : e.status === 'error' ? <XCircle className="h-4 w-4 text-destructive shrink-0" />
                        : <SkipForward className="h-4 w-4 text-muted-foreground shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm truncate">{e.file_name}</p>
                        {e.error_message && <p className="text-xs text-destructive">{e.error_message}</p>}
                      </div>
                      <Badge variant="outline" className="text-[10px] shrink-0">
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
