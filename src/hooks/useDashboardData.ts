import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: string;
  tasks: number;
  emoji: string | null;
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

  useEffect(() => {
    async function fetchAll() {
      const [vpsRes, appsRes, agentsRes, costsRes, activitiesRes, mexRes, ghRes] =
        await Promise.all([
          supabase.from("vps_servers").select("*"),
          supabase.from("dashboard_apps").select("*").order("sort_order"),
          supabase.from("agents").select("*"),
          supabase.from("dashboard_costs").select("*"),
          supabase.from("dashboard_activities").select("*").order("created_at", { ascending: false }).limit(20),
          supabase.from("mex_sync").select("*"),
          supabase.from("github_config").select("*").limit(1).single(),
        ]);

      setVps((vpsRes.data as VpsServer[]) ?? []);
      setApps((appsRes.data as DashboardApp[]) ?? []);
      setAgents((agentsRes.data as Agent[]) ?? []);
      setCosts((costsRes.data as DashboardCost[]) ?? []);
      setActivities((activitiesRes.data as DashboardActivity[]) ?? []);
      setMex((mexRes.data as MexSyncEntry[]) ?? []);
      setGitHub(ghRes.data as GitHubConfig | null);
      setLoading(false);
    }

    fetchAll();
  }, []);

  return { vps, apps, agents, costs, activities, mex, github, loading };
}
