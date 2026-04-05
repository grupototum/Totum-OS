# 📋 POP-001: CRIAÇÃO DE AGENTES - TOTUM

**Código:** POP-001  
**Versão:** 1.0  
**Data:** 2026-04-04  
**Responsável:** Data + Pablo  
**Status:** Aprovado

---

## 🎯 OBJETIVO

Padronizar o processo de criação de novos agentes na Totum, garantindo consistência, qualidade e integração com o ecossistema existente.

---

## 📊 FLUXO DO PROCESSO

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  1. DEFINIR  │───→│ 2. DOCUMENTAR│───→│  3. DESENVOLVER│───→│ 4. TESTAR   │
│   NECESSIDADE│    │   ESPECIFICAÇÃO│   │              │    │             │
└──────────────┘    └──────────────┘    └──────────────┘    └──────┬──────┘
                                                                    │
┌──────────────┐    ┌──────────────┐    ┌──────────────┐           │
│ 7. MELHORAR  │←───│ 6. DEPLOY    │←───│ 5. VALIDAR   │←──────────┘
│  CONTINUAMENTE│    │   PRODUÇÃO   │    │   COM USUÁRIO│
└──────────────┘    └──────────────┘    └──────────────┘
```

---

## 📝 ETAPA 1: DEFINIR NECESSIDADE

### Checklist de Justificativa:
- [ ] Qual problema o agente resolve?
- [ ] Qual departamento pertence?
- [ ] Qual tipo de agente é mais adequado?
- [ ] Qual a prioridade? (Crítica/Alta/Média/Baixa)
- [ ] Qual o responsável pelo desenvolvimento?
- [ ] Qual a deadline estimada?

### Template de Definição:
```markdown
## Agente: [NOME]

**Problema:** [Descreva a dor que resolve]

**Solução:** [O que o agente faz em 1 frase]

**Departamento:** [Atendimento/Tráfego/Radar/Infra]

**Tipo:** [Conversacional/Processamento/Híbrido/Infra]

**Prioridade:** [Crítica/Alta/Média/Baixa]

**Responsável:** [Pablo/Data/Hug/Outro]

**Deadline:** [Data estimada]

**Dependências:** [Quais agentes/apps precisam estar prontos antes?]

**Apps Integrados:** [Docmost/N8N/Ollama/Redis/etc]
```

---

## 📝 ETAPA 2: DOCUMENTAR ESPECIFICAÇÃO

### 2.1 - Documentação no Docmost

Criar página em: `Agentes/[Departamento]/[Nome do Agente]`

#### Conteúdo obrigatório:

```markdown
# 🤖 [Nome do Agente]

## 📋 Visão Geral
**Tipo:** [Conversacional/Processamento/Híbrido/Infra]  
**Status:** [Planejado/Em Desenvolvimento/Teste/Ativo]  
**Prioridade:** [Crítica/Alta/Média/Baixa]  
**Responsável:** [Nome]

## 🎯 Objetivo
[Descrição clara do que o agente faz e qual problema resolve]

## 🔌 Entradas (Inputs)
| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| [Tipo] | [O que recebe] | [Exemplo real] |

## 📤 Saídas (Outputs)
| Tipo | Descrição | Formato |
|------|-----------|---------|
| [Tipo] | [O que entrega] | [JSON/Texto/Ação] |

## 🧠 Prompts Mestres

### Prompt 1: [Nome do prompt]
```
[Prompt completo e testado]
```

### Prompt 2: [Nome do prompt]
```
[Prompt completo e testado]
```

## 🔗 Integrações
- **Apps:** [Lista de apps que usa]
- **Agentes:** [Quais agentes se conecta]
- **Bancos:** [Tabelas/dados que acessa]

## 📊 Métricas de Sucesso
- [ ] [Métrica 1 - ex: Tempo de resposta < 5s]
- [ ] [Métrica 2 - ex: Precisão > 90%]
- [ ] [Métrica 3 - ex: Uso 7 dias > 50x]

## 🐛 Casos de Erro Conhecidos
| Erro | Causa | Solução |
|------|-------|---------|
| [Erro] | [Causa] | [Solução] |

