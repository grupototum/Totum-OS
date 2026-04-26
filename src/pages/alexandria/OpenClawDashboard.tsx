import { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { PageBreadcrumb } from '@/components/navigation/PageBreadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BarChart3,
  Activity,
  Server,
  Cpu,
  HardDrive,
  Wifi,
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Terminal,
  Settings,
  Shield
} from 'lucide-react';
import { OPENCLAW_CONFIG, isOpenClawBrowserReachable } from '@/config/openclaw';

// ─── Types ────────────────────────────────────────────────────────────────────

interface HealthData {
  status?: string;
  uptime?: number;
  memory?: { used?: number; total?: number; usedMB?: number; totalMB?: number };
  cpu?: number | { usage?: number };
}

interface VpsStatus {
  online: boolean;
  loading: boolean;
  health: HealthData | null;
  error: string | null;
  lastChecked: Date | null;
}

// ─── Static mock data (names & versions stay; status driven by VPS state) ────

const SKILL_DEFINITIONS = [
  { name: 'feishu-calendar', version: '1.2.0' },
  { name: 'feishu-bitable', version: '1.0.5' },
  { name: 'feishu-task', version: '0.9.2' },
  { name: 'wecom-schedule', version: '1.1.0' },
  { name: 'wecom-todo', version: '1.0.0' },
  { name: 'healthcheck', version: '2.0.1' },
];

interface LogEntry {
  time: string;
  level: 'info' | 'warn' | 'error';
  message: string;
}

