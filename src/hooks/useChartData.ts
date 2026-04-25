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
  const [error, setError] = useState<Error | null>(null);

  const fetchVps = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("vps_usage_history")
        .select("*")
        .eq("vps_name", vpsName)
        .order("recorded_at", { ascending: true });
      if (error) throw error;
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
    } catch (err) {
      console.error("useChartData: vps_usage_history:", err);
      setError(err instanceof Error ? err : new Error("Erro ao buscar dados de VPS"));
    }
  }, [vpsName]);

  const fetchCosts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("cost_history")
        .select("*")
        .order("month", { ascending: true });
      if (error) throw error;
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
    } catch (err) {
      console.error("useChartData: cost_history:", err);
      setError(err instanceof Error ? err : new Error("Erro ao buscar histórico de custos"));
    }
  }, []);

  const fetchActivity = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("activity_stats")
        .select("*")
        .order("date", { ascending: true });
      if (error) throw error;
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
    } catch (err) {
      console.error("useChartData: activity_stats:", err);
      setError(err instanceof Error ? err : new Error("Erro ao buscar estatísticas de atividade"));
    }
  }, []);

  useEffect(() => {
    async function init() {
      setError(null);
      await Promise.all([fetchVps(), fetchCosts(), fetchActivity()]);
      setLoading(false);
    }
    init();
  }, [fetchVps, fetchCosts, fetchActivity]);

  // Realtime
  useEffect(() => {
    const id = Math.random().toString(36).slice(2);
    const ch1 = supabase.channel(`chart-vps-${id}`)
      .on("postgres_changes" as any, { event: "*", schema: "public", table: "vps_usage_history" }, () => fetchVps());
    const ch2 = supabase.channel(`chart-cost-${id}`)
      .on("postgres_changes" as any, { event: "*", schema: "public", table: "cost_history" }, () => fetchCosts());
    const ch3 = supabase.channel(`chart-activity-${id}`)
      .on("postgres_changes" as any, { event: "*", schema: "public", table: "activity_stats" }, () => fetchActivity());

    ch1.subscribe();
    ch2.subscribe();
    ch3.subscribe();

    return () => {
      supabase.removeChannel(ch1);
      supabase.removeChannel(ch2);
      supabase.removeChannel(ch3);
    };
  }, [fetchVps, fetchCosts, fetchActivity]);

  return { vpsUsage, costHistory, activityStats, loading, error };
}
