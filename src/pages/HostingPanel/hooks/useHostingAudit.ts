import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface AuditLog {
  id: string;
  user_email: string | null;
  action: string;
  target: string | null;
  details: any;
  created_at: string;
}

export function useHostingAudit() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await (supabase as any)
      .from('hosting_audit_log')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    setLogs((data || []) as AuditLog[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  return {
    logs,
    loading,
    load,
  };
}
