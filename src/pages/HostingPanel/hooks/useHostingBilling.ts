import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface HostingBilling {
  id: string;
  client_id: string;
  month: string;
  amount: number;
  status: string;
  paid_at: string | null;
  receipt_url: string | null;
  created_at: string;
}

export interface HostingClientRef {
  id: string;
  company_name: string;
  monthly_value: number;
  payment_status: string;
}

export function useHostingBilling() {
  const [billing, setBilling] = useState<HostingBilling[]>([]);
  const [clients, setClients] = useState<HostingClientRef[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const [{ data: b }, { data: c }] = await Promise.all([
      (supabase as any)
        .from('hosting_billing')
        .select('*')
        .order('month', { ascending: false }),
      (supabase as any)
        .from('hosting_clients')
        .select('id, company_name, monthly_value, payment_status'),
    ]);
    setBilling((b || []) as HostingBilling[]);
    setClients((c || []) as HostingClientRef[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const totalFaturado = clients.reduce((sum, c) => sum + (c.monthly_value || 0), 0);
  const totalPago = billing
    .filter((b) => b.status === 'pago')
    .reduce((sum, b) => sum + b.amount, 0);
  const totalPendente = billing
    .filter((b) => b.status === 'pendente')
    .reduce((sum, b) => sum + b.amount, 0);

  const clientName = (id: string) =>
    clients.find((c) => c.id === id)?.company_name || '—';

  const markPaid = async (b: HostingBilling) => {
    await (supabase as any)
      .from('hosting_billing')
      .update({
        status: 'pago',
        paid_at: new Date().toISOString(),
      })
      .eq('id', b.id);
    toast.success('Marcado como pago');
    load();
  };

  return {
    billing,
    clients,
    loading,
    totalFaturado,
    totalPago,
    totalPendente,
    clientName,
    markPaid,
  };
}
