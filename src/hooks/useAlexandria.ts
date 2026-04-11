import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RagDocument, Skill, Agent, AlexandriaContextData } from '@/types/alexandria';

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

      const { data: documentsData } = await (supabase as any)
        .from('rag_documents')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: skillsData } = await (supabase as any)
        .from('skills')
        .select('*')
        .eq('status', 'active')
        .order('name');

      const { data: agentsData } = await (supabase as any)
        .from('agents_config')
        .select('*')
        .eq('status', 'active')
        .order('name');

      const stats = {
        totalDocuments: documentsData?.length || 0,
        totalSkills: skillsData?.length || 0,
        totalAgents: agentsData?.length || 0,
        activeAgents: agentsData?.length || 0,
      };

      setData({
        documents: (documentsData || []) as unknown as RagDocument[],
        skills: (skillsData || []) as unknown as Skill[],
        agents: (agentsData || []) as unknown as Agent[],
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
