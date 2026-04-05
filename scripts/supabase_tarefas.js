const { createClient } = require('@supabase/supabase-js');

// Configuração do Supabase
const supabaseUrl = 'https://cgpkfhrqprqptvehatad.supabase.co';
const supabaseKey = 'sb_publishable_gjkalaMwShdo-vS4p3zvnw_RHVvcMSr';
const supabase = createClient(supabaseUrl, supabaseKey);

// Definição das 25 tarefas (sem campo prazo - não existe na tabela)
const tarefas = [
  // INFRAESTRUTURA (7 tarefas - alta prioridade)
  {
    titulo: 'Ativar 9 apps Docker',
    descricao: 'Ativar containers Docker: Redis, Beszel, Vaultwarden, Docmost, Duplicati, FileFlows, Documenso, Immich, Ollama',
    status: 'pendente',
    prioridade: 'alta',
    responsavel: 'TOT',
    departamento: 'Infra'
  },
  {
    titulo: 'Instalar Ollama no servidor dedicado',
    descricao: 'Instalar Ollama no servidor i5-2400 com modelo qwen2.5:7b para execução local de LLMs',
    status: 'pendente',
    prioridade: 'alta',
    responsavel: 'TOT',
    departamento: 'Infra'
  },
  {
    titulo: 'Corrigir/verificar CyberPanel ou instalar aaPanel',
    descricao: 'Verificar configuração atual do CyberPanel ou migrar para aaPanel como painel de controle alternativo',
    status: 'pendente',
    prioridade: 'alta',
    responsavel: 'TOT',
    departamento: 'Infra'
  },
  {
    titulo: 'Upgrade disco VPS Hostinger',
    descricao: 'Aumentar espaço em disco do VPS Hostinger para suportar crescimento dos apps',
    status: 'pendente',
    prioridade: 'alta',
    responsavel: 'TOT',
    departamento: 'Infra'
  },
  {
    titulo: 'Configurar SSL Lets Encrypt para stark.grupototum.com',
    descricao: 'Configurar certificado SSL gratuito do Lets Encrypt para o domínio stark.grupototum.com',
    status: 'pendente',
    prioridade: 'alta',
    responsavel: 'TOT',
    departamento: 'Infra'
  },
  {
    titulo: 'Finalizar Cloudflare Tunnel (sessão crisp-kelp)',
    descricao: 'Completar configuração do Cloudflare Tunnel com nome de sessão crisp-kelp',
    status: 'pendente',
    prioridade: 'alta',
    responsavel: 'TOT',
    departamento: 'Infra'
  },
  {
    titulo: 'Completar instalação N8N (sessão nova-dune)',
    descricao: 'Finalizar setup do N8N com nome de sessão nova-dune para automações de workflows',
    status: 'pendente',
    prioridade: 'alta',
    responsavel: 'TOT',
    departamento: 'Infra'
  },
  
  // AGENTES (7 tarefas - alta prioridade)
  {
    titulo: 'Criar Agente Reportei',
    descricao: 'Criar agente para substituir ferramenta paga de R$30/mês - geração automática de relatórios',
    status: 'pendente',
    prioridade: 'alta',
    responsavel: 'Israel',
    departamento: 'Agentes'
  },
  {
    titulo: 'Criar Agente Fignaldo',
    descricao: 'Criar agente que converte Design System em protótipos Figma automaticamente',
    status: 'pendente',
    prioridade: 'alta',
    responsavel: 'Israel',
    departamento: 'Agentes'
  },
  {
    titulo: 'Criar Radar de Anúncios',
    descricao: 'Criar agente para monitoramento de concorrentes integrado com AdSpy',
    status: 'pendente',
    prioridade: 'alta',
    responsavel: 'Israel',
    departamento: 'Agentes'
  },
  {
    titulo: 'Criar KVirtuoso',
    descricao: 'Criar agente que gera 100-200 posts a partir de um Key Visual único',
    status: 'pendente',
    prioridade: 'alta',
    responsavel: 'Israel',
    departamento: 'Agentes'
  },
  {
    titulo: 'Criar Zelador',
    descricao: 'Criar agente para limpeza e refatoração automática de código',
    status: 'pendente',
    prioridade: 'alta',
    responsavel: 'Israel',
    departamento: 'Agentes'
  },
  {
    titulo: 'Criar Ghost',
    descricao: 'Criar agente para testes caóticos e detecção de bugs (chaos engineering)',
    status: 'pendente',
    prioridade: 'alta',
    responsavel: 'Israel',
    departamento: 'Agentes'
  },
  {
    titulo: 'Inserir 52 agentes mapeados na tabela public.agentes',
    descricao: 'Popular a tabela public.agentes com os 52 agentes mapeados no planejamento',
    status: 'pendente',
    prioridade: 'alta',
    responsavel: 'Israel',
    departamento: 'Agentes'
  },
  
  // FERRAMENTAS & TESTES (4 tarefas - média prioridade)
  {
    titulo: 'Testar Runway Gen-3',
    descricao: 'Avaliar capacidades de geração de vídeo com Runway Gen-3 para conteúdo marketing',
    status: 'pendente',
    prioridade: 'media',
    responsavel: 'Data',
    departamento: 'Design'
  },
  {
    titulo: 'Configurar/avaliar Figma AI nativo',
    descricao: 'Testar e avaliar recursos de IA nativos do Figma para aceleração de design',
    status: 'pendente',
    prioridade: 'media',
    responsavel: 'Data',
    departamento: 'Design'
  },
  {
    titulo: 'Ativar Canva AI Magic Studio',
    descricao: 'Configurar e testar Canva AI Magic Studio para criação de conteúdo visual',
    status: 'pendente',
    prioridade: 'media',
    responsavel: 'Data',
    departamento: 'Design'
  },
  {
    titulo: 'Testar Flim.ai',
    descricao: 'Avaliar Flim.ai para busca de referências visuais e inspiração de design',
    status: 'pendente',
    prioridade: 'media',
    responsavel: 'Data',
    departamento: 'Design'
  },
  
  // DASHBOARDS & SISTEMAS (3 tarefas - média prioridade)
  {
    titulo: 'Criar Dashboard de Gastos',
    descricao: 'Criar dashboard de controle financeiro em Google Sheets ou Apps Totum',
    status: 'pendente',
    prioridade: 'media',
    responsavel: 'TOT',
    departamento: 'Estratégia'
  },
  {
    titulo: 'Finalizar Quadro de Tarefas',
    descricao: 'Completar sistema Kanban para gestão de tarefas com todas as funcionalidades',
    status: 'pendente',
    prioridade: 'media',
    responsavel: 'TOT',
    departamento: 'Estratégia'
  },
  {
    titulo: 'Implementar interface restruturada de Agentes',
    descricao: 'Fazer merge de páginas e reestruturar interface de gerenciamento de agentes',
    status: 'pendente',
    prioridade: 'media',
    responsavel: 'TOT',
    departamento: 'Estratégia'
  },
  
  // ANÁLISES & DOCUMENTAÇÃO (4 tarefas - baixa prioridade)
  {
    titulo: 'Gerar tabela comparativa: FREE vs trial vs local',
    descricao: 'Criar tabela comparativa de ferramentas FREE vs trial vs auto-hospedado por categoria',
    status: 'pendente',
    prioridade: 'baixa',
    responsavel: 'Israel',
    departamento: 'Estratégia'
  },
  {
    titulo: 'Recomendar máquinas dedicadas',
    descricao: 'Elaborar recomendações de máquinas dedicadas por faixa de preço: até R$2k, R$5k, R$10k',
    status: 'pendente',
    prioridade: 'baixa',
    responsavel: 'Israel',
    departamento: 'Estratégia'
  },
  {
    titulo: 'Análise custo-benefício: cloud GPU vs Hostinger vs estrutura atual',
    descricao: 'Comparar custos e benefícios entre cloud GPU (Vast.ai, etc), Hostinger VPS e infraestrutura atual',
    status: 'pendente',
    prioridade: 'baixa',
    responsavel: 'Israel',
    departamento: 'Estratégia'
  },
  {
    titulo: 'Criar POP-002',
    descricao: 'Criar POP-002 para melhoria contínua de POPs (meta-documentação de processos)',
    status: 'pendente',
    prioridade: 'baixa',
    responsavel: 'Pablo',
    departamento: 'Estratégia'
  }
];

