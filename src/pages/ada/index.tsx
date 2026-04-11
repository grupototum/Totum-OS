import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { 
  Code2, 
  GitBranch, 
  Zap, 
  Cpu, 
  FileCode, 
  Network,
  Loader2,
  Sparkles,
  History
} from 'lucide-react';
import { toast } from 'sonner';

// ADA - Ada Lovelace Code Analyzer
// Integração com Codeflow para análise inteligente de código

interface ParsedFunction {
  id: string;
  name: string;
  file: string;
  type: string;
  line: number;
  return_type: string;
  docstring: string;
  calls: string[];
}

interface Intent {
  id: string;
  name: string;
  handler_fn_id: string;
  type: string;
}

interface ParsedRepo {
  schema_version: string;
  repo: string;
  branch: string;
  functions: ParsedFunction[];
  intents: Intent[];
  file_count: number;
  parsed_at: string;
}

export default function AdaPage() {
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ParsedRepo | null>(null);
  const [history, setHistory] = useState<string[]>([]);

  const parseRepo = async () => {
    if (!repoUrl) {
      toast.error('Digite o repositório para analisar');
      return;
    }

    setLoading(true);
    toast.info('ADA está analisando o código...');

    try {
      // Extrair owner/repo da URL ou usar direto
      const repo = repoUrl.replace('https://github.com/', '').replace('.git', '');
      
      // API call disabled to avoid Mixed Content (HTTPS page calling HTTP API)
      // const response = await fetch('http://187.127.4.140:8002/api/parse', {...});
      
      throw new Error('Serviço temporariamente indisponível. Use a análise local.');
      
      /*
      const response = await fetch('/api/ada/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repo })
      });

      if (!response.ok) throw new Error('Erro na análise');

      const data = await response.json();
      setResult(data);
      setHistory(prev => [repo, ...prev.slice(0, 4)]);
      toast.success('Análise completa! ADA encontrou ' + data.functions?.length + ' funções');
      */
    } catch (error) {
      toast.error('ADA encontrou um problema: ' + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const loadExample = (repo: string) => {
    setRepoUrl(repo);
    toast.info('Repositório carregado. Clique em Analisar!');
  };

  return (
    <AppLayout>
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header ADA */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
            <Cpu className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            ADA
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          <strong>A</strong>na <strong>D</strong>e <strong>A</strong>rquitetura — 
          Em homenagem a Ada Lovelace, a primeira programadora do mundo.
          <br />
          Análise inteligente de código com economia de até 87% de tokens.
        </p>
      </div>

      {/* Input Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            Repositório para Análise
          </CardTitle>
          <CardDescription>
            Digite o repositório GitHub (ex: facebook/react)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Input
              placeholder="owner/repo (ex: grupototum/upixelcrm)"
              value={repoUrl}
              onChange={(e) => setRepoUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && parseRepo()}
              className="flex-1"
            />
            <Button 
              onClick={parseRepo} 
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-pink-600"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analisando...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Analisar com ADA
                </>
              )}
            </Button>
          </div>

          {/* Exemplos rápidos */}
          {history.length > 0 && (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <History className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Recentes:</span>
              {history.map((h, i) => (
                <Badge 
                  key={i} 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-primary/20"
                  onClick={() => loadExample(h)}
                >
                  {h}
                </Badge>
              ))}
            </div>
          )}

          <div className="mt-4 flex gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">Exemplos:</span>
            {['grupototum/upixelcrm', 'facebook/react', 'tiangolo/fastapi'].map(repo => (
              <Badge 
                key={repo} 
                variant="outline" 
                className="cursor-pointer hover:bg-primary/10"
                onClick={() => loadExample(repo)}
              >
                {repo}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Resultados */}
      {result && (
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="functions">Funções ({result.functions?.length || 0})</TabsTrigger>
            <TabsTrigger value="intents">Intenções ({result.intents?.length || 0})</TabsTrigger>
            <TabsTrigger value="raw">JSON Bruto</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Funções</CardTitle>
                  <Code2 className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{result.functions?.length || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Intenções</CardTitle>
                  <Zap className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{result.intents?.length || 0}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">Arquivos</CardTitle>
                  <FileCode className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{result.file_count || 0}</div>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Network className="w-5 h-5" />
                  Call Graph
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Visualização do grafo de chamadas disponível na aba "Funções".
                  <br />
                  Cada função mostra suas chamadas outbound para outras funções.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="functions">
            <div className="space-y-3">
              {result.functions?.slice(0, 50).map((fn) => (
                <Card key={fn.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-mono">{fn.name}</CardTitle>
                      <Badge variant={fn.type === 'route' ? 'default' : 'secondary'}>
                        {fn.type}
                      </Badge>
                    </div>
                    <CardDescription className="font-mono text-xs">
                      {fn.file}:{fn.line}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {fn.docstring && (
                      <p className="text-sm text-muted-foreground mb-2">{fn.docstring}</p>
                    )}
                    {fn.calls?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-muted-foreground">Chama:</span>
                        {fn.calls.slice(0, 5).map((call, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {call.slice(0, 20)}...
                          </Badge>
                        ))}
                        {fn.calls.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{fn.calls.length - 5} mais
                          </Badge>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
              {result.functions?.length > 50 && (
                <p className="text-center text-muted-foreground">
                  ... e mais {result.functions.length - 50} funções
                </p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="intents">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.intents?.map((intent) => (
                <Card key={intent.id}>
                  <CardHeader>
                    <CardTitle className="text-base">{intent.name}</CardTitle>
                    <CardDescription>Tipo: {intent.type}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline">Handler: {intent.handler_fn_id?.slice(0, 20)}...</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="raw">
            <Textarea 
              value={JSON.stringify(result, null, 2)} 
              readOnly 
              className="font-mono text-xs h-[600px]"
            />
          </TabsContent>
        </Tabs>
      )}

      {/* Footer homenagem */}
      <div className="mt-12 text-center text-sm text-muted-foreground">
        <p>
          💜 Em memória de <strong>Ada Lovelace</strong> (1815-1852) — 
          Matemática, escritora e a <em>primeira programadora</em> da história.
        </p>
        <p className="mt-2">
          Powered by <a href="https://github.com/onedownz01/Thirdwheel-codeflow" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Codeflow</a>
        </p>
      </div>
    </div>
    </AppLayout>
  );
}
