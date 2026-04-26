import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface HostingContainer {
  id: string;
  name: string;
  port: number | null;
  container_type: string;
  status: string;
  health_check_url: string | null;
  last_health_check: string | null;
  last_restart: string | null;
  created_at: string;
}

interface ContainerForm {
  name: string;
  port: string;
  container_type: string;
  health_check_url: string;
}

export function useHostingContainers() {
  const [containers, setContainers] = useState<HostingContainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<ContainerForm>({
    name: '',
    port: '',
    container_type: 'app',
    health_check_url: '',
  });

  const load = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from('hosting_containers')
      .select('*')
      .order('name');

    if (error) {
      console.info('Containers de hospedagem indisponíveis nesta base.', error);
      setContainers([]);
      setLoading(false);
      return;
    }

    setContainers((data || []) as HostingContainer[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const create = async () => {
    if (!form.name) return;

    const { error } = await (supabase as any)
      .from('hosting_containers')
      .insert({
        ...form,
        port: form.port ? Number(form.port) : null,
      });
    if (error) {
      toast.error('Base de containers indisponível');
      return;
    }
    toast.success('Container criado');
    setForm({ name: '', port: '', container_type: 'app', health_check_url: '' });
    setDialogOpen(false);
    load();
  };

  const restart = async (c: HostingContainer) => {
    const { error } = await (supabase as any)
      .from('hosting_containers')
      .update({ last_restart: new Date().toISOString() })
      .eq('id', c.id);
    if (error) {
      toast.error('Base de containers indisponível');
      return;
    }
    toast.success(`${c.name} reiniciado`);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Remover container?')) return;

    const { error } = await (supabase as any)
      .from('hosting_containers')
      .delete()
      .eq('id', id);
    if (error) {
      toast.error('Base de containers indisponível');
      return;
    }
    toast.success('Container removido');
    load();
  };

  return {
    containers,
    loading,
    dialogOpen,
    setDialogOpen,
    form,
    setForm,
    create,
    restart,
    remove,
  };
}
