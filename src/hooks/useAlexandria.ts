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

      // Carregar documentos RAG
      const { data: documentsData, error: docsError } = await supabase
        .from('rag_documents')
        .select('*')
        .order('created_at', { ascending: false });

      if (docsError) throw docsError;

      // Carregar skills ativas
      const { data: skillsData, error: skillsError } = await supabase
        .from('skills')
        .select('*')
        .eq('status', 'active')
        .order('name');

      if (skillsError) throw skillsError;

      // Carregar agentes ativos
      const { data: agentsData, error: agentsError } = await supabase
        .from('agents_config')
        .select('*')
        .eq('status', 'active')
        .order('name');

      if (agentsError) throw agentsError;

      // Calcular estatísticas
      const stats = {
        totalDocuments: documentsData?.length || 0,
        totalSkills: skillsData?.length || 0,
        totalAgents: agentsData?.length || 0,
        activeAgents: agentsData?.length || 0,
      };

      setData({
        documents: (documentsData || []) as RagDocument[],
        skills: (skillsData || []) as Skill[],
        agents: (agentsData || []) as Agent[],
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