async function main() {
  console.log('=== SUPABASE APPS TOTUM - LIMPEZA E INSERÇÃO ===\n');
  
  // PARTE 1: Deletar todas as tarefas existentes
  console.log('PARTE 1: DELETANDO TAREFAS EXISTENTES...');
  
  const { data: tarefasAntes, error: erroConsulta } = await supabase
    .from('tarefas')
    .select('*');
  
  if (erroConsulta) {
    console.error('Erro ao consultar tarefas existentes:', erroConsulta);
    return;
  }
  
  console.log(`- Encontradas ${tarefasAntes.length} tarefas existentes`);
  
  let deletadas = 0;
  if (tarefasAntes.length > 0) {
    const { error: erroDelete } = await supabase
      .from('tarefas')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    
    if (erroDelete) {
      console.error('Erro ao deletar tarefas:', erroDelete);
      return;
    }
    
    const { data: tarefasDepois } = await supabase
      .from('tarefas')
      .select('*');
    
    deletadas = tarefasAntes.length - (tarefasDepois?.length || 0);
    console.log(`✓ Deletadas ${deletadas} tarefas\n`);
  } else {
    console.log('✓ Nenhuma tarefa para deletar\n');
  }
  
  // PARTE 2: Inserir novas tarefas
  console.log('PARTE 2: INSERINDO NOVAS TAREFAS...');
  
  const tarefasInseridas = [];
  
  for (const tarefa of tarefas) {
    const { data, error } = await supabase
      .from('tarefas')
      .insert(tarefa)
      .select();
    
    if (error) {
      console.error(`✗ Erro ao inserir "${tarefa.titulo}":`, error.message);
    } else {
      tarefasInseridas.push(data[0]);
      console.log(`✓ [${tarefa.prioridade.toUpperCase()}] ${tarefa.titulo.substring(0, 45)}...`);
    }
  }
  
  // RESUMO
  console.log('\n=== RESUMO ===');
  console.log(`Tarefas deletadas: ${deletadas}`);
  console.log(`Tarefas inseridas: ${tarefasInseridas.length}`);
  console.log('\n--- Lista de Tarefas Inseridas ---');
  
  tarefasInseridas.forEach((t, i) => {
    console.log(`${i + 1}. [${t.prioridade.toUpperCase()}] ${t.titulo} (${t.departamento})`);
    console.log(`   ID: ${t.id}`);
  });
  
  if (tarefasInseridas.length !== tarefas.length) {
    console.log(`\n⚠️ ALERTA: Esperado ${tarefas.length}, inseridas ${tarefasInseridas.length}`);
  } else {
    console.log('\n✓ Todas as tarefas foram inseridas com sucesso!');
  }
}

main().catch(console.error);
