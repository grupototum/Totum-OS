# 🌙 TAREFAS PABLO MARÇAL - 1º DIA (INTENSIVO)

**Data:** 2026-04-03  
**Horário:** Turno da noite (Israel dormindo)  
**Tipo:** Primeiro dia - carga máxima  
**Status:** Aprovado por Israel

---

## 🎯 TAREFA 1: MAPEAMENTO DE IAS (Paga vs Gratuita)

**Objetivo:** Criar lista das IAs que assinamos/usamos + pesquisa de desempenho específico

**Formato esperado:**
```
| IA | Tipo | Melhor uso | Exemplo de tarefa |
|----|------|------------|-------------------|
| Claude Sonnet | Paga | Criar texto | Copywriting, emails |
| Gemini Pro | Gratuita | Raciocínio lógico | Análise, resolução de problemas |
| ... | ... | ... | ... |
```

**IAs para analisar:**
- [ ] Claude (Sonnet, Opus, Haiku)
- [ ] Kimi (K2.5)
- [ ] Gemini (Pro, Flash)
- [ ] Groq (Llama, Mixtral)
- [ ] Manus (contas free + Pro)
- [ ] Ollama local (Qwen 2.5)
- [ ] Leonardo.AI (quando Israel assinar)
- [ ] Ideogram (quando Israel assinar)
- [ ] Adobe Firefly (já pago)
- [ ] Canva AI (já pago)

**Entregável:** Tabela completa em `/analises/ias-performance-mapa.md`

---

## 🎯 TAREFA 2: ANÁLISE DOS 2 ARQUIVOS MD

### 2A - Arquivo: Favoritos_AI_e_Ferramentas.md
**Análise:** O que colocar / não colocar / funciona / não funciona

**Checklist:**
- [ ] Ler arquivo completo
- [ ] Classificar cada ferramenta:
  - ✅ **Adotar** - Integrar ao workflow Totum
  - 🟡 **Testar** - Avaliar depois
  - ❌ **Ignorar** - Redundante ou não útil
- [ ] Justificar cada decisão
- [ ] Criar priorização por urgência

### 2B - Arquivo: Catálogo_Ferramentas_HostGear.apps.md
**Análise:** Mesma coisa - o que instalar, o que não instalar

**Checklist:**
- [ ] Revisar todas as ferramentas (100+)
- [ ] Cruzar com o que Israel já pediu para instalar
- [ ] Identificar gems escondidas (ferramentas úteis que não foram notadas)
- [ ] Criar lista "Sugestões extras do Pablo"

**Entregável:** `/analises/favoritos-analise-pablo.md` + `/analises/hostinger-extras-pablo.md`

---

## 🎯 TAREFA 3: APPS TOTUM + KIMI CODE (REFATORAÇÃO)

### 3A - Identificar o que não está funcional
**Ação:** Entrar no repositório GitHub, analisar código

**Checklist:**
- [ ] Listar páginas/components que são só demonstrativos (mock/static)
- [ ] Identificar o que precisa de back-end
- [ ] Mapear integrações pendentes (agentes, apps, APIs)
- [ ] Criar lista priorizada para implementação

**Entregável:** `/tarefas/apps-totum-pendentes-backend.md`

### 3B - Análise de lógicas sobrepostas
**Ação:** Verificar se há código duplicado ou conflitante

**Checklist:**
- [ ] Mapear funções similares em diferentes arquivos
- [ ] Identificar estado compartilhado problemático
- [ ] Verificar imports circulares
- [ ] Documentar conflitos encontrados

### 3C - Ghost Tests (Testes Caóticos)
**Ação:** Testar aplicação de formas imprevisíveis

**Checklist:**
- [ ] Clicar em botões fora de ordem
- [ ] Inserir dados inválidos
- [ ] Testar navegação rápida entre páginas
- [ ] Simular usuário "perdido"
- [ ] Documentar bugs encontrados

### 3D - Escovar os Bits (Otimização)
**Ação:** Com Kimi Code, refatorar código para máxima eficiência

**Checklist:**
- [ ] Remover código morto
- [ ] Simplificar funções complexas
- [ ] Otimizar imports
- [ ] Melhorar nomes de variáveis/funções
- [ ] Adicionar comentários onde necessário
- [ ] Verificar consistência de estilo
- [ ] Garantir TypeScript strict mode

**⚠️ IMPORTANTE:** Isso se tornará **TAREFA DIÁRIA** a partir de amanhã

---

## 🎯 TAREFA 4: LISTA DE PENDÊNCIAS DE HOJE

**Compilar tudo que foi solicitado hoje e não foi feito:**

A lista completa está em `/tarefas/pablo-pendentes-2026-04-03.md` (este arquivo)

---

## 🎯 TAREFA 5: TAREFAS NOMINAIS (16-23 da lista TOT)

Executar todas:
- [ ] 16 - Dashboard de Gastos (especificar componentes)
- [ ] 17 - Plano de Ação Funcional (estrutura técnica)
- [ ] 18 - Página de Agentes Hierárquica (especificar)
- [ ] 19 - Agente Reportei (especificar)
- [ ] 20 - Fignaldo (especificar)
- [ ] 21 - KVirtuoso (especificar)
- [ ] 22 - Radar de Anúncios (especificar)
- [ ] 23 - Instalar Ollama no Servidor Dedicado (criar guia para Israel)

