# 📋 PROMPT PASSO 1 — CLAUDE CODE

**O SEU COMPROMISSO**: Executar ESTE PASSO COMPLETO antes de ir para Passo 2

---

## 🎯 OBJETIVO DO PASSO 1

Preparar a **infraestrutura completa** (tipos, APIs, database) para que o sistema rode localmente SEM erros de compilação/runtime.

**Resultado esperado**: 
- ✅ TypeScript compila sem erro
- ✅ APIs respondem `GET /api/agents` com `[]`
- ✅ Database pronto no Supabase
- ✅ Estrutura de pastas criada

**Tempo estimado**: 2-3 horas  
**Deadline**: Antes de ir para Passo 2

---

## 🚀 ORDEM DE EXECUÇÃO

### **ETAPA 1: Clone e Setup Inicial (15 min)**

```bash
# 1. Navegar para projeto
cd ~/Projects/Apps_totum_Oficial

# 2. Extrair arquivo do Kimi (se ainda não fez)
unzip totum-agents-elizaos.zip

# 3. Rodar script de setup do Kimi
bash totum-agents-elizaos/setup.sh

# 4. Verificar se pastas foram criadas
ls -la src/types
ls -la src/lib/agents
ls -la src/app/api/agents
```

**Checkpoint**: Você vê as pastas criadas? Se SIM → Continue. Se NÃO → Debugar script.

---

### **ETAPA 2: Configurar Variáveis de Ambiente (10 min)**

```bash
# Abrir .env.local no seu editor
nano .env.local

# Adicionar:
NEXT_PUBLIC_SUPABASE_URL=https://cgpkfhrqprqptvehatad.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key_aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

**Onde conseguir as chaves:**
1. Abrir https://app.supabase.com
2. Projeto: `cgpkfhrqprqptvehatad`
3. Settings → API
4. Copiar `Service Role Key` e `Anon Key`

**Checkpoint**: .env.local tem as 3 linhas? Se SIM → Continue. Se NÃO → Pedir keys.

---

### **ETAPA 3: Database — Rodar Migrations (30 min)**

```bash
# 1. Abrir Supabase
# URL: https://app.supabase.com/project/cgpkfhrqprqptvehatad

# 2. Ir para SQL Editor
# Menu lateral → SQL Editor → New Query

# 3. Copiar conteúdo do arquivo
cat totum-agents-elizaos/database/001_agents_elizaos_migrations.sql

# 4. Colar NO SQL Editor do Supabase
# (Copiar TODO o conteúdo, não só um pedaço)

# 5. Clicar "Run"
# (Esperar a execução terminar)

# 6. Verificar tabelas criadas
# Menu lateral → Databases → Tables
# Você deve ver:
#   ✓ agents_config
#   ✓ agent_channels
#   ✓ agent_skills_config
#   ✓ agent_knowledge_access
#   ✓ agent_executions
```

**Checkpoint**: Todas 5 tabelas existem no Supabase? Se SIM → Continue. Se NÃO → Rodar migration novamente.

---

### **ETAPA 4: Instalar Dependências (10 min)**

```bash
# 1. Voltar para terminal do projeto
cd ~/Projects/Apps_totum_Oficial

# 2. Instalar dependências (já feito pelo setup.sh, mas confirmar)
npm install lucide-react

# 3. Instalar shadcn/ui components necessários
npx shadcn-ui add button
npx shadcn-ui add input
npx shadcn-ui add badge
npx shadcn-ui add card
npx shadcn-ui add tabs
npx shadcn-ui add textarea
npx shadcn-ui add label
npx shadcn-ui add switch
```

**Checkpoint**: `npm install` terminou sem erro? Se SIM → Continue. Se NÃO → Debugar erro.

---

### **ETAPA 5: Validar TypeScript (20 min)**

```bash
# 1. Checar compilação
npx tsc --noEmit

# Se tiver erro de tipo, ANOTE qual arquivo/linha

# ERROS ESPERADOS (OK):
# ✓ "Cannot find module '@/hooks/useAgents'" (normal, ainda não copiou componentes)
# ✓ "Cannot find type 'ElizaCharacter'" (normal, types devem estar em src/types/)

# ERROS NÃO ESPERADOS (PROBLEMA):
# ✗ "Unexpected token in JSON" (problema no types/agents-elizaos.ts)
# ✗ "Syntax error in adapter.ts" (problema no adapter)
```

**Se tiver erro NÃO ESPERADO**:
```
1. Ver qual arquivo está com problema
2. Abrir arquivo
3. Procurar por syntax error
4. Anotar linha e conteúdo
5. PARAR e avisar ANTES de continuar
```

**Checkpoint**: Rodar `npm run dev` ativa servidor sem erro de compilação? Se SIM → Continue. Se NÃO → PARAR.

---

### **ETAPA 6: Teste de API — Checkpoint 1 (15 min)**

```bash
# 1. Abrir um novo terminal (manter npm run dev rodando)
# Terminal 1: npm run dev (deixa rodando)
# Terminal 2: Novos comandos

# 2. Teste a API básica
curl http://localhost:3000/api/agents

