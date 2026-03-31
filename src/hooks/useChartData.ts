import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface VpsUsagePoint {
  hour: string;
  ram: number;
  cpu: number;
  disk: number;
}

export interface CostHistoryPoint {
  month: string;
  ia: number;
  tools: number;
  hosting: number;
  total: number;
}

export interface ActivityStatsPoint {
  date: string;
  requests: number;
  messages: number;
  deployments: number;
}

export function useChartData(vpsName: string) {
  const [vpsUsage, setVpsUsage] = useState<VpsUsagePoint[]>([]);
  const [costHistory, setCostHistory] = useState<CostHistoryPoint[]>([]);
  const [activityStats, setActivityStats] = useState<ActivityStatsPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVps = useCallback(async () => {
    const { data } = await supabase
      .from("vps_usage_history")
      .select("*")
      .eq("vps_name", vpsName)
      .order("recorded_at", { ascending: true });
    if (data) {
      setVpsUsage(
        data.map((r: any) => ({
          hour: new Date(r.recorded_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
          ram: r.ram,
          cpu: r.cpu,
          disk: r.disk,
        }))
      );
    }
  }, [vpsName]);

  const fetchCosts = useCallback(async () => {
    const { data } = await supabase
      .from("cost_history")
      .select("*")
      .order("month", { ascending: true });
    if (data) {
      setCostHistory(
        data.map((r: any) => {
          const ia = Number(r.ia);
          const tools = Number(r.tools);
          const hosting = Number(r.hosting);
          return { month: r.month.slice(5), ia, tools, hosting, total: ia + tools + hosting };
        })
      );
    }
  }, []);

  const fetchActivity = useCallback(async () => {
    const { data } = await supabase
      .from("activity_stats")
      .select("*")
      .order("date", { ascending: true });
    if (data) {
      setActivityStats(
        data.map((r: any) => ({
          date: r.date,
          requests: r.requests,
          messages: r.messages,
          deployments: r.deployments,
        }))
      );
    }
  }, []);

  useEffect(() => {
    async function init() {
      await Promise.all([fetchVps(), fetchCosts(), fetchActivity()]);
      setLoading(false);
    }
    init();
  }, [fetchVps, fetchCosts, fetchActivity]);

  // Realtime
  useEffect(() => {
    const channelName = `charts-realtime-${Date.now()}`;
    const channel = supabase.channel(channelName);

    channel
      .on("postgres_changes" as any, { event: "*", schema: "public", table: "vps_usage_history" }, () => fetchVps())
      .on("postgres_changes" as any, { event: "*", schema: "public", table: "cost_history" }, () => fetchCosts())
      .on("postgres_changes" as any, { event: "*", schema: "public", table: "activity_stats" }, () => fetchActivity());

    channel.subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchVps, fetchCosts, fetchActivity]);

  return { vpsUsage, costHistory, activityStats, loading };
}
