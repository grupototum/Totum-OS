import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { PageBreadcrumb } from '@/components/navigation/PageBreadcrumb';
import { useAlexandria } from '@/hooks/useAlexandria';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, BookOpen, FileText, Users, Zap, ExternalLink } from 'lucide-react';
import Dashboard from './Dashboard';
import ContextHub from './ContextHub';

export default function AlexandriaPage() {
  const { data, isLoading, error, refetch } = useAlexandria();
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Carregando Alexandria...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="p-8 text-center max-w-md">
          <p className="text-destructive font-semibold mb-2">Erro ao carregar dados</p>
          <p className="text-sm text-muted-foreground mb-4">
            {error?.message || 'Não foi possível conectar ao Supabase'}
          </p>
          <Button onClick={refetch} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Tentar novamente
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <AppLayout>
      <PageBreadcrumb />
      <div className="space-y-6 p-6">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-primary" />
              Alexandria
            </h1>
            <p className="text-muted-foreground mt-1">
              Central de conhecimento, skills e agentes do ecossistema Totum
            </p>
          </div>
          <Button onClick={refetch} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>

        {/* Tabs principais */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="pops" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">POPs & SLAs</span>
            </TabsTrigger>
            <TabsTrigger value="context" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Context Hub</span>
            </TabsTrigger>
            <TabsTrigger value="skills" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="hidden sm:inline">Skills Center</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-6">
            <Dashboard data={data} />
          </TabsContent>

          <TabsContent value="pops" className="mt-6">
            <div className="flex items-center justify-center min-h-[40vh]">
              <Card className="max-w-md w-full">
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <FileText className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Portal POPs & SLAs</CardTitle>
                  <CardDescription>
                    Gerencie Procedimentos Operacionais Padrão e Acordos de Nível de Serviço do ecossistema Totum.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center pt-4">
                  <Button onClick={() => navigate('/alexandria/pops')} className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Abrir
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="context" className="mt-6">
            <ContextHub agents={data.agents} />
          </TabsContent>

          <TabsContent value="skills" className="mt-6">
            <div className="flex items-center justify-center min-h-[40vh]">
              <Card className="max-w-md w-full">
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10">
                    <Zap className="h-7 w-7 text-amber-500" />
                  </div>
                  <CardTitle className="text-xl">Skills Central</CardTitle>
                  <CardDescription>
                    Explore e gerencie todas as skills disponíveis nos agentes do ecossistema Totum.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center pt-4">
                  <Button onClick={() => navigate('/alexandria/skills')} className="gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Abrir
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
