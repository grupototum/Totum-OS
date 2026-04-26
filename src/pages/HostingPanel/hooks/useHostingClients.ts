import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

interface ClientForm {
  company_name: string;
  domain: string;
  contact_name: string;
  contact_email: string;
  status: string;
  monthly_value: string;
  notes: string;
}

export function useHostingClients() {
  const [clients, setClients] = useState<HostingClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<HostingClient | null>(null);
  const [form, setForm] = useState<ClientForm>({
    company_name: '',
    domain: '',
    contact_name: '',
    contact_email: '',
    status: 'ativo',
    monthly_value: '0',
    notes: '',
  });

  const load = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from('hosting_clients')
      .select('*')
      .order('company_name');

    if (error) {
      console.info('Cadastro de hospedagem indisponível nesta base.', error);
      setClients([]);
      setLoading(false);
      return;
    }

    setClients((data || []) as HostingClient[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm({
      company_name: '',
      domain: '',
      contact_name: '',
      contact_email: '',
      status: 'ativo',
      monthly_value: '0',
      notes: '',
    });
    setDialogOpen(true);
  };

  const openEdit = (c: HostingClient) => {
    setEditing(c);
    setForm({
      company_name: c.company_name,
      domain: c.domain || '',
      contact_name: c.contact_name || '',
      contact_email: c.contact_email || '',
      status: c.status,
      monthly_value: String(c.monthly_value),
      notes: c.notes || '',
    });
    setDialogOpen(true);
  };

  const save = async () => {
    if (!form.company_name) return;

    const payload = {
      ...form,
      monthly_value: Number(form.monthly_value),
      updated_at: new Date().toISOString(),
    };

    if (editing) {
      const { error } = await (supabase as any)
        .from('hosting_clients')
        .update(payload)
        .eq('id', editing.id);
      if (error) {
        toast.error('Base de hospedagem indisponível');
        return;
      }
      toast.success('Cliente atualizado');
    } else {
      const { error } = await (supabase as any)
        .from('hosting_clients')
        .insert(payload);
      if (error) {
        toast.error('Base de hospedagem indisponível');
        return;
      }
      toast.success('Cliente criado');
    }

    setDialogOpen(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Remover cliente?')) return;

    const { error } = await (supabase as any)
      .from('hosting_clients')
      .delete()
      .eq('id', id);
    if (error) {
      toast.error('Base de hospedagem indisponível');
      return;
    }
    toast.success('Cliente removido');
    load();
  };

  const filtered = clients.filter((c) =>
    c.company_name.toLowerCase().includes(search.toLowerCase())
  );

  return {
    clients,
    filtered,
    loading,
    search,
    setSearch,
    dialogOpen,
    setDialogOpen,
    editing,
    form,
    setForm,
    openNew,
    openEdit,
    save,
    remove,
  };
}
