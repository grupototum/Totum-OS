import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface HostingClient {
  id: string;
  company_name: string;
  domain: string | null;
  contact_name: string | null;
  contact_email: string | null;
  status: string;
  monthly_value: number;
  payment_status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export function useHostingClients() {
  const [clients, setClients] = useState<HostingClient[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await (supabase as any)
      .from("hosting_clients")
      .select("*")
      .order("company_name");
    setClients((data || []) as HostingClient[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (client: Partial<HostingClient>, id?: string) => {
    const payload = {
      ...client,
      monthly_value: Number(client.monthly_value || 0),
      updated_at: new Date().toISOString(),
    };

    if (id) {
      await (supabase as any)
        .from("hosting_clients")
        .update(payload)
        .eq("id", id);
      toast.success("Cliente atualizado");
    } else {
      await (supabase as any).from("hosting_clients").insert(payload);
      toast.success("Cliente criado");
    }
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm("Remover cliente?")) return;
    await (supabase as any).from("hosting_clients").delete().eq("id", id);
    toast.success("Cliente removido");
    await load();
  };

  return {
    clients,
    loading,
    load,
    save,
    remove,
  };
}
