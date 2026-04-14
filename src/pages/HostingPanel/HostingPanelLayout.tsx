import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePageTransition } from '@/hooks/usePageTransition';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Globe, Container, DollarSign, Shield, Users } from 'lucide-react';
import AppLayout from '@/components/layout/AppLayout';
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
      <div className="flex items-center justify-center h-screen bg-black text-zinc-600 font-mono text-xs uppercase tracking-wider">
        Carregando...
      </div>
    );

  return (
    <AppLayout>
      <motion.div {...pageTransition} className="p-6 space-y-6 bg-black min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="grid grid-cols-2 w-8 h-8 gap-0.5">
              <div className="bg-[#ef233c] w-full h-full rounded-sm" />
              <div className="bg-zinc-700 w-full h-full rounded-sm" />
              <div className="bg-zinc-800 w-full h-full rounded-sm" />
              <div className="bg-white w-full h-full rounded-sm shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
            </div>
            <div>
              <h1 className="text-2xl font-medium text-white tracking-tight font-sans">
                Painel de Hosting
              </h1>
              <p className="text-xs text-zinc-500 font-mono uppercase tracking-wider mt-0.5">
                Infraestrutura & Gerenciamento
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#ef233c] animate-pulse shadow-[0_0_10px_rgba(239,35,60,0.5)]" />
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
              Sistema Ativo
            </span>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="clients" className="space-y-5">
          <div className="border border-zinc-800 rounded-none bg-black overflow-hidden">
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
                  className="rounded-none border-r border-zinc-800 last:border-r-0 px-5 py-3 text-[10px] font-mono uppercase tracking-widest text-zinc-500 data-[state=active]:bg-white/[0.03] data-[state=active]:text-[#ef233c] data-[state=active]:border-b-2 data-[state=active]:border-b-[#ef233c] hover:text-white hover:bg-white/[0.02] transition-colors flex items-center gap-2"
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
