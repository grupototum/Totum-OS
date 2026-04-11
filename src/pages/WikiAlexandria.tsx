import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Search, BookOpen, Tag, FileText, Database, Server, Users, Settings, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { searchGiles, listDomains, GilesChunk } from '@/services/giles';

const DOMAIN_ICONS: Record<string, React.ReactNode> = {
  'Infraestrutura': <Server className="w-4 h-4" />,
  'Desenvolvimento': <Database className="w-4 h-4" />,
  'Negocios': <Users className="w-4 h-4" />,
  'Marketing': <Tag className="w-4 h-4" />,
  'Operacoes': <Settings className="w-4 h-4" />,
  'Pessoal': <Users className="w-4 h-4" />,
};

const DOMAIN_COLORS: Record<string, string> = {
  'Infraestrutura': 'bg-blue-100 text-blue-800',
  'Desenvolvimento': 'bg-green-100 text-green-800',
  'Negocios': 'bg-purple-100 text-purple-800',
  'Marketing': 'bg-pink-100 text-pink-800',
  'Operacoes': 'bg-orange-100 text-orange-800',
  'Pessoal': 'bg-teal-100 text-teal-800',
};

export default function WikiAlexandria() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<GilesChunk[]>([]);
  const [domains, setDomains] = useState<string[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [selectedChunk, setSelectedChunk] = useState<GilesChunk | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Carregar domínios ao montar
  useEffect(() => {
    loadDomains();
  }, []);

  const loadDomains = async () => {
    const doms = await listDomains();
    setDomains(doms);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    const searchResults = await searchGiles(searchQuery, {
      dominio: selectedDomain || undefined,
      limit: 20
    });
    setResults(searchResults);
    setIsLoading(false);
  };

  const handleDomainFilter = async (domain: string) => {
    setSelectedDomain(domain === selectedDomain ? null : domain);
    if (searchQuery) {
      setIsLoading(true);
      const searchResults = await searchGiles(searchQuery, {
        dominio: domain === selectedDomain ? undefined : domain,
        limit: 20
      });
      setResults(searchResults);
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <AppLayout>
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-amber-100 rounded-xl">
              <BookOpen className="w-8 h-8 text-amber-700" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Wiki Alexandria</h1>
              <p className="text-slate-600">Biblioteca Central de Conhecimento da Totum</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="mb-6 shadow-lg">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Buscar na Alexandria... (ex: 'POP deploy', 'arquitetura API')"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 h-12 text-lg"
                />
              </div>
              <Button 
                onClick={handleSearch}
                disabled={isLoading}
                className="h-12 px-8 bg-amber-600 hover:bg-amber-700"
              >
                {isLoading ? 'Buscando...' : 'Buscar'}
              </Button>
            </div>

            {/* Domain Filters */}
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-sm text-slate-500 mr-2">Filtrar por domínio:</span>
              {domains.map((domain) => (
                <button
                  key={domain}
                  onClick={() => handleDomainFilter(domain)}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-all ${
                    selectedDomain === domain
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {DOMAIN_ICONS[domain] || <FileText className="w-3 h-3" />}
                  {domain}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Results List */}
          <div className="lg:col-span-1">
            <Card className="h-[600px] shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Resultados {results.length > 0 && `(${results.length})`}
                </CardTitle>
              </CardHeader>
              <ScrollArea className="h-[520px]">
                <div className="px-4 pb-4 space-y-3">
                  {results.length === 0 ? (
                    <div className="text-center py-12 text-slate-400">
                      <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Faça uma busca para encontrar conhecimento na Alexandria</p>
                    </div>
                  ) : (
                    results.map((chunk) => (
                      <button
                        key={chunk.id}
                        onClick={() => setSelectedChunk(chunk)}
                        className={`w-full text-left p-3 rounded-lg transition-all ${
                          selectedChunk?.id === chunk.id
                            ? 'bg-amber-100 border-amber-300 border'
                            : 'bg-slate-50 hover:bg-slate-100 border border-transparent'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <Badge className={DOMAIN_COLORS[chunk.dominio] || 'bg-gray-100'}>
                            {chunk.dominio}
                          </Badge>
                          <span className="text-xs text-slate-400">
                            {formatDate(chunk.created_at)}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 line-clamp-3">
                          {chunk.content.substring(0, 120)}...
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {chunk.tags?.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-xs text-slate-500 bg-slate-200 px-2 py-0.5 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </ScrollArea>
            </Card>
          </div>

          {/* Detail View */}
          <div className="lg:col-span-2">
            <Card className="h-[600px] shadow-lg">
              {selectedChunk ? (
                <>
                  <CardHeader className="pb-3 border-b">
                    <div className="flex items-start justify-between">
                      <div>
                        <Badge className={`mb-2 ${DOMAIN_COLORS[selectedChunk.dominio]}`}>
                          {selectedChunk.dominio} → {selectedChunk.categoria}
                        </Badge>
                        <CardTitle className="text-xl">
                          {selectedChunk.subcategoria || selectedChunk.categoria}
                        </CardTitle>
                      </div>
                      <div className="text-right text-sm text-slate-500">
                        <p>Por: {selectedChunk.autor}</p>
                        <p>{formatDate(selectedChunk.created_at)}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ScrollArea className="h-[480px]">
                      <div className="prose prose-slate max-w-none">
                        <div className="whitespace-pre-wrap text-slate-700 leading-relaxed">
                          {selectedChunk.content}
                        </div>
                      </div>
                      
                      <Separator className="my-6" />
                      
                      {/* Metadata */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900 mb-2">Tags</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedChunk.tags?.map((tag) => (
                              <Badge key={tag} variant="secondary">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-semibold text-slate-900 mb-2">Fonte</h4>
                          <p className="text-sm text-slate-600 font-mono bg-slate-100 p-2 rounded">
                            {selectedChunk.source_file}
                          </p>
                        </div>

                        {selectedChunk.confianca && (
                          <div>
                            <h4 className="text-sm font-semibold text-slate-900 mb-2">Confiança</h4>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-slate-200 rounded-full h-2">
                                <div 
                                  className="bg-green-500 h-2 rounded-full"
                                  style={{ width: `${selectedChunk.confianca * 100}%` }}
                                />
                              </div>
                              <span className="text-sm text-slate-600">
                                {(selectedChunk.confianca * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">
                  <div className="text-center">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg">Selecione um resultado para ver os detalhes</p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Quick Access */}
        <Card className="mt-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Acesso Rápido por Domínio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {domains.map((domain) => (
                <button
                  key={domain}
                  onClick={() => {
                    setSelectedDomain(domain);
                    setSearchQuery('');
                    handleSearch();
                  }}
                  className="p-4 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 transition-all text-center group"
                >
                  <div className="mb-2 text-slate-400 group-hover:text-amber-600 transition-colors">
                    {DOMAIN_ICONS[domain] || <BookOpen className="w-8 h-8 mx-auto" />}
                  </div>
                  <p className="text-sm font-medium text-slate-700 group-hover:text-amber-800">
                    {domain}
                  </p>
                  <ChevronRight className="w-4 h-4 mx-auto mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </AppLayout>
  );
}
