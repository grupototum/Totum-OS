import React, { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FolderOpen, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';

const GOOGLE_DRIVE_EMBED_URL = 'https://drive.google.com/embeddedfolderview?id=root#list';
const GOOGLE_OAUTH_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export default function GoogleDriveEmbed() {
  const [isConnected, setIsConnected] = useState(false);
  const [folderId, setFolderId] = useState('root');
  const [isLoading, setIsLoading] = useState(false);

  const handleConnect = () => {
    if (!GOOGLE_OAUTH_CLIENT_ID) {
      alert('Configure VITE_GOOGLE_CLIENT_ID no .env para usar o Google Drive.');
      return;
    }

    const params = new URLSearchParams({
      client_id: GOOGLE_OAUTH_CLIENT_ID,
      redirect_uri: `${window.location.origin}/auth/google/callback`,
      response_type: 'token',
      scope: 'https://www.googleapis.com/auth/drive.readonly',
      include_granted_scopes: 'true',
    });

    window.open(`https://accounts.google.com/o/oauth2/v2/auth?${params}`, '_blank', 'width=500,height=600');
  };

  const embedUrl = `https://drive.google.com/embeddedfolderview?id=${folderId}#list`;

  return (
    <AppLayout>
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <FolderOpen className="h-6 w-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Google Drive</h1>
            <p className="text-sm text-muted-foreground">Arquivos da empresa sincronizados</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={isConnected ? 'bg-green-500/15 text-green-400 border-0' : 'bg-zinc-800 text-zinc-400 border-0'}>
            {isConnected ? '🟢 Conectado' : '⚪ Desconectado'}
          </Badge>
          <Button variant="outline" size="sm" onClick={() => setIsLoading(l => !l)}>
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button size="sm" asChild>
            <a href="https://drive.google.com" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-1" />Abrir Drive
            </a>
          </Button>
        </div>
      </div>

      {!isConnected ? (
        <Card className="p-8 text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-blue-500/10 rounded-full flex items-center justify-center">
            <FolderOpen className="h-8 w-8 text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Conectar Google Drive</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Acesse os arquivos da empresa diretamente pelo Apps Totum.
            </p>
          </div>
          {!GOOGLE_OAUTH_CLIENT_ID && (
            <div className="flex items-center gap-2 justify-center text-yellow-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>Configure <code className="bg-amber-500/10 px-1 rounded">VITE_GOOGLE_CLIENT_ID</code> no .env</span>
            </div>
          )}
          <Button onClick={() => setIsConnected(true)} className="mx-auto">
            Conectar via Google OAuth2
          </Button>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <iframe
            src={embedUrl}
            title="Google Drive"
            className="w-full"
            style={{ height: 'calc(100vh - 220px)', minHeight: '500px', border: 'none' }}
            allow="autoplay"
          />
        </Card>
      )}
    </div>
    </AppLayout>
  );
}