## 📝 Changelog
| Data | Versão | Mudança | Autor |
|------|--------|---------|-------|
| [Data] | 1.0 | Criação | [Nome] |
```

### 2.2 - Inserir no Plano de Ação (Supabase)

Executar SQL:
```sql
INSERT INTO public.agentes (
  nome, departamento, funcao, tipo, status, prioridade, 
  responsavel, deadline, apps_integrados, is_new
) VALUES (
  '[NOME]', '[DEPARTAMENTO]', '[FUNÇÃO]', '[TIPO]', 
  'pendente', '[PRIORIDADE]', '[RESPONSAVEL]', 
  '[DEADLINE]', ARRAY['[APP1]', '[APP2]'], true
);
```

---

## 📝 ETAPA 3: DESENVOLVER

### 3.1 - Configuração N8N (se necessário)

Criar workflow com:
- [ ] Trigger apropriado (webhook/cron/manual)
- [ ] Nós de processamento
- [ ] Integrações com apps
- [ ] Error handling
- [ ] Logging

### 3.2 - Prompts Otimizados

Para cada prompt:
- [ ] Testar 3 variações mínimo
- [ ] Documentar qual funciona melhor
- [ ] Criar versão "fallback" (quando não funciona)
- [ ] Medir tokens/custo médio

### 3.3 - Integração Apps

| App | O que integrar | Como testar |
|-----|----------------|-------------|
| Docmost | [Dados/documentos] | [Teste] |
| N8N | [Workflows] | [Teste] |
| Ollama | [Modelos locais] | [Teste] |
| Redis | [Cache/filas] | [Teste] |

---

## 📝 ETAPA 4: TESTAR

### 4.1 - Testes Unitários
- [ ] Testar cada prompt isoladamente (10x mínimo)
- [ ] Verificar consistência das respostas
- [ ] Medir tempo de resposta
- [ ] Validar formatos de saída

### 4.2 - Testes de Integração
- [ ] Testar com dados reais (anônimos)
- [ ] Verificar conexão com outros agentes
- [ ] Testar fluxo completo (input → processamento → output)

### 4.3 - Testes com Usuário
- [ ] Pablo testa e aprova
- [ ] Israel testa e aprova
- [ ] Registrar feedback
- [ ] Ajustar conforme necessário

---

## 📝 ETAPA 5: VALIDAR COM USUÁRIO

### Critérios de Aceitação:
- [ ] Resolve o problema proposto?
- [ ] Resposta em tempo adequado?
- [ ] Custo de créditos aceitável?
- [ ] Fácil de usar?
- [ ] Documentação clara?

### Aprovação:
- [ ] ✅ Aprovado por Pablo
- [ ] ✅ Aprovado por Israel
- [ ] Data: ___/___/___

---

## 📝 ETAPA 6: DEPLOY EM PRODUÇÃO

### Checklist de Deploy:
- [ ] Atualizar status no Supabase: `ativo`
- [ ] Atualizar documentação no Docmost
- [ ] Configurar monitoramento (Beszel)
- [ ] Criar alertas de erro (N8N)
- [ ] Notificar time no grupo
- [ ] Adicionar ao Dashboard de Agentes

### Comunicação:
```markdown
🚀 **Novo Agente Ativo: [NOME]**

**O que faz:** [Descrição curta]
**Como usar:** [Instrução rápida]
**Documentação:** [Link Docmost]
**Responsável:** [Nome]

@channel
```

---

## 📝 ETAPA 7: MELHORAR CONTINUAMENTE

### 7.1 - Monitoramento
- Revisar métricas semanalmente
- Coletar feedback dos usuários
- Registrar casos de erro

### 7.2 - Atualizações
- Revisar prompts a cada 30 dias
- Atualizar integrações quando apps mudarem
- Documentar evolução no changelog

### 7.3 - Otimização
- Reduzir custo de créditos
- Melhorar tempo de resposta
- Aumentar precisão

---

## 📎 ANEXOS

### A. Tipos de Agente

| Tipo | Descrição | Quando usar | Exemplo |
|------|-----------|-------------|---------|
| **Conversacional** | Interage via chat | Precisa de diálogo | TOT, Data |
| **Processamento** | Input → Output | Automação direta | KVirtuoso |
| **Híbrido** | Chat + Automação | Precisa de ambos | Reportei |
| **Infra** | Sistema/backend | Manutenção/MEX | MEX |

### B. Níveis de Prioridade

| Prioridade | SLA de Criação | Quando usar |
|------------|----------------|-------------|
| 🔴 Crítica | 7-14 dias | Bloqueia operação |
| 🟠 Alta | 14-21 dias | Melhora performance |
| 🟡 Média | 21-30 dias | Nice to have |
| 🟢 Baixa | 30-60 dias | Futuro |

### C. Responsáveis

| Responsável | Especialidade | Agentes típicos |
|-------------|---------------|-----------------|
| **Pablo** | Negócio/Operação | Atendimento, Tráfego, Radar |
| **Data** | Técnico/Dev | Infra, Integrações, MEX |
| **Hug** | Ferramentas/Research | Radar, Trends |

---

## ✅ CHECKLIST FINAL

Antes de marcar como "Concluído":

- [ ] Documentação completa no Docmost
- [ ] Inserido no Supabase (tabela `agentes`)
- [ ] Prompts testados e otimizados
- [ ] Integrações funcionando
- [ ] Testado com usuário
- [ ] Deploy em produção
- [ ] Time notificado
- [ ] Métricas configuradas

---

*POP criado por: TOT*  
*Revisado por: Israel (Miguel)*  
*Aprovado em: 2026-04-04*  
*Próxima revisão: 2026-05-04*