import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface Client {
  id: string;
  company_name: string;
  cnpj: string | null;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  website: string | null;
  industry: string | null;
  business_description: string | null;
  company_size: string | null;
  monthly_revenue: string | null;
  brand_tone: string | null;
  crm_used: string | null;
  sla_response: string | null;
  status: string;
  primary_color: string | null;
  support_channels: string[] | null;
  created_at: string | null;
}

/**
 * Hook for managing clients data
 * Handles fetching, updating, and deleting clients with real-time sync
 */
export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = useCallback(async () => {
    const { data } = await supabase
      .from("clients")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setClients(data as Client[]);
    setLoading(false);
  }, []);

  // Initial fetch + real-time subscription
  useEffect(() => {
    fetchClients();
    const ch = supabase
      .channel("clients-rt")
      .on(
        "postgres_changes" as any,
        { event: "*", schema: "public", table: "clients" },
        () => fetchClients()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [fetchClients]);

  const deleteClient = async (id: string) => {
    await supabase.from("clients").delete().eq("id", id);
    toast({ title: "🗑️ Cliente removido" });
    await fetchClients();
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("clients").update({ status } as any).eq("id", id);
    toast({ title: "✅ Status atualizado" });
    await fetchClients();
  };

  return {
    clients,
    loading,
    fetchClients,
    deleteClient,
    updateStatus,
  };
}