# Resposta esperada:
# {"success":true,"agents":[]}
```

**Se falhar**:
```bash
# Debugar com verbose
curl -v http://localhost:3000/api/agents

# Procurar por:
# - HTTP 200 OK? (se não: erro de rota)
# - JSON response? (se não: erro de serialização)
# - agents array? (se não: erro de banco)
```

**Checkpoint**: API responde 200 OK com JSON válido? Se SIM → Continue. Se NÃO → PARAR.

---

### **ETAPA 7: Teste de POST — Checkpoint 2 (20 min)**

```bash
# 1. Criar um agente via API
curl -X POST http://localhost:3000/api/agents \
  -H "Content-Type: application/json" \
  -d '{
    "name": "TESTE-001",
    "bio": "Agente de teste",
    "system_prompt": "Você é um agente de teste",
    "tier": 2,
    "channels": [
      {
        "type": "telegram",
        "enabled": true,
        "config": {}
      }
    ]
  }'

# Resposta esperada:
# {"success":true,"agent":{...},"character":{...}}
```

**Se falhar**:
```bash
# Debugar erro
# Procurar por:
# - HTTP 201 Created? (se não: erro de POST)
# - success: true? (se false: erro de validação)
# - error message? (qual é?)
```

**Checkpoint**: POST cria agente e retorna 201? Se SIM → Continue. Se NÃO → PARAR.

---

### **ETAPA 8: Verificar no Supabase (10 min)**

```bash
# 1. Abrir Supabase → Table Editor
# 2. Ir para `agents_config`
# 3. Procurar linha com name = "TESTE-001"
# 4. Verificar se campos estão preenchidos:
#    ✓ id (UUID)
#    ✓ agent_id (slug)
#    ✓ name ("TESTE-001")
#    ✓ bio ("Agente de teste")
#    ✓ status ("offline")
#    ✓ tier (2)
#    ✓ exported_character (JSON)
```

**Checkpoint**: Agente está no banco? Se SIM → Continue. Se NÃO → Debugar Adapter.

---

### **ETAPA 9: Limpeza (10 min)**

```bash
# 1. Deletar agente de teste
curl -X DELETE http://localhost:3000/api/agents/[ID_DO_AGENTE]

# Onde [ID_DO_AGENTE] = o UUID que você viu no Supabase

# 2. Verificar no Supabase se foi deletado
# (Recarregar página da tabela)
```

**Checkpoint**: Agente foi deletado? Se SIM → Continue. Se NÃO → Debugar DELETE.

---

## ✅ CHECKLIST FINAL DO PASSO 1

Antes de avisar "Passo 1 terminado", verifique:

```
[ ] Estrutura de pastas criada (src/types, src/lib, src/app/api/agents)
[ ] .env.local tem 3 variáveis Supabase
[ ] Database: 5 tabelas criadas no Supabase
[ ] npm install rodou sem erro
[ ] shadcn/ui components instalados
[ ] npx tsc --noEmit passa SEM erros de tipo
[ ] npm run dev inicia servidor em http://localhost:3000
[ ] GET /api/agents retorna {"success":true,"agents":[]}
[ ] POST /api/agents cria agente com sucesso
[ ] Agente aparece em Supabase
[ ] DELETE /api/agents/[id] deleta agente
```

**Se TODOS checkboxes estão ✅**: Você completou PASSO 1!

---

## 📤 QUANDO TERMINAR

Abra NOVO terminal (deixa `npm run dev` rodando) e execute:

```bash
# 1. Status final
git status

# 2. Add mudanças
git add -A

# 3. Commit
git commit -m "feat: passo-1 complete - infraestrutura de agentes com tipos, APIs e database"

# 4. Push
git push origin main

# 5. Avisar
# "Passo 1 completo! Pronto para Passo 2"
```

---

## 🆘 SE TRAVAR

**Antes de desistir**, tente:

1. **Erro de módulo não encontrado**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run dev
   ```

2. **Erro de Supabase connection**
   ```bash
   # Verificar .env.local
   cat .env.local
   # Verificar se URLs estão corretas (sem /undefined)
   ```

3. **Erro de TypeScript**
   ```bash
   npx tsc --noEmit --pretty false
   # Mostra exatamente qual arquivo/linha tem erro
   ```

4. **API retorna 500**
   ```bash
   # Ver logs do terminal onde rodou npm run dev
   # Procurar por "error" ou "ERROR"
   ```

**Se nada funcionar**, AVISE AGORA (não continue para Passo 2).

---

## 🎯 DEFINIÇÃO DE SUCESSO — PASSO 1

Quando você terminar, você consegue:

1. ✅ Rodar `npm run dev` sem erros
2. ✅ Acessar http://localhost:3000/api/agents
3. ✅ Receber JSON válido da API
4. ✅ Ver agentes sendo criados e deletados via API
5. ✅ Ver dados sendo salvos no Supabase

**Isto é o MÍNIMO para passar para Passo 2.**

---

**Boa sorte! 🚀**

Avise quando terminar. Depois envio PASSO 2.