// Logs são preenchidos dinamicamente quando o gateway está online.
// Em modo mock/disconnected, o painel mostra empty state informativo.

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatUptime(seconds: number): string {
  if (seconds < 60) return `${Math.floor(seconds)}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
  return `${Math.floor(seconds / 86400)}d ${Math.floor((seconds % 86400) / 3600)}h`;
}

function parseCpu(health: HealthData): string {
  if (!health) return 'N/D';
  if (typeof health.cpu === 'number') return `${health.cpu.toFixed(1)}%`;
  if (typeof health.cpu === 'object' && health.cpu?.usage !== undefined)
    return `${health.cpu.usage.toFixed(1)}%`;
  return 'N/D';
}

function parseMemory(health: HealthData): string {
  if (!health) return 'N/D';
  const mem = health.memory;
  if (!mem) return 'N/D';
  // prefer MB fields
  if (mem.usedMB !== undefined) return `${mem.usedMB} MB`;
  if (mem.used !== undefined && mem.used > 1024 * 1024)
    return `${(mem.used / 1024 / 1024).toFixed(0)} MB`;
  if (mem.used !== undefined) return `${mem.used} B`;
  return 'N/D';
}

function parseUptime(health: HealthData): string {
  if (!health || health.uptime === undefined) return 'N/D';
  return formatUptime(health.uptime);
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function OpenClawDashboard() {
  const [vps, setVps] = useState<VpsStatus>({
    online: false,
    loading: true,
    health: null,
    error: null,
    lastChecked: null,
  });

  const isMockMode = OPENCLAW_CONFIG.MOCK_MODE;
  const hasGeminiKey = Boolean(import.meta.env.VITE_GEMINI_API_KEY);

  // Derive skill statuses from VPS state
  const skills = SKILL_DEFINITIONS.map((s) => ({
    ...s,
    status: vps.loading
      ? 'unknown'
      : vps.online
      ? s.name === 'wecom-schedule'
        ? 'inactive'
        : 'active'
      : 'unknown',
  }));

  const activeSkills = skills.filter((s) => s.status === 'active').length;
  const totalSkills = skills.length;

  // ── Health fetch ────────────────────────────────────────────────────────────

  const fetchHealth = useCallback(async () => {
    if (isMockMode || !isOpenClawBrowserReachable()) {
      setVps({
        online: false,
        loading: false,
        health: null,
        error: 'Modo simulado',
        lastChecked: new Date(),
      });
      return;
    }

    setVps((prev) => ({ ...prev, loading: true, error: null }));

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
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      const data: HealthData = await response.json();

      setVps({
        online: true,
        loading: false,
        health: data,
        error: null,
        lastChecked: new Date(),
      });
    } catch (err) {
      setVps({
        online: false,
        loading: false,
        health: null,
        error: err instanceof Error ? err.message : 'Connection failed',
        lastChecked: new Date(),
      });
    }
  }, [isMockMode]);

  // Mount + 30s interval
  useEffect(() => {
    fetchHealth();
    const interval = setInterval(fetchHealth, 30_000);
    return () => clearInterval(interval);
  }, [fetchHealth]);

  // ── Derived display values ───────────────────────────────────────────────────

  const cpuDisplay = vps.online && vps.health ? parseCpu(vps.health) : vps.online ? 'N/D' : '—';
  const memDisplay = vps.online && vps.health ? parseMemory(vps.health) : vps.online ? 'N/D' : '—';
  const uptimeDisplay = vps.online && vps.health ? parseUptime(vps.health) : vps.online ? 'N/D' : '—';

  // ── Gateway card colors ──────────────────────────────────────────────────────

  const gatewayOnline = !isMockMode && vps.online;
  const gatewayCls = gatewayOnline
    ? { card: 'bg-emerald-500/5 border-emerald-500/20', icon: 'bg-emerald-500/10', ico: 'text-emerald-400', label: 'text-emerald-400', value: 'text-emerald-300' }
    : { card: 'bg-zinc-900/50 border-zinc-800', icon: 'bg-zinc-800', ico: 'text-zinc-500', label: 'text-zinc-400', value: 'text-zinc-300' };

  const cpuCls = gatewayOnline
    ? { card: 'bg-purple-500/5 border-purple-500/20', icon: 'bg-purple-500/10', ico: 'text-purple-400', label: 'text-purple-400', value: 'text-purple-300' }
    : { card: 'bg-zinc-900/50 border-zinc-800', icon: 'bg-zinc-800', ico: 'text-zinc-500', label: 'text-zinc-400', value: 'text-zinc-300' };

  const memCls = gatewayOnline
    ? { card: 'bg-orange-500/5 border-orange-500/20', icon: 'bg-orange-500/10', ico: 'text-orange-400', label: 'text-orange-400', value: 'text-orange-300' }
    : { card: 'bg-zinc-900/50 border-zinc-800', icon: 'bg-zinc-800', ico: 'text-zinc-500', label: 'text-zinc-400', value: 'text-zinc-300' };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <AppLayout>
      <PageBreadcrumb />
      <div className="p-8 space-y-6">

        {/* Mock-mode banner */}
        {isMockMode && (
          <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-500/5 border border-amber-500/20 text-amber-400">
            <AlertCircle size={18} className="shrink-0" />
            <span className="text-sm font-medium">
              Configure <code className="bg-amber-500/10 px-1 rounded">VITE_OPENCLAW_URL</code> para conectar ao gateway real
            </span>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard OpenClaw</h1>
            <p className="text-slate-600 mt-1">
              Monitoramento do gateway e skills instaladas
              {vps.lastChecked && (
                <span className="ml-2 text-xs text-slate-400">
                  · atualizado às {vps.lastChecked.toLocaleTimeString('pt-BR')}
                </span>
              )}
            </p>
          </div>
          <Button variant="outline" onClick={fetchHealth} disabled={vps.loading}>
            <RefreshCw size={18} className={`mr-2 ${vps.loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Gateway */}
          <Card className={gatewayCls.card}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${gatewayCls.icon} rounded-full flex items-center justify-center`}>
                  <Server className={gatewayCls.ico} size={24} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${gatewayCls.label}`}>Gateway</p>
                  <p className={`text-xl font-bold ${gatewayCls.value}`}>
                    {vps.loading ? '...' : gatewayOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills Ativas */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <Activity className="text-blue-600" size={24} />
                </div>
                <div>
                  <p className="text-sm text-blue-600 font-medium">Skills Ativas</p>
                  <p className="text-xl font-bold text-blue-900">
                    {vps.loading ? '…' : gatewayOnline ? `${activeSkills}/${totalSkills}` : `—/${totalSkills}`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CPU */}
          <Card className={cpuCls.card}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${cpuCls.icon} rounded-full flex items-center justify-center`}>
                  <Cpu className={cpuCls.ico} size={24} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${cpuCls.label}`}>CPU Usage</p>
                  <p className={`text-xl font-bold ${cpuCls.value}`}>
                    {vps.loading ? '…' : cpuDisplay}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Memory */}
          <Card className={memCls.card}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${memCls.icon} rounded-full flex items-center justify-center`}>
                  <HardDrive className={memCls.ico} size={24} />
                </div>
                <div>
                  <p className={`text-sm font-medium ${memCls.label}`}>Memória</p>
                  <p className={`text-xl font-bold ${memCls.value}`}>
                    {vps.loading ? '…' : memDisplay}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Skills + Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Installed Skills */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Settings size={20} />
                Skills Instaladas
              </CardTitle>
              <Badge variant="outline">
                {gatewayOnline ? `${activeSkills} ativas` : 'status desconhecido'}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {skills.map((skill) => (
                  <div
                    key={skill.name}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-zinc-900/50"
                  >
                    <div className="flex items-center gap-3">
                      {skill.status === 'active' ? (
                        <CheckCircle size={18} className="text-green-500" />
                      ) : skill.status === 'error' ? (
                        <XCircle size={18} className="text-red-500" />
                      ) : (
                        <AlertCircle size={18} className="text-yellow-500" />
                      )}
                      <span className="font-medium">{skill.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">v{skill.version}</Badge>
                      <Badge
                        className={
                          skill.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : skill.status === 'inactive'
                            ? 'bg-zinc-800 text-zinc-300'
                            : 'bg-yellow-500/10 text-yellow-400'
                        }
                      >
                        {skill.status === 'unknown' ? 'desconhecido' : skill.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Logs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Terminal size={20} />
                Logs em Tempo Real
              </CardTitle>
              <Button variant="ghost" size="sm">Ver todos</Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 font-mono text-sm">
                {gatewayOnline ? (
                  <div className="flex items-center gap-2 p-4 rounded bg-zinc-900/50 text-zinc-400 text-sm">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>Logs em tempo real serão exibidos aqui quando o streaming estiver ativo.</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-4 rounded bg-slate-50 text-slate-500 text-sm">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>Gateway offline — conecte o VPS para visualizar logs em tempo real.</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Connection Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi size={20} />
              Status de Conexões
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Supabase — always green */}
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="font-medium">Supabase</p>
                  <p className="text-sm text-slate-500">Conectado</p>
                </div>
              </div>

              {/* Gemini — based on env var */}
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${hasGeminiKey ? 'bg-green-100' : 'bg-yellow-500/10'}`}>
                  {hasGeminiKey ? (
                    <CheckCircle className="text-green-600" size={20} />
                  ) : (
                    <AlertCircle className="text-yellow-600" size={20} />
                  )}
                </div>
                <div>
                  <p className="font-medium">Google Gemini</p>
                  <p className={`text-sm ${hasGeminiKey ? 'text-slate-500' : 'text-yellow-600'}`}>
                    {hasGeminiKey ? 'Disponível' : 'Chave não configurada'}
                  </p>
                </div>
              </div>

              {/* OpenClaw Gateway — real status */}
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${gatewayOnline ? 'bg-green-100' : 'bg-zinc-800'}`}>
                  {gatewayOnline ? (
                    <Shield className="text-green-600" size={20} />
                  ) : (
                    <Shield className="text-slate-400" size={20} />
                  )}
                </div>
                <div>
                  <p className="font-medium">OpenClaw Gateway</p>
                  <p className={`text-sm ${gatewayOnline ? 'text-slate-500' : 'text-slate-400'}`}>
                    {vps.loading
                      ? 'Verificando…'
                      : isMockMode
                      ? 'Modo mock'
                      : gatewayOnline
                      ? `Online · uptime ${uptimeDisplay}`
                      : `Offline${vps.error ? ` — ${vps.error}` : ''}`}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
