import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Server, Activity, RefreshCw } from 'lucide-react';

interface ServiceStatus {
  name: string;
  url: string;
  status: 'online' | 'offline' | 'checking';
  latency?: number;
  lastChecked: Date;
}

// Serviços monitorados - usar HTTPS ou deixar vazio para evitar Mixed Content
const SERVICES = [
  // { name: 'Beszel', url: import.meta.env.VITE_BESZEL_URL },
  // { name: 'Uptime Kuma', url: import.meta.env.VITE_UPTIME_KUMA_URL },
].filter(s => s?.url);

export default function ServerStatus() {
  const [services, setServices] = useState<ServiceStatus[]>(
    SERVICES.map(s => ({ ...s, status: 'checking', lastChecked: new Date() }))
  );

  const checkServices = async () => {
    setServices(prev => prev.map(s => ({ ...s, status: 'checking' })));

    const updated = await Promise.all(
      SERVICES.map(async (svc) => {
        const start = Date.now();
        try {
          await fetch(svc.url, { mode: 'no-cors', signal: AbortSignal.timeout(3000) });
          return { ...svc, status: 'online' as const, latency: Date.now() - start, lastChecked: new Date() };
        } catch {
          return { ...svc, status: 'offline' as const, latency: undefined, lastChecked: new Date() };
        }
      })
    );
    setServices(updated);
  };

  useEffect(() => { checkServices(); }, []);

  const statusColor = (s: ServiceStatus['status']) =>
    s === 'online' ? 'bg-green-500' : s === 'offline' ? 'bg-red-500' : 'bg-yellow-500';

  const statusBadge = (s: ServiceStatus['status']) =>
    s === 'online' ? 'bg-green-500/15 text-green-400' : s === 'offline' ? 'bg-red-500/15 text-red-400' : 'bg-yellow-500/15 text-yellow-400';

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Server className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Servidores</h3>
        </div>
        <button onClick={checkServices} className="text-muted-foreground hover:text-foreground transition-colors">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-3">
        {services.map(svc => (
          <div key={svc.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${statusColor(svc.status)} ${svc.status === 'online' ? 'animate-pulse' : ''}`} />
              <span className="text-sm font-medium">{svc.name}</span>
            </div>
            <div className="flex items-center gap-2">
              {svc.latency && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Activity className="h-3 w-3" />{svc.latency}ms
                </span>
              )}
              <Badge className={`text-xs border-0 ${statusBadge(svc.status)}`}>
                {svc.status === 'checking' ? '...' : svc.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