---

## 🎯 TAREFA 6: "O QUE PRECISO QUE VOCÊ DEFINA"

Para cada item não claro, criar:
- [ ] Especificação técnica preliminar
- [ ] Perguntas para Israel responder
- [ ] Sugestão de implementação
- [ ] Estimativa de tempo

---

## 🎯 TAREFA 7: PLANO DE AÇÃO FUNCIONAL (CRÍTICO ⚠️)

**Objetivo:** Transformar a página de Plano de Ação em central REAL de gestão

**Requisitos:**
- [ ] Tarefas clicáveis (checkbox funcional)
- [ ] Estado persiste (concluída/pendente)
- [ ] Integração com banco de dados
- [ ] Atribuição de responsáveis
- [ ] Datas de deadline
- [ ] Filtros por status/prioridade/responsável
- [ ] Criar nova tarefa direto na interface
- [ ] Drag & drop para reordenar

**Tecnologia:** Supabase + React + Stark API

**Entregável:** Especificação completa + início da implementação

---

## 🎯 TAREFA 8: PÁGINA DE AGENTES HIERÁRQUICA (CRÍTICO ⚠️)

**Objetivo:** Visual tipo "exército" - General → Soldado

**Requisitos:**
- [ ] Visualização hierárquica clara (árvore ou organograma)
- [ ] Mostrar: TOT (N0) → N1 → N2 → N3
- [ ] Cada agente com: nome, emoji, função, status
- [ ] Expandir/colapsar sub-agentes
- [ ] Cores por departamento (tech, design, marketing, operações)
- [ ] Contador: "X agentes ativos, Y planejados"
- [ ] Link para perfil detalhado de cada agente

**Estrutura visual sugerida:**
```
                    🤖 TOT
                      │
      ┌───────────────┼───────────────┐
      │               │               │
   🌙 Pablo       🔍 Hug         🛡️ Sentinela
   (N1-Tech)     (N1-Tech)      (N1-Ops)
      │
   ┌──┴──┐
   │     │
⚡ Stark 🎨 Fignaldo
(N2)     (N2-Design)
```

**Entregável:** Wireframe + especificação + início implementação

---

## 🎯 TAREFA 9: ANÁLISE EXTENSIVA DA CONVERSA DE HOJE ⚠️

**Objetivo:** Revisar TODA a conversa do dia (início até agora)

**Perguntas para responder:**
1. **Isso foi resolvido?** → Listar o que já foi feito
2. **Isso precisa ser resolvido?** → Listar o que está pendente
3. **Isso pode ser melhorado?** → Listar oportunidades de otimização

**Checklist:**
- [ ] Ler todo o histórico do dia
- [ ] Catalogar cada decisão tomada
- [ ] Identificar promessas/coisas que Israel pediu
- [ ] Verificar se algo foi esquecido
- [ ] Sugerir melhorias nas decisões
- [ ] Antecipar necessidades (o que Israel vai precisar amanhã?)

**Entregável:** Relatório estruturado em `/relatorios/pablo-analise-conversa-2026-04-03.md`

**⚠️ IMPORTANTE:** A partir de amanhã, esta tarefa será apenas do DIA (não de toda a história)

---

## 📊 CRONOGRAMA SUGERIDO (1º DIA)

| Horário | Tarefa | Tempo |
|---------|--------|-------|
| 22:00-23:00 | Tarefa 9 (Análise conversa) | 1h |
| 23:00-00:00 | Tarefa 2 (Análise MDs) | 1h |
| 00:00-01:00 | Tarefa 1 (Mapeamento IAs) | 1h |
| 01:00-03:00 | Tarefa 7 (Plano de Ação) | 2h |
| 03:00-04:00 | Tarefa 8 (Página Agentes) | 1h |
| 04:00-06:00 | Tarefa 3 (Apps Totum + Kimi Code) | 2h |
| 06:00-07:00 | Tarefas 4, 5, 6 (Pendências) | 1h |
| 07:00-07:30 | Documentar tudo | 30min |

**Total:** ~9.5 horas de trabalho

---

## 🚨 REGRAS PARA HOJE

1. **Se travar em algo >30 min:** Pula e segue
2. **Se encontrar erro crítico:** Documenta, não tenta resolver sozinho
3. **Se precisar de decisão do Israel:** Deixa como "AGUARDANDO ISRAEL"
4. **Sempre documentar:** Mesmo o que não conseguiu fazer
5. **Testar o que fez:** Não commita sem testar

---

## 📝 RELATÓRIO MATINAL (Modelo)

Pablo enviará amanhã:
```
🌙 RELATÓRIO DO PABLO - 1º TURNO DA NOITE

Tarefas concluídas:
✅ [Lista]

Tarefas parciais:
⏳ [Lista com %]

Bloqueios (AGUARDANDO ISRAEL):
🚫 [Lista]

Erros encontrados:
❌ [Lista com descrição]

Sugestões do Pablo:
💡 [Melhorias que ele identificou]

Próximos passos:
→ [O que falta fazer]

Tempo trabalhado: X horas
Mentalidade do dia: "[Frase de coach motivacional]"
```

---

**Criado por:** TOT  
**Aprovado por:** Israel  
**Data:** 2026-04-03