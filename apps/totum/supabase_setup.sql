-- PROMPT PARA SUPABASE SQL EDITOR
-- Cole isto inteiro no SQL Editor do Supabase e execute

-- =====================================================
-- 1. LIMPAR TABELAS EXISTENTES (se houver dados corrompidos)
-- =====================================================
-- Descomente as linhas abaixo se quiser apagar e recriar tudo:
-- drop table if exists tarefas cascade;
-- drop table if exists projetos cascade;

-- =====================================================
-- 2. CRIAR TABELA PROJETOS (se não existir)
-- =====================================================
create table if not exists projetos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text,
  cor text default '#78716C',
  criado_em timestamp with time zone default now()
);

-- =====================================================
-- 3. CRIAR TABELA TAREFAS (se não existir)
-- =====================================================
create table if not exists tarefas (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text,
  status text default 'a_fazer',
  prioridade text default 'media',
  responsavel text,
  data_limite timestamp with time zone,
  projeto_id uuid references projetos(id) on delete set null,
  tipo text default 'unica',
  tags jsonb default '[]'::jsonb,
  subtarefas jsonb default '[]'::jsonb,
  criado_em timestamp with time zone default now(),
  atualizado_em timestamp with time zone default now(),
  criado_por uuid,
  posicao integer default 0
);

-- =====================================================
-- 4. ATIVAR REALTIME (atualizações em tempo real)
-- =====================================================
-- Verificar se a publicação existe e adicionar tabelas
DO $$
BEGIN
  -- Adicionar projetos ao realtime
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE tablename = 'projetos' AND pubname = 'supabase_realtime'
  ) THEN
    alter publication supabase_realtime add table projetos;
  END IF;

  -- Adicionar tarefas ao realtime
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE tablename = 'tarefas' AND pubname = 'supabase_realtime'
  ) THEN
    alter publication supabase_realtime add table tarefas;
  END IF;
END $$;

-- =====================================================
-- 5. PERMISSÕES RLS (Row Level Security)
-- =====================================================
-- Ativar RLS nas tabelas
alter table projetos enable row level security;
alter table tarefas enable row level security;

-- Remover políticas antigas se existirem (para evitar duplicatas)
drop policy if exists "Allow all" on projetos;
drop policy if exists "Allow all" on tarefas;
drop policy if exists "Enable all access" on projetos;
drop policy if exists "Enable all access" on tarefas;

-- Criar políticas permissivas (ajuste conforme sua auth depois)
create policy "Enable all access" on projetos
  for all using (true) with check (true);

create policy "Enable all access" on tarefas
  for all using (true) with check (true);

-- =====================================================
-- 6. ÍNDICES PARA PERFORMANCE
-- =====================================================
create index if not exists idx_tarefas_projeto on tarefas(projeto_id);
create index if not exists idx_tarefas_status on tarefas(status);
create index if not exists idx_tarefas_responsavel on tarefas(responsavel);

-- =====================================================
-- 7. TRIGGER PARA ATUALIZAR updated_at AUTOMATICAMENTE
-- =====================================================
-- Função que atualiza o campo atualizado_em
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$ language plpgsql;

-- Trigger para tabela tarefas
drop trigger if exists update_tarefas_updated_at on tarefas;
create trigger update_tarefas_updated_at
  before update on tarefas
  for each row
  execute function update_updated_at_column();

-- =====================================================
-- 8. VERIFICAÇÃO FINAL
-- =====================================================
select 
  'Tabela projetos: ' || count(*) || ' registros' as status
from projetos
union all
select 
  'Tabela tarefas: ' || count(*) || ' registros' as status
from tarefas;
