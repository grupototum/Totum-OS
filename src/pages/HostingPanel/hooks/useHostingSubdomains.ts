import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface HostingSubdomain {
  id: string;
  client_id: string;
  subdomain: string;
  base_domain: string;
  full_url: string;
  status: string;
  created_at: string;
}

interface SubdomainForm {
  client_id: string;
  subdomain: string;
  base_domain: string;
}

export function useHostingSubdomains() {
  const [subdomains, setSubdomains] = useState<HostingSubdomain[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<SubdomainForm>({
    client_id: '',
    subdomain: '',
    base_domain: 'grupototum.com',
  });

  const DOMAINS = ['grupototum.com', 'totum.dev', 'totum.ai'];

  const load = async () => {
    setLoading(true);
    const { data: subdomainsData } = await (supabase as any)
      .from('hosting_subdomains')
      .select('*')
      .order('subdomain');
    const { data: clientsData } = await (supabase as any)
      .from('hosting_clients')
      .select('id, company_name')
      .eq('status', 'ativo');
    setSubdomains((subdomainsData || []) as HostingSubdomain[]);
    setClients((clientsData || []) as any[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    if (!form.client_id || !form.subdomain) return;

    const full_url = `${form.subdomain}.${form.base_domain}`;
    await (supabase as any)
      .from('hosting_subdomains')
      .insert({
        client_id: form.client_id,
        ...form,
        full_url,
      });
    toast.success('Subdomínio criado');
    setForm({ client_id: '', subdomain: '', base_domain: 'grupototum.com' });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Remover subdomínio?')) return;

    await (supabase as any)
      .from('hosting_subdomains')
      .delete()
      .eq('id', id);
    toast.success('Subdomínio removido');
    load();
  };

  return {
    subdomains,
    clients,
    loading,
    form,
    setForm,
    DOMAINS,
    create,
    remove,
  };
}
