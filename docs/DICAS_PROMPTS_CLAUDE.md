# 🎯 DICAS DE PROMPTS PARA CLAUDE - AGENTES TOTUM
## Guia mestre de engenharia de prompts para máxima performance

**Data:** Abril 2026  
**Aplicação:** Todos os agentes da Totum  
**Base:** Melhores práticas de prompt engineering + [conteúdo do vídeo MaverickGPT]

---

## 🧠 PRINCÍPIOS FUNDAMENTAIS

### 1. Clareza Extrema
```
❌ "Me ajuda com marketing?"
✅ "Crie 3 variações de headline para anúncio de [produto] 
    direcionado a [público], focando em [benefício principal],
    com tom [descritivo], máximo 50 caracteres cada"
```

### 2. Contexto Completo
Sempre forneça:
- **Quem** está pedindo (persona do agente)
- **O quê** precisa ser feito
- **Por que** é importante
- **Para quem** é destinado
- **Quando** precisa estar pronto
- **Como** será usado

### 3. Estrutura em Camadas
```
CAMADA 1: Instrução direta (o que fazer)
CAMADA 2: Contexto (por que fazer)
CAMADA 3: Restrições (limites)
CAMADA 4: Exemplos (referências)
CAMADA 5: Formato de saída (como entregar)
```

---

## 📝 TEMPLATE BASE DE PROMPT (Usar em todos os agentes)

```markdown
### CONTEXTO
Você é [NOME DO AGENTE], [função] da Totum.
[2-3 frases sobre personalidade e essência]

### TAREFA
[Descreva especificamente o que precisa ser feito]

### RESTRIÇÕES
- [Limite 1]
- [Limite 2]
- [Limite 3]

### SLAs
- [Tempo de resposta]
- [Padrão de qualidade]

### FORMATO DE SAÍDA
[Como deve ser estruturado o resultado]
[Exemplo do ✅]
[Exemplo do ❌]

### CONTEXTO ADICIONAL
[Dados específicos do cliente/projeto]
```

---

## 🎭 DICAS POR TIPO DE TAREFA

### Para Criação de Conteúdo
```markdown
DICAS ESPECÍFICAS:
1. SEMPRE forneça o público-alvo exato
2. INCLUA o tom de voz desejado (formal, descontraído, urgente...)
3. ESPECIFIQUE o formato (carrossel, Reels, texto puro)
4. MENCIONE o objetivo (educar, vender, engajar)
5. DE o contexto do cliente (o que vende, para quem)

EXEMPLO BOM:
"Crie legenda para post de Instagram sobre automação de marketing 
para donos de pequenas empresas de e-commerce. 
Tom: descontraído mas profissional. 
Objetivo: gerar comentários com dúvidas. 
Inclua 5 hashtags estratégicas. 
Máximo 150 palavras."
```

### Para Análise de Dados
```markdown
DICAS ESPECÍFICAS:
1. FORNEÇA os dados em formato estruturado
2. ESPECIFIQUE o tipo de análise (tendência, comparação, correlação)
3. DEFINA o formato de saída (tabela, gráfico descrito, insights)
4. PEDIDA ação recomendada baseada na análise

EXEMPLO BOM:
"Analise os seguintes dados de campanha:
[insira dados em CSV ou JSON]

Identifique:
1. Qual criativo teve melhor CTR
2. Qual horário teve melhor conversão  
3. Tendência dos últimos 7 dias
4. Recomendação de ajuste para próxima semana"
```

### Para Tomada de Decisão
```markdown
DICAS ESPECÍFICAS:
1. APRESENTE as opções claramente
2. DEFINA critérios de decisão
3. PESO de cada critério (se aplicável)
4. PEDIDA justificativa da recomendação

EXEMPLO BOM:
"Preciso decidir entre 2 criativos para campanha:

Opção A: [descrição]
- CTR: 2.5%
- Custo por lead: R$18

Opção B: [descrição]
- CTR: 3.2%
- Custo por lead: R$22

Critérios de decisão:
1. Custo efetivo (peso 40%)
2. Volume de leads (peso 35%)
3. Alinhamento com marca (peso 25%)

Recomende qual usar e justifique."
```

