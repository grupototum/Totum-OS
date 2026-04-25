import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RagDocument, Skill, Agent, AlexandriaContextData } from '@/types/alexandria';

function tierFromGroup(group: string | null): number {
  if (!group) return 2;
  if (group === 'tier1' || group.endsWith('-1')) return 1;
  if (group === 'tier3' || group.endsWith('-3')) return 3;
  return 2;
}

function adaptDashboardAgent(row: any): Agent {
  return {
    agent_id: row.id,
    name: row.name,
    emoji: row.emoji || '🤖',
    tier: tierFromGroup(row.agent_group),
    system_prompt: row.description || row.role || '',
    skills: [],
    status: (row.status === 'online' ? 'active' : 'inactive') as Agent['status'],
    created_at: row.created_at,
  } as unknown as Agent;
}

export const useAlexandria = () => {
  const [data, setData] = useState<AlexandriaContextData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadAlexandriaData();
  }, []);

  const loadAlexandriaData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [documentsRes, skillsRes, configRes, dashRes] = await Promise.all([
        (supabase as any).from('rag_documents').select('*').order('created_at', { ascending: false }),
        (supabase as any).from('skills').select('*').eq('status', 'active').order('name'),
        (supabase as any).from('agents_config').select('*').order('name'),
        (supabase as any).from('agents').select('id,name,emoji,role,description,status,category,agent_group,slug,created_at').order('name'),
      ]);

      const configAgents: any[] = configRes.data || [];
      const dashAgents:   any[] = dashRes.data   || [];

      // Merge: dashboard agents not already in agents_config (matched by id)
      const configIds = new Set(configAgents.map((a: any) => a.id));
      const merged: Agent[] = [
        ...(configAgents as unknown as Agent[]),
        ...dashAgents.filter((r: any) => !configIds.has(r.id)).map(adaptDashboardAgent),
      ];

      const stats = {
        totalDocuments: documentsRes.data?.length || 0,
        totalSkills:    skillsRes.data?.length    || 0,
        totalAgents:    merged.length,
        activeAgents:   merged.filter((a: any) => a.status === 'active' || a.status === 'online').length,
      };

      setData({
        documents: (documentsRes.data || []) as unknown as RagDocument[],
        skills:    (skillsRes.data    || []) as unknown as Skill[],
        agents:    merged,
        stats,
      });
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Erro ao carregar dados Alexandria');
      setError(error);
      console.error('Erro ao carregar Alexandria:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, refetch: loadAlexandriaData };
};
