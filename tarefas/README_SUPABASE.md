# 📋 Setup Tarefas no Supabase

## Status da Execução

⚠️ **A tabela `tarefas` não existe no Supabase.**

Com a chave `anon` fornecida, não é possível criar tabelas via API REST (requer privilégios de admin/service_role). 

## 🔧 Como Executar

### Opção 1: SQL Editor do Supabase (Recomendado)

1. Acesse o dashboard do Supabase:
   ```
   https://cgpkfhrqprqptvehatad.supabase.co/project/sql
   ```

2. Cole o conteúdo do arquivo `setup_tarefas_supabase.sql`

3. Clique em **Run** para executar

4. Verifique se as tarefas foram inseridas:
   ```sql
   SELECT * FROM public.tarefas;
   ```

### Opção 2: psql (se tiver a senha do PostgreSQL)

```bash
psql "postgresql://postgres:[SENHA]@db.cgpkfhrqprqptvehatad.supabase.co:5432/postgres" -f setup_tarefas_supabase.sql
```

## 📁 Arquivos Gerados

| Arquivo | Descrição |
|---------|-----------|
| `setup_tarefas_supabase.sql` | SQL completo (DDL + INSERTs) |
| `tarefas_data.json` | Dados das tarefas em JSON |
| `insert_tarefas.js` | Script Node.js para inserção (requer tabela existente) |

## 📊 Estrutura da Tabela

```sql
CREATE TABLE public.tarefas (
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
```

## ✅ Tarefas a Serem Inseridas

1. **Configurar N8N Workflow Keep-Alive para Supabase**
   - Prioridade: Média
   - Deadline: 2026-04-10
   - Departamento: Infra

2. **Instalar CyberPanel no VPS Stark**
   - Prioridade: Alta
   - Deadline: 2026-04-07
   - Departamento: Infra

## 🔗 Credenciais

- **URL:** https://cgpkfhrqprqptvehatad.supabase.co
- **Anon Key:** sb_publishable_gjkalaMwShdo-vS4p3zvnw_RHVvcMSr

---
*Gerado em: 2026-04-03*
