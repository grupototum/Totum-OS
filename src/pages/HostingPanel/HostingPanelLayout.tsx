import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePageTransition } from '@/hooks/usePageTransition';
import { LoadingSpinner } from '@/components/loading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Container, DollarSign, Shield, Users } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
import { PageHeader } from '@/components/ui/patterns';
import { useAuth } from '@/contexts/AuthContext';
import {
  ClientsTab,
  SubdomainsTab,
  ContainersTab,
  BillingTab,
  AuditTab,
} from './components';

export default function HostingPanelLayout() {
  const { user, loading: authLoading } = useAuth();
  const pageTransition = usePageTransition();

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = '/login';
    }
  }, [user, authLoading]);

  if (authLoading)
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-screen">
          <LoadingSpinner size="lg" message="Carregando Painel..." />
        </div>
      </AppLayout>
    );

  return (
    <AppLayout>
      <motion.div {...pageTransition} className="p-4 sm:p-6 space-y-6 min-h-screen">
        {/* Header */}
        <PageHeader
          eyebrow="Infraestrutura"
          title="Painel de Hosting"
          description="Gerencie clientes, subdomínios, containers, faturamento e permissões em um console único."
          icon={Container}
          actions={
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_hsl(var(--primary)/0.5)]" />
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                Sistema Ativo
              </span>
            </div>
          }
        />

        {/* Tabs */}
        <Tabs defaultValue="clients" className="space-y-5">
          <div className="border border-border bg-card overflow-hidden">
            <TabsList className="bg-transparent border-none rounded-none w-full justify-start gap-0 h-auto p-0">
              {[
                { value: 'clients', icon: Users, label: 'Clientes' },
                { value: 'subdomains', icon: Globe, label: 'Subdomínios' },
                {
                  value: 'containers',
                  icon: Container,
                  label: 'Containers',
                },
                { value: 'billing', icon: DollarSign, label: 'Faturamento' },
                { value: 'audit', icon: Shield, label: 'Permissões' },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-none border-r border-border last:border-r-0 px-5 py-3 text-[10px] font-mono uppercase tracking-widest text-muted-foreground data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:text-foreground hover:bg-muted transition-colors flex items-center gap-2"
                >
                  <tab.icon className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="clients">
            <ClientsTab />
          </TabsContent>
          <TabsContent value="subdomains">
            <SubdomainsTab />
          </TabsContent>
          <TabsContent value="containers">
            <ContainersTab />
          </TabsContent>
          <TabsContent value="billing">
            <BillingTab />
          </TabsContent>
          <TabsContent value="audit">
            <AuditTab />
          </TabsContent>
        </Tabs>
      </motion.div>
    </AppLayout>
  );
}
