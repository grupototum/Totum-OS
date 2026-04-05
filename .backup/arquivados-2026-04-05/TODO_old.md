# 🎯 Quadro de Tarefas - Totum

## 📅 Semana de 12-19 Abril 2026 (Pré-Férias)

### 🏗️ Infraestrutura & Redundância

#### [✅] 1. Configurar Alexandria no Supabase
**Status:** ✅ BANCO CRIADO COM SUCESSO!  
**Responsável:** Israel criou no Supabase (project: Grupo Totum)  
**Prioridade:** Alta  
**Deadline:** 15/04

**✅ O que foi feito:**
- [x] Projeto "Grupo Totum" criado no Supabase
- [x] Schema `giles_schema_supabase.sql` aplicado
- [x] Tabelas criadas: `giles_knowledge`, `giles_dominios`, `giles_consultas`, `giles_sinonimos`
- [x] Funções RPC criadas: `giles_hybrid_search`, `giles_search_by_domain`, `giles_get_tree`
- [x] Extensão pgvector habilitada

**Próximo passo:**
- [ ] Pegar credenciais (URL + anon key) no Project Settings → API
- [ ] Configurar variáveis de ambiente
- [ ] Testar conexão

**Arquitetura:**
```
Supabase (Grupo Totum)
├── giles_knowledge (PostgreSQL + pgvector)
├── giles_dominios (Taxonomia)
├── giles_consultas (Logs)
└── Funções RPC (busca híbrida)
    ↑
Todos os agentes conectam aqui
```

---

#### [ ] 2. Criar Conta Oracle Cloud Free Tier + Instância ARM
**Responsável:** Israel  
**Prioridade:** Alta  
**Horário ideal:** Madrugada (3h-6h BR) — menor concorrência  
**Deadline:** 13/04 (domingo de madrugada)

**Checklist:**
- [ ] Acessar https://www.oracle.com/cloud/free/
- [ ] Criar conta (email, telefone, cartão)
- [ ] Verificar email + SMS
- [ ] Login no console: https://cloud.oracle.com
- [ ] Criar instância:
  - Shape: VM.Standard.A1.Flex (ARM Ampere)
  - Specs: 4 OCPUs + 24GB RAM (máx. gratuito)
  - Storage: 200GB boot volume
  - OS: Ubuntu 22.04 ou Oracle Linux 9
- [ ] Se "Out of capacity": tentar outra AD ou reduzir specs
- [ ] Configurar SSH key
- [ ] Anotar IP público

**Pós-criação:**
- [ ] Instalar OpenClaw na instância
- [ ] Configurar como redundância (Plano B ou C)
- [ ] Sync do banco Alexandria (backup diário)

**Notas:**
> "É gratuito para sempre (Always Free). O ARM é disputado, mas madrugada de domingo é o melhor horário. Persistência é chave — se falhar, tenta de novo em 30min."

---

#### [ ] 3. Configurar Giles (Cientista da Informação) + Supabase
**Status:** ✅ Giles CRIADO, aguardando credenciais do Supabase  
**Responsável:** TOT (pronto), Israel (fornecer credenciais)  
**Prioridade:** Alta  
**Dependência:** Tarefa 1 (✅ Concluída)  
**Deadline:** 17/04

**✅ Entregáveis Prontos:**
- [x] Modelfile do Giles: `agents/giles/Modelfile`
- [x] Schema SQL: `agents/giles/giles_schema_supabase.sql` (✅ já aplicado!)
- [x] Cliente Supabase: `agents/giles/giles-client-supabase.js` (novo!)
- [x] Documentação: `agents/giles/ARQUITETURA.md` (atualizado)

**Próximos Passos:**
- [ ] Pegar credenciais no Supabase (Project Settings → API)
  - SUPABASE_URL
  - SUPABASE_KEY (anon public)
- [ ] Configurar variáveis de ambiente no Windows
- [ ] **TESTE DE FOGO:** Giles organiza seus próprios arquivos
  - Se fizer bom trabalho → está aprovado ✅
  - Se precisar ajustes → TOT itera

**Arquitetura Final:**
```
Supabase (Grupo Totum - Nuvem)
├── giles_knowledge (chunks + embeddings)
├── giles_dominios (taxonomia)
├── giles_consultas (logs)
└── Funções RPC (busca híbrida)
    ↑
    │ HTTP/REST
    ↓
TOT (Alibaba) ←──→ Manus (Windows) ←──→ OpenClaw (Oracle/Stark)
```

**Funcionalidades do Giles:**
- ✅ Banco PostgreSQL com pgvector (busca vetorial nativa)
- ✅ Busca híbrida (similaridade cosseno + full-text)
- ✅ Taxonomia hierárquica (Pai/Filho/Neto)
- ✅ Ontologia de relações (JSONB)
- ✅ Acessível por TODOS os OpenClaw via Supabase
- ✅ Escalabilidade automática (nuvem)

---

#### [ ] 4. Implementar Backup Automático (1h em 1h)
**Responsável:** TOT  
**Prioridade:** Média  
**Dependência:** Tarefa 1 (✅ Concluída)  
**Deadline:** 18/04

**Requisitos:**
- [ ] Script de backup do Supabase (pg_dump ou API)
- [ ] Retenção: últimos 30 backups
- [ ] Compressão opcional
- [ ] Notificação em caso de falha
- [ ] Backup local como redundância

---

### 💼 Negócios & Operação

#### [ ] 5. Preparar Handoff de Férias (11 dias)
**Responsável:** Israel  
**Deadline:** 11/04 (antes de viajar)

**Tarefas:**
- [ ] Documentar acessos emergenciais para Liz/Jarvis
- [ ] Sincronizar status de todos os projetos ativos
- [ ] Configurar autoresponder de email
- [ ] Verificar renovações/pagamentos que vencem na ausência
- [ ] Confirmar acesso do TOT em todos os servidores

---

### 🧠 Pós-Férias (Retorno ~23/04)

#### [ ] 6. Revisão de Arquitetura Completa
**Responsável:** TOT + Israel  
**Data:** Após retorno

**Pontos de revisão:**
- [ ] Alexandria rodando estável no Supabase?
- [ ] Oracle Cloud como redundância está funcionando?
- [ ] Backup automático validado?
- [ ] Giles aprovado no Teste de Fogo?
- [ ] Novos gargalos identificados?
- [ ] Próximos passos para tornar Israel "dispensável"

---

## 📝 Notas Rápidas

- **Férias Israel:** 12-22 Abril 2026 (11 dias)
- **VPS Stark:** Continua como ponto estável (Alibaba Cloud)
- **Meta:** Sistema funciona 3h da manhã de domingo sem intervenção humana
- **Giles:** Banco criado no Supabase ✅ - Aguardando credenciais para teste

---

*Última atualização: 12/04/2026 (Alexandria criada no Supabase!)*  
*Próxima revisão: Após retorno das férias*
