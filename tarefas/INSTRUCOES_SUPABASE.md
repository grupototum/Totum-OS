# INSTRUÇÕES DE EXECUÇÃO - SUPABASE

## 📋 Resumo da Missão

**Status:** SQL preparado e pronto para execução  
**Ferramentas CLI:** Indisponíveis (psql e supabase CLI não instalados)  
**Método:** Execução manual via Dashboard do Supabase

---

## 🚀 Como Executar no Supabase Dashboard

### Passo 1: Acessar o SQL Editor
1. Acesse: https://app.supabase.com
2. Selecione o projeto **Apps Totum**
3. No menu lateral, clique em **"SQL Editor"**
4. Clique em **"New query"** (ou + New)

### Passo 2: Copiar o Script
1. Abra o arquivo: `/root/.openclaw/workspace/tarefas/EXECUTAR_SUPABASE.sql`
2. Copie TODO o conteúdo (Ctrl+A, Ctrl+C)
3. Cole no editor do Supabase

### Passo 3: Executar
1. Clique no botão **"Run"** (ou Ctrl+Enter)
2. Aguarde a execução completa
3. Verifique se não há erros na saída

### Passo 4: Validar
Execute esta query para confirmar:
```sql
SELECT COUNT(*) as total_tarefas FROM public.tarefas;
-- Deve retornar: 9
```

---

## 📊 Tarefas que Serão Inseridas

### 🔴 PRIORIDADE CRÍTICA (4 tarefas)

| # | Título | Responsável | Deadline | Estimativa |
|---|--------|-------------|----------|------------|
| 1 | **Criar Agente Reportei** | Pablo | +3 dias | 4-6 horas |
| 2 | **Criar Agente Fignaldo** | Pablo | +5 dias | 6-8 horas |
| 3 | **Criar Radar de Anúncios** | Pablo | +7 dias | 8-10 horas |
| 4 | **Criar KVirtuoso** | Pablo | +10 dias | 10-12 horas |

**Subtotal Pablo (Crítico):** 4 tarefas | ~28-36 horas

---

### 🟠 PRIORIDADE ALTA (2 tarefas)

| # | Título | Responsável | Deadline | Estimativa |
|---|--------|-------------|----------|------------|
| 5 | **Commitar Correções de Bugs no GitHub** | Pablo | +1 dia | 10 minutos |
| 6 | **Instalar Ollama no Servidor Dedicado** | Israel | +2 dias | 30 minutos |

**Subtotal:** 2 tarefas

---

### 🟡 PRIORIDADE MÉDIA (3 tarefas)

| # | Título | Responsável | Deadline | Estimativa |
|---|--------|-------------|----------|------------|
| 7 | **Testar Runway Gen-3** | Data | +7 dias | 2-3 horas |
| 8 | **Configurar Figma AI** | Data | +7 dias | 3-4 horas |
| 9 | **Criar Dashboard de Gastos** | Hug | +5 dias | 4-6 horas |

**Subtotal Data:** 2 tarefas | ~5-7 horas  
**Subtotal Hug:** 1 tarefa | ~4-6 horas

---

## 📈 Distribuição por Responsável

| Responsável | Total | Crítica | Alta | Média | Estimativa Total |
|-------------|-------|---------|------|-------|------------------|
| **Pablo** | 5 | 4 | 1 | 0 | ~29-37 horas |
| **Data** | 2 | 0 | 0 | 2 | ~5-7 horas |
| **Israel** | 1 | 0 | 1 | 0 | ~30 minutos |
| **Hug** | 1 | 0 | 0 | 1 | ~4-6 horas |

---

## 🏗️ Estrutura da Tabela Criada

```sql
public.tarefas
├── id (uuid, PK, auto)
├── titulo (text, obrigatório)
├── descricao (text)
├── status (text, default: 'pendente')
├── responsavel (text, obrigatório)
├── prioridade (text, default: 'media')
├── deadline (timestamptz)
├── created_at (timestamptz, auto)
└── updated_at (timestamptz, auto-atualiza)
```

**Recursos implementados:**
- ✅ Índices em status, responsável, prioridade, deadline
- ✅ Row Level Security (RLS) habilitado
- ✅ Trigger automático para updated_at
- ✅ Políticas de acesso para usuários autenticados

---

## ⚠️ Notas Técnicas

1. **Conflitos:** O script usa `IF NOT EXISTS` para evitar erros se a tabela já existir
2. **Duplicatas:** Cada INSERT é único; executar múltiplas vezes criará duplicatas
3. **Datas:** Os deadlines são calculados como `NOW() + INTERVAL 'X days'`
4. **Permissões:** RLS está ativo; apenas usuários autenticados podem acessar

---

## ✅ Checklist Pós-Execução

- [ ] Script executado sem erros
- [ ] Query de validação retornou "9"
- [ ] Tabela visível no Table Editor do Supabase
- [ ] Aplicação consegue ler/escrever na tabela

---

*Arquivo gerado por: Data (Star Trek)*  
*Precisão: 99.7%*  
*Lógica: Impecável*