### Para Automação/Integrações
```markdown
DICAS ESPECÍFICAS:
1. DESCREVA o fluxo completo (entrada → processamento → saída)
2. LISTE todas as ferramentas envolvidas
3. ESPECIFIQUE os gatilhos (triggers)
4. DEFINA os dados que fluem entre sistemas
5. MENCIONE tratamento de erros

EXEMPLO BOM:
"Crie fluxo de automação n8n:

ENTRADA: Novo lead no Instagram
↓
PROCESSAMENTO:
- Enviar mensagem de boas-vindas no WhatsApp
- Criar contato no Kommo
- Agendar follow-up para +2 dias
↓
SAÍDA: Lead nutricionado no funil

FERRAMENTAS: Instagram API, WhatsApp Business API, Kommo
TRATAMENTO DE ERRO: Se WhatsApp falhar, enviar e-mail"
```

---

## ✅ CHECKLIST ANTES DE ENVIAR PROMPT

```
□ Contexto suficiente fornecido?
□ Tarefa específica e mensurável?
□ Restrições claras definidas?
□ Formato de saída especificado?
□ Exemplos de bom/ruim incluídos?
□ Prazo/SLA mencionado?
□ Tom de voz do agente respeitado?
□ Dados necessários anexados?
```

---

## 🚫 ERROS COMUNS A EVITAR

| Erro | Exemplo Ruim | Correção |
|------|--------------|----------|
| **Vago** | "Faça algo legal" | "Crie 3 opções de headline com urgência" |
| **Sem contexto** | "Analise isso" | "Analise como [público] reagiria a isso" |
| **Múltiplas tarefas** | "Crie post, analise dados e monte estratégia" | Dividir em 3 prompts separados |
| **Sem formato** | "Me fale sobre marketing" | "Liste 5 estratégias de marketing para [nicho]" |
| **Contraditório** | "Seja formal e descontraído" | Escolha um tom e mantenha |

---

## 💡 DICAS AVANÇADAS

### 1. Use Delimitadores
```
Use ### ou """ para separar seções:

### CONTEXTO
[texto]

### INSTRUÇÃO
[texto]

### DADOS
"""
[dados em JSON/CSV]
"""
```

### 2. Few-Shot Prompting
```
Forneça exemplos do que quer:

Exemplo de saída desejada:
"🎯 RESULTADO: CTR aumentou 25%
📊 DADO: 3.2% → 4.0%
💡 INSIGHT: Criativo com rosto teve melhor performance"

Agora analise [novos dados] no mesmo formato.
```

### 3. Chain of Thought
```
Para tarefas complexas, peça raciocínio passo a passo:

"Analise o seguinte passo a passo:
1. Primeiro, identifique...
2. Depois, calcule...
3. Em seguida, compare...
4. Finalmente, recomende..."
```

### 4. Persona Consistente
```
Mantenha a mesma persona em todas as interações:

"Você é o Controlador Totum - guardião financeiro, 
preciso, direto. NUNCA use emojis. SEMPRE use formato:
STATUS: [status] | VALOR: [valor] | PRAZO: [data]"
```

---

## 📚 RECURSOS ADICIONAIS

### Links Úteis
- [Anthropic Prompt Engineering Guide](https://docs.anthropic.com/)
- [Best Practices for Claude](https://docs.anthropic.com/claude/docs)
- [Totum - Central de Agentes](../../PROMPT_LOVABLE_AGENTES.md)

### Templates Prontos
Ver arquivos de personalidade de cada agente:
- `PERSONALIDADE_CONTROLADOR_TOTUM.md`
- `PERSONALIDADE_CARTOGRAFO_TOTUM.md`
- `PERSONALIDADE_VENDEDOR_TOTUM.md`
- `PERSONALIDADE_DIRETOR_ARTE.md`
- `PERSONALIDADE_ESPECIALISTA_CRM.md`

---

## 🔄 ATUALIZAÇÃO

**Última atualização:** 2026-04-01  
**Próxima revisão:** Após feedback dos agentes em produção  
**Responsável:** Sistema de atualização contínua

---

*Guia de prompts para engenharia de instruções com Claude*  
*Totum - Sistema Multi-Agente*  
*Abril 2026*
