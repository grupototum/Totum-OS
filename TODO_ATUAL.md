# 🎯 TAREFAS PENDENTES - TOT

> Arquivo atualizado em: 2026-04-05  
> Remove tudo concluído. Só o que falta.

---

## 🔴 URGENTE (Esta Semana)

### 1. Finalizar Alexandria Ingestion
**Status:** ✅ BACKEND COMPLETO VALIDADO!  
**Resultado:** Supabase + Gemini (3072D) + Chunking funcionando

**Próximo passo (você):**
- [x] Gemini testado - FUNCIONA! (3072 dimensões)
- [ ] Atualizar schema do Supabase: `ALTER TABLE giles_knowledge ALTER COLUMN embedding TYPE vector(3072);`
- [ ] Rodar migração completa: `node migrate-pops-v2.mjs --dir=./docs/pops --dominio=operacao`

**Scripts criados:**
- `migrate-pops-v2.mjs` - Migração em massa com Gemini real
- `test-full-gemini.mjs` - Teste completo validado
- Documentação: `MIGRATION.md`

**Estimativa:** ~30 minutos para 100 POPs

---

### 2. Credenciais Supabase
**Status:** ✅ TODAS CONFIGURADAS  
**Local:** `projeto-alexandria/.env.local`

**Credenciais:**
```
SUPABASE_URL=https://cgpkfhrqprqptvehatad.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGci... (service_role)
GEMINI_API_KEY=AIzaSyBylRgKAiV84y2HVwq9aNxllfciOVlqz0U
```

**Obs:** Service role key usada (bypass RLS para ingestão)

---

### 3. Criar Conta Oracle Cloud
**Status:** Pendente  
**Horário ideal:** Madrugada domingo (3h-6h BRT)

**Se conseguir:**
- [ ] Criar instância ARM (4 OCPUs + 24GB RAM)
- [ ] Instalar OpenClaw
- [ ] Configurar como redundância

**Se não conseguir (out of capacity):**
- [ ] Tentar de novo em 30min
- [ ] Ou reduzir specs (2 OCPUs + 12GB)
- [ ] Ou tentar na segunda madrugada

---

## 🟡 IMPORTANTE (Antes das Férias - 12/04)

### 4. Handoff de Férias (11 dias)
**Deadline:** 11/04

**Documentar para Liz/Jarvis:**
- [ ] Acessos emergenciais (senhas em cofre seguro)
- [ ] Lista de projetos ativos e status
- [ ] Quem chamar se algo queimar
- [ ] Autoresponder de email configurado

**Para mim (TOT):**
- [ ] Confirmar acesso SSH em todos os servidores
- [ ] Verificar se Pablo tem tudo pra operar
- [ ] Testar alertas/notificações

---

### 5. Cloudflare Tunnel
**Status:** Aguardando  
**Por que:** IP da Alibaba varia (NAT)

**Quando domínio estiver ok:**
- [ ] Instalar cloudflared no servidor
- [ ] Configurar tunnel para porta 22 (SSH)
- [ ] Configurar tunnels para apps (3000, 4173, 4174, 4175, 5000)
- [ ] Testar acesso via `grupototum.com`

---

## 🟢 PROXIMOS PASSOS (Após entrega Manus)

### 6. Zelador Job Noturno
**Status:** Script criado (`scripts/alexandria/zelador-job.js`), falta integrar  
**Função:** Manutenção 04:00 CST

**Implementar:**
- [ ] Detectar chunks órfãos
- [ ] Sugerir merges de domínios
- [ ] Gerar relatório de Knowledge Gaps
- [ ] Atualizar cache local

---

### 7. Router de Intenções
**Status:** A definir  
**Função:** Classificar perguntas e rotear para agentes corretos

**Exemplo:**
- "Qual o SLA?" → Busca direta na Alexandria
- "Gere relatório" → Delegar para Data
- "Crie conteúdo" → Delegar para Pablo/Chandler

---

### 8. Migrar Bíblia Completa
**Status:** Depende da ingestão funcionar  
**Volume:** ~50-100 POPs

**Quando ingestion estiver OK:**
- [ ] Chunkar todos os POPs
- [ ] Ingestão em massa (com rate limiting)
- [ ] Validar buscas (testar se acha o que precisa)
- [ ] Criar índice de documentos no dashboard

---

## ⚪ FUTURO (Pós-Férias ~23/04)

### 9. Avaliar Oracle Cloud
- [ ] Estabilidade da instância
- [ ] Decidir: mantém, migra, ou descarta?

### 10. Revisão de Arquitetura
- [ ] Alexandria rodando estável?
- [ ] Backup automático funcionando?
- [ ] Gargalos identificados?
- [ ] Próximos agentes a criar?

---

## ❌ ARQUIVADO (Concluído ou Cancelado)

| Tarefa | Status | Motivo |
|--------|--------|--------|
| Criar schema Supabase | ✅ Concluído | Você criou a tabela |
| Documentar Giles | ✅ Concluído | Arquivos em `agents/giles/` |
| Configurar Alibaba | ✅ Concluído | Servidor operacional |
| Instalar CyberPanel | ✅ Concluído | Feito, verificar amanhã |
| Criar agentes noturnos | ✅ Concluído | 13 agentes definidos |
| Design System nos apps | ✅ Concluído | Subagente aplicou |
| Transcritor | ✅ Concluído | Funcionando local |

---

## 🎯 FOCO AGORA

1. **Atualizar schema do Supabase** (1 comando SQL)
2. **Migrar Bíblia completa** (~30 min para 100 POPs)
3. **Preparar handoff** pra férias
4. **Criar conta Oracle** (madrugada)

---

*Arquivo atualizado: 2026-04-05*  
*Próxima revisão: Após entrega do Manus*
