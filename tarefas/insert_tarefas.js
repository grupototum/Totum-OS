const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://cgpkfhrqprqptvehatad.supabase.co';
const supabaseKey = 'sb_publishable_gjkalaMwShdo-vS4p3zvnw_RHVvcMSr';

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    // Verificar se a tabela existe tentando fazer um select
    const { error: checkError } = await supabase
      .from('tarefas')
      .select('id')
      .limit(1);
    
    if (checkError && checkError.code === 'PGRST205') {
      console.log('Tabela tarefas não existe. Tentando criar via RPC...');
      
      // Tentar criar via RPC
      const { error: rpcError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS public.tarefas (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            titulo TEXT NOT NULL,
            descricao TEXT,
            status TEXT DEFAULT 'pendente',
            prioridade TEXT,
            responsavel TEXT,
            deadline TIMESTAMPTZ,
            departamento TEXT,
            tags TEXT[],
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW()
          );
        `
      });
      
      if (rpcError) {
        console.error('Erro ao criar tabela via RPC:', rpcError.message);
        console.log('\n=== INSTRUÇÃO MANUAL ===');
        console.log('A tabela precisa ser criada manualmente no SQL Editor do Supabase:');
        console.log(`
CREATE TABLE IF NOT EXISTS public.tarefas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descricao TEXT,
  status TEXT DEFAULT 'pendente',
  prioridade TEXT,
  responsavel TEXT,
  deadline TIMESTAMPTZ,
  departamento TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
        `);
        return false;
      }
      
      console.log('Tabela criada com sucesso!');
    } else if (checkError) {
      console.error('Erro ao verificar tabela:', checkError.message);
      return false;
    } else {
      console.log('Tabela tarefas já existe.');
    }
    
    return true;
  } catch (err) {
    console.error('Erro:', err.message);
    return false;
  }
}

async function insertTarefas() {
  const tarefas = [
    {
      titulo: 'Configurar N8N Workflow Keep-Alive para Supabase',
      descricao: 'Criar workflow no N8N que executa query a cada 3 dias para evitar pausa do projeto Supabase Free. Inclui notificações Telegram (sucesso/erro).',
      status: 'pendente',
      prioridade: 'media',
      responsavel: 'Israel',
      deadline: '2026-04-10T23:59:59+08:00',
      departamento: 'Infra',
      tags: ['n8n', 'supabase', 'automation', 'keep-alive']
    },
    {
      titulo: 'Instalar CyberPanel no VPS Stark',
      descricao: 'Instalar painel de hospedagem CyberPanel para gerenciar sites de clientes. Seguir guia completo em tarefas/GUIA_INSTALACAO_CYBERPANEL.md.',
      status: 'pendente',
      prioridade: 'alta',
      responsavel: 'Israel',
      deadline: '2026-04-07T23:59:59+08:00',
      departamento: 'Infra',
      tags: ['cyberpanel', 'hosting', 'vps', 'painel-controle']
    }
  ];
  
  for (const tarefa of tarefas) {
    const { data, error } = await supabase
      .from('tarefas')
      .insert(tarefa)
      .select();
    
    if (error) {
      if (error.code === '23505') {
        console.log(`Tarefa "${tarefa.titulo}" já existe (duplicada).`);
      } else {
        console.error(`Erro ao inserir "${tarefa.titulo}":`, error.message);
      }
    } else {
      console.log(`✓ Tarefa inserida: "${tarefa.titulo}" (ID: ${data[0].id})`);
    }
  }
}

async function main() {
  const tableExists = await setupDatabase();
  if (tableExists) {
    await insertTarefas();
    console.log('\n✓ Processo concluído!');
  } else {
    console.log('\n✗ Não foi possível criar a tabela automaticamente.');
    process.exit(1);
  }
}

main();
