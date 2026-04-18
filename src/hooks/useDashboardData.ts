import { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import type { Agent } from '@/types/agent';
export type { Agent } from '@/types/agent';

export interface VpsServer {
  id: string;
  name: string;
  status: string;
  ram: number;
  cpu: number;
  disk: number;
  description: string | null;
}

export interface DashboardApp {
  id: string;
  name: string;
  status: string;
  icon: string | null;
  description: string | null;
  sort_order: number | null;
}

export interface DashboardCost {
  id: string;
  label: string;
  value: number;
  month: string;
}

export interface DashboardActivity {
  id: string;
  time: string;
  message: string;
  type: string;
  created_at: string;
}

export interface MexSyncEntry {
  id: string;
  label: string;
  status: string;
  last_sync: string | null;
}

export interface GitHubConfig {
  status: string;
  repo: string;
}

export interface DashboardData {
  vps: VpsServer[];
  apps: DashboardApp[];
  agents: Agent[];
  costs: DashboardCost[];
  activities: DashboardActivity[];
  mex: MexSyncEntry[];
  github: GitHubConfig | null;
  loading: boolean;
  realtimeConnected: boolean;
}

const notifyLabels: Record<string, string> = {
  vps_servers: "VPS",
  dashboard_apps: "Apps",
  agents: "Agentes",
  dashboard_costs: "Custos",
  dashboard_activities: "Atividades",
  mex_sync: "MEX Sync",
  github_config: "GitHub",
};

// Debounce helper for toast notifications
function useDebouncedToast() {
  const pending = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const show = useCallback((table: string, eventType: string) => {
    const key = `${table}-${eventType}`;
    const existing = pending.current.get(key);
    if (existing) clearTimeout(existing);

    const timeout = setTimeout(() => {
      const eventLabel = eventType === "INSERT" ? "adicionado" :
        eventType === "UPDATE" ? "atualizado" : "removido";
      toast({
        title: `🔔 ${notifyLabels[table] ?? table}`,
        description: `Dado ${eventLabel} em tempo real`,
      });
      pending.current.delete(key);
    }, 1500);

    pending.current.set(key, timeout);
  }, []);

  return show;
}

// Retry helper for Supabase queries
async function withRetry<T>(fn: () => Promise<T>, retries = 2, delay = 1000): Promise<T | undefined> {
  try {
    return await fn();
  } catch (err) {
    if (retries > 0) {
      await new Promise((r) => setTimeout(r, delay));
      return withRetry(fn, retries - 1, delay * 2);
    }
    console.error("[Dashboard] Query failed after retries:", err);
    return undefined;
  }
}

export function useDashboardData(): DashboardData {
  const [vps, setVps] = useState<VpsServer[]>([]);
  const [apps, setApps] = useState<DashboardApp[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [costs, setCosts] = useState<DashboardCost[]>([]);
  const [activities, setActivities] = useState<DashboardActivity[]>([]);
  const [mex, setMex] = useState<MexSyncEntry[]>([]);
  const [github, setGitHub] = useState<GitHubConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const showToast = useDebouncedToast();

  const refetchVps = useCallback(async () => {
    const data = await withRetry(async () => {
      const { data, error } = await supabase.from("vps_servers").select("*");
      if (error) throw error;
      return data;
    });
    if (data) setVps(data as VpsServer[]);
  }, []);

  const refetchApps = useCallback(async () => {
    const data = await withRetry(async () => {
      const { data, error } = await supabase.from("dashboard_apps").select("*").order("sort_order");
      if (error) throw error;
      return data;
    });
    if (data) setApps(data as DashboardApp[]);
  }, []);

  const refetchAgents = useCallback(async () => {
    const data = await withRetry(async () => {
      const { data, error } = await supabase.from("agents").select("*");
      if (error) throw error;
      return data;
    });
    if (data) setAgents(data as Agent[]);
  }, []);

  const refetchCosts = useCallback(async () => {
    const data = await withRetry(async () => {
      const { data, error } = await supabase.from("dashboard_costs").select("*");
      if (error) throw error;
      return data;
    });
    if (data) setCosts(data as DashboardCost[]);
  }, []);

  const refetchActivities = useCallback(async () => {
    const data = await withRetry(async () => {
      const { data, error } = await supabase.from("dashboard_activities").select("*").order("created_at", { ascending: false }).limit(20);
      if (error) throw error;
      return data;
    });
    if (data) setActivities(data as DashboardActivity[]);
  }, []);

  const refetchMex = useCallback(async () => {
    const data = await withRetry(async () => {
      const { data, error } = await supabase.from("mex_sync").select("*");
      if (error) throw error;
      return data;
    });
    if (data) setMex(data as MexSyncEntry[]);
  }, []);

  const refetchGithub = useCallback(async () => {
    const data = await withRetry(async () => {
      const { data, error } = await supabase.from("github_config").select("*").limit(1).maybeSingle();
      if (error) throw error;
      return data;
    });
    if (data) setGitHub(data as GitHubConfig);
  }, []);

  useEffect(() => {
    async function fetchAll() {
      await Promise.all([
        refetchVps(), refetchApps(), refetchAgents(),
        refetchCosts(), refetchActivities(), refetchMex(), refetchGithub(),
      ]);
      setLoading(false);
    }
    fetchAll();
  }, [refetchVps, refetchApps, refetchAgents, refetchCosts, refetchActivities, refetchMex, refetchGithub]);

  // Realtime subscriptions
  useEffect(() => {
    const refetchMap: Record<string, () => Promise<void>> = {
      vps_servers: refetchVps,
      dashboard_apps: refetchApps,
      agents: refetchAgents,
      dashboard_costs: refetchCosts,
      dashboard_activities: refetchActivities,
      mex_sync: refetchMex,
      github_config: refetchGithub,
    };

    const id = Math.random().toString(36).slice(2);
    let connectedCount = 0;
    const totalChannels = Object.keys(refetchMap).length;

    const channels = Object.entries(refetchMap).map(([table, refetch]) => {
      const ch = supabase.channel(`dash-${table}-${id}`)
        .on(
          "postgres_changes" as any,
          { event: "*", schema: "public", table },
          (payload: any) => {
            refetch();
            showToast(table, payload.eventType);
          }
        )
        .subscribe((status: string) => {
          if (status === "SUBSCRIBED") {
            connectedCount++;
            if (connectedCount === totalChannels) {
              setRealtimeConnected(true);
            }
          }
        });
      return ch;
    });

    return () => {
      channels.forEach((ch) => supabase.removeChannel(ch));
      setRealtimeConnected(false);
    };
  }, [refetchVps, refetchApps, refetchAgents, refetchCosts, refetchActivities, refetchMex, refetchGithub, showToast]);

  return { vps, apps, agents, costs, activities, mex, github, loading, realtimeConnected };
}
