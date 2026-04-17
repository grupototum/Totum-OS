import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { usePageTransition } from '@/hooks/usePageTransition';
import AppLayout from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ServerStatus from '@/components/stark/ServerStatus';
import BackupStatus from '@/components/stark/BackupStatus';
import DatabaseStatus from '@/components/stark/DatabaseStatus';
import SyncButton from '@/components/stark/SyncButton';
import { Shield, Activity, Cpu, Zap, AlertCircle } from 'lucide-react';
import { OPENCLAW_CONFIG } from '@/config/openclaw';

// ─── Types ────────────────────────────────────────────────────────────────────

interface HealthData {
  status?: string;
  uptime?: number;
  memory?: { used?: number; total?: number; usedMB?: number; totalMB?: number };
  cpu?: number | { usage?: number };
  requests_per_minute?: number;
}

interface VpsMetrics {
  online: boolean;
  loading: boolean;
  cpu: string;
  ram: string;
  uptime: string;
  reqPerMin: string;
  lastChecked: Date | null;
  error: string | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseCpu(health: HealthData): string {
  if (typeof health.cpu === 'number') return `${health.cpu.toFixed(1)}%`;
  if (typeof health.cpu === 'object' && health.cpu?.usage !== undefined)
    return `${health.cpu.usage.toFixed(1)}%`;
  return 'N/D';
}

function parseRam(health: HealthData): string {
  const mem = health.memory;
  if (!mem) return 'N/D';
  if (mem.usedMB !== undefined) return `${mem.usedMB} MB`;
  if (mem.used !== undefined && mem.used > 1024 * 1024)
    return `${(mem.used / 1024 / 1024).toFixed(0)} MB`;
  if (mem.used !== undefined) return `${mem.used} B`;
  return 'N/D';
}

function parseUptime(seconds: number): string {
  if (seconds < 60) return `${Math.floor(seconds)}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  }
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  return `${d}d ${h}h`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function StarkIndustries() {
  const pageTransition = usePageTransition();
  const [lastSyncSuccess, setLastSyncSuccess] = useState<boolean | null>(null);

  const [metrics, setMetrics] = useState<VpsMetrics>({
    online: false,
    loading: true,
    cpu: '—',
    ram: '—',
    uptime: '—',
    reqPerMin: '—',
    lastChecked: null,
    error: null,
  });

  const isMockMode = OPENCLAW_CONFIG.MOCK_MODE;

  const fetchHealth = useCallback(async () => {
    if (isMockMode) {
      setMetrics((prev) => ({
        ...prev,
        online: false,
        loading: false,
        cpu: '—',
        ram: '—',
        uptime: '—',
        reqPerMin: '—',
        lastChecked: new Date(),
        error: 'VPS não configurada',
      }));
      return;
    }

    setMetrics((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const response = await fetch(`${OPENCLAW_CONFIG.VPS_URL}${OPENCLAW_CONFIG.HEALTH_PATH}`, {
        headers: {
          Authorization: `Bearer ${OPENCLAW_CONFIG.AUTH_TOKEN}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data: HealthData = await response.json();

      setMetrics({
        online: true,
        loading: false,
        cpu: parseCpu(data),
        ram: parseRam(data),
        uptime: data.uptime !== undefined ? parseUptime(data.uptime) : 'N/D',
        reqPerMin:
          data.requests_per_minute !== undefined
            ? String(data.requests_per_minute)
            : 'N/D',
        lastChecked: new Date(),
        error: null,
      });
    } catch (err) {
      setMetrics({
        online: false,
        loading: false,
        cpu: '—',
        ram: '—',
        uptime: '—',
        reqPerMin: '—',
        lastChecked: new Date(),
        error: err instanceof Error ? err.message : 'Connection failed',
      });
    }
  }, [isMockMode]);

  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30_000);
    return () => clearInterval(interval);
  }, [fetchHealth]);

  const isOffline = !metrics.loading && !metrics.online;

  const metricItems = [
    { label: 'CPU VPS', value: metrics.loading ? '…' : metrics.cpu, icon: Cpu, color: isOffline ? 'text-slate-400' : 'text-green-600' },
    { label: 'RAM', value: metrics.loading ? '…' : metrics.ram, icon: Activity, color: isOffline ? 'text-slate-400' : 'text-blue-600' },
    { label: 'Uptime', value: metrics.loading ? '…' : metrics.uptime, icon: Shield, color: isOffline ? 'text-slate-400' : 'text-green-600' },
    { label: 'Req/min', value: metrics.loading ? '…' : metrics.reqPerMin, icon: Zap, color: isOffline ? 'text-slate-400' : 'text-amber-600' },
  ];

  return (
    <AppLayout>
      <motion.div {...pageTransition} className="p-6 space-y-6">
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
            className={`text-sm px-3 py-1 border-0 ${
              lastSyncSuccess === null
                ? 'bg-muted text-muted-foreground'
                : lastSyncSuccess
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {lastSyncSuccess === null
              ? '— Aguardando sync'
              : lastSyncSuccess
              ? '✅ Sistema sincronizado'
              : '❌ Erro na sync'}
          </Badge>
        </div>

        {/* MEX STATUS */}
        <Card className="p-5 border-primary/30 bg-primary/5">
          <div className="flex items-center gap-2 mb-1">
            <Activity className="h-5 w-5 text-primary" />
            <h2 className="font-semibold text-lg">MEX Status</h2>
            <Badge className={`border-0 text-xs ${isOffline ? 'bg-slate-200 text-slate-500' : 'bg-primary/10 text-primary'}`}>
              {metrics.loading ? 'Carregando…' : metrics.online ? 'Live' : 'Offline'}
            </Badge>
            {isOffline && (
              <span className="ml-auto flex items-center gap-1 text-xs text-slate-500">
                <AlertCircle size={13} />
                VPS offline
              </span>
            )}
          </div>

          {metrics.lastChecked && (
            <p className="text-xs text-muted-foreground mb-3">
              Atualizado às {metrics.lastChecked.toLocaleTimeString('pt-BR')} · auto-refresh 30s
            </p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metricItems.map((item) => (
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
      </motion.div>
    </AppLayout>
  );
}
