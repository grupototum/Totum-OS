import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ServerStatus from '@/components/stark/ServerStatus';
import BackupStatus from '@/components/stark/BackupStatus';
import DatabaseStatus from '@/components/stark/DatabaseStatus';
import SyncButton from '@/components/stark/SyncButton';
import { Shield, Activity, Cpu, Zap } from 'lucide-react';

export default function StarkIndustries() {
  const [lastSyncSuccess, setLastSyncSuccess] = useState<boolean | null>(null);

  return (
    <div className="p-6 space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Stark Industries</h1>
              <p className="text-sm text-muted-foreground">Centro de controle de infraestrutura Totum</p>
            </div>
          </div>
        </div>
        <Badge
          className={`text-sm px-3 py-1 border-0 ${lastSyncSuccess === null ? 'bg-muted text-muted-foreground' : lastSyncSuccess ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
        >
          {lastSyncSuccess === null ? '— Aguardando sync' : lastSyncSuccess ? '✅ Sistema sincronizado' : '❌ Erro na sync'}
        </Badge>
      </div>

      {/* MEX STATUS — destaque */}
      <Card className="p-5 border-primary/30 bg-primary/5">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="h-5 w-5 text-primary" />
          <h2 className="font-semibold text-lg">MEX Status</h2>
          <Badge className="bg-primary/10 text-primary border-0 text-xs">Live</Badge>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'CPU VPS', value: '23%', icon: Cpu, color: 'text-green-600' },
            { label: 'RAM', value: '4.2 GB', icon: Activity, color: 'text-blue-600' },
            { label: 'Uptime', value: '99.8%', icon: Shield, color: 'text-green-600' },
            { label: 'Req/min', value: '142', icon: Zap, color: 'text-amber-600' },
          ].map(item => (
            <div key={item.label} className="bg-background rounded-lg p-3 text-center">
              <item.icon className={`h-5 w-5 mx-auto mb-1 ${item.color}`} />
              <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{item.label}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Grid de Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ServerStatus />
        <BackupStatus />
        <DatabaseStatus />
      </div>

      {/* Forçar Sync */}
      <Card className="p-5 max-w-sm">
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Zap className="h-4 w-4 text-primary" />
          Controles
        </h3>
        <SyncButton onSyncComplete={setLastSyncSuccess} />
      </Card>
    </div>
  );
}
