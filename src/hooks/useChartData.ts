import { useEffect, useState } from "react";
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

  useEffect(() => {
    async function fetchAll() {
      const [vpsRes, costRes, actRes] = await Promise.all([
        supabase
          .from("vps_usage_history")
          .select("*")
          .eq("vps_name", vpsName)
          .order("recorded_at", { ascending: true }),
        supabase
          .from("cost_history")
          .select("*")
          .order("month", { ascending: true }),
        supabase
          .from("activity_stats")
          .select("*")
          .order("date", { ascending: true }),
      ]);

      if (vpsRes.data) {
        setVpsUsage(
          vpsRes.data.map((r: any) => ({
            hour: new Date(r.recorded_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
            ram: r.ram,
            cpu: r.cpu,
            disk: r.disk,
          }))
        );
      }

      if (costRes.data) {
        setCostHistory(
          costRes.data.map((r: any) => {
            const ia = Number(r.ia);
            const tools = Number(r.tools);
            const hosting = Number(r.hosting);
            return {
              month: r.month.slice(5), // "01", "02", etc.
              ia,
              tools,
              hosting,
              total: ia + tools + hosting,
            };
          })
        );
      }

      if (actRes.data) {
        setActivityStats(
          actRes.data.map((r: any) => ({
            date: r.date,
            requests: r.requests,
            messages: r.messages,
            deployments: r.deployments,
          }))
        );
      }

      setLoading(false);
    }
    fetchAll();
  }, [vpsName]);

  return { vpsUsage, costHistory, activityStats, loading };
}
