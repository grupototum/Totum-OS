import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DBStats {
  status: 'online' | 'offline' | 'checking';
  tablesCount: number;
  latency: number;
  lastChecked: Date;
}

export default function DatabaseStatus() {
  const [stats, setStats] = useState<DBStats>({
    status: 'checking', tablesCount: 0, latency: 0, lastChecked: new Date(),
  });

  const checkDB = async () => {
    setStats(s => ({ ...s, status: 'checking' }));
    const start = Date.now();
    try {
      const { data, error } = await supabase
        .from('information_schema.tables' as any)
        .select('table_name', { count: 'exact', head: true })
        .eq('table_schema', 'public');

      const latency = Date.now() - start;

      if (error) throw error;
      setStats({ status: 'online', tablesCount: (data as any)?.length || 0, latency, lastChecked: new Date() });
    } catch {
      // Tenta um ping simples
      try {
        const { error: pingError } = await supabase.from('skills').select('id').limit(1);
        const latency = Date.now() - start;
        setStats({ status: pingError ? 'offline' : 'online', tablesCount: 0, latency, lastChecked: new Date() });
      } catch {
        setStats(s => ({ ...s, status: 'offline', latency: Date.now() - start, lastChecked: new Date() }));
      }
    }
  };

  useEffect(() => { checkDB(); }, []);

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Database className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">PostgreSQL</h3>
        </div>
        <button onClick={checkDB} className="text-muted-foreground hover:text-foreground transition-colors">
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Status</span>
          <Badge className={`text-xs border-0 ${stats.status === 'online' ? 'bg-green-100 text-green-700' : stats.status === 'offline' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
            {stats.status === 'checking' ? 'verificando...' : stats.status}
          </Badge>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Latência</span>
          <span className="font-medium">{stats.latency}ms</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Provider</span>
          <span className="font-medium">Supabase</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Última verificação</span>
          <span className="text-xs text-muted-foreground">{stats.lastChecked.toLocaleTimeString('pt-BR')}</span>
        </div>
      </div>
    </Card>
  );
}
