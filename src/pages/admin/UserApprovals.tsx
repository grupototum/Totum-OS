import { useState, useEffect } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Users, Check, X, Clock, RefreshCw, Search, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Approval {
  id: string;
  user_id: string;
  email: string;
  name: string | null;
  status: 'pending' | 'approved' | 'rejected';
  provider: string;
  created_at: string;
  approved_at: string | null;
  approved_by: string | null;
  rejection_reason: string | null;
}

const statusColor = {
  pending:  'bg-amber-500/15 text-amber-400 border-0',
  approved: 'bg-green-500/15 text-green-400 border-0',
  rejected: 'bg-red-500/15 text-red-400 border-0',
};
const statusLabel = {
  pending:  'Pendente',
  approved: 'Aprovado',
  rejected: 'Rejeitado',
};
const statusIcon = {
  pending:  <Clock className="h-3 w-3 mr-1" />,
  approved: <Check className="h-3 w-3 mr-1" />,
  rejected: <X className="h-3 w-3 mr-1" />,
};

export default function UserApprovals() {
  const { user } = useAuth();
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [acting, setActing] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from('user_approvals')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) toast.error('Erro ao carregar aprovações');
    setApprovals((data || []) as Approval[]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const approve = async (approval: Approval) => {
    setActing(approval.id);
    const { error } = await (supabase as any)
      .from('user_approvals')
      .update({
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: user?.email || 'admin',
      })
      .eq('id', approval.id);

    if (error) {
      toast.error('Erro ao aprovar usuário');
    } else {
      toast.success(`${approval.email} aprovado com sucesso!`);
      await load();
    }
    setActing(null);
  };

  const reject = async (approval: Approval) => {
    const reason = window.prompt(`Motivo da rejeição para ${approval.email} (opcional):`);
    if (reason === null) return; // cancelled

    setActing(approval.id);
    const { error } = await (supabase as any)
      .from('user_approvals')
      .update({
        status: 'rejected',
        rejection_reason: reason || null,
        approved_at: new Date().toISOString(),
        approved_by: user?.email || 'admin',
      })
      .eq('id', approval.id);

    if (error) {
      toast.error('Erro ao rejeitar usuário');
    } else {
      toast.success(`${approval.email} rejeitado.`);
      await load();
    }
    setActing(null);
  };

  const filtered = approvals.filter((a) => {
    const matchFilter = filter === 'all' || a.status === filter;
    const matchSearch =
      !search ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      (a.name || '').toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    pending:  approvals.filter((a) => a.status === 'pending').length,
    approved: approvals.filter((a) => a.status === 'approved').length,
    rejected: approvals.filter((a) => a.status === 'rejected').length,
  };

  return (
    <AppLayout>
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Aprovação de Usuários</h1>
              <p className="text-sm text-muted-foreground">
                Gerenciar solicitações de acesso ao Apps Totum
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {(['pending', 'approved', 'rejected'] as const).map((s) => (
            <Card
              key={s}
              className={`p-4 cursor-pointer transition-all ${filter === s ? 'ring-1 ring-primary' : 'hover:bg-muted/30'}`}
              onClick={() => setFilter(s)}
            >
              <div className="text-2xl font-bold">{counts[s]}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{statusLabel[s]}</div>
            </Card>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex gap-3 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por email ou nome..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            <Users className="h-3.5 w-3.5 mr-1" />
            Todos ({approvals.length})
          </Button>
        </div>

        {/* Table */}
        <Card className="overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-muted-foreground">Carregando...</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Users className="h-8 w-8 mx-auto mb-2 opacity-30" />
              <p>
                {filter === 'pending'
                  ? 'Nenhum cadastro pendente.'
                  : 'Nenhum resultado encontrado.'}
              </p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b">
                <tr>
                  {['Usuário', 'Provedor', 'Status', 'Data', 'Ações'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left font-medium text-muted-foreground">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((a) => (
                  <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs shrink-0">
                          {(a.name || a.email)[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{a.name || '—'}</p>
                          <p className="text-xs text-muted-foreground truncate">{a.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-xs capitalize">
                        {a.provider}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={`text-xs ${statusColor[a.status]}`}>
                        {statusIcon[a.status]}
                        {statusLabel[a.status]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(a.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      {a.status === 'pending' && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            className="h-7 text-xs bg-green-600 hover:bg-green-700"
                            onClick={() => approve(a)}
                            disabled={acting === a.id}
                          >
                            <Check className="h-3.5 w-3.5 mr-1" />
                            Aprovar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-7 text-xs"
                            onClick={() => reject(a)}
                            disabled={acting === a.id}
                          >
                            <X className="h-3.5 w-3.5 mr-1" />
                            Rejeitar
                          </Button>
                        </div>
                      )}
                      {a.status === 'approved' && (
                        <span className="text-xs text-muted-foreground">
                          por {a.approved_by || '—'}
                        </span>
                      )}
                      {a.status === 'rejected' && (
                        <span
                          className="text-xs text-muted-foreground truncate max-w-[120px] block"
                          title={a.rejection_reason || ''}
                        >
                          {a.rejection_reason || '—'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
