# SKILL-CODIGOS-001: Otimizadores de Interação com IA

## 📋 INFORMAÇÕES GERAIS

**Código:** SKILL-CODIGOS-001  
**Nome:** Otimizadores de Interação  
**Tipo:** Skill Universal (funciona em QUALQUER IA)  
**Categoria:** Produtividade / Eficiência  
**Custo:** R$ 0  
**Tempo de aplicação:** Instantâneo (< 1 segundo)  

---

## 🎯 OBJETIVO

Conjunto de códigos, comandos e padrões que otimizam interações com IAs (Claude, GPT, Gemini, Ollama, etc.), tornando-as mais rápidas, baratas, precisas e livres de poluição de contexto.

**Aplicável por:** Qualquer agente ou usuário  
**Momento de uso:** Antes de iniciar uma tarefa específica  
**Benefício:** Economia de tokens, velocidade, precisão, organização

---

## 🔑 OS 5 CÓDIGOS FUNDAMENTAIS

### 1️⃣ `/ghost` - Modo Fantasma

**O que é:** Executa ação sem deixar rastro no contexto/histórico  
**Quando usar:**
- Testes e experimentos
- Tarefas temporárias
- Não quer poluir contexto principal
- Vai descartar resultado

**Como usar:**
```
/ghost [sua solicitação]
```

**Exemplo:**
```
/ghost Teste 5 variações de headline para anúncio
```

**Benefícios:**
- ✅ Contexto limpo
- ✅ Histórico organizado  
- ✅ Economia de tokens a longo prazo
- ✅ Foco no que importa

**Compatibilidade:** Claude Code, ChatGPT (temp chat), Ollama local

---

### 2️⃣ `artifacts` - Modo Artefato

**O que é:** Gera outputs visuais/interativos editáveis diretamente  
**Quando usar:**
- Criar componentes React/HTML
- Gerar visualizações de dados
- Prototipar interfaces
- Criar código executável

**Como usar:**
```
Use artifacts para criar [descrição]
```

**Exemplo:**
```
Use artifacts para criar um dashboard de métricas com:
- Gráfico de vendas
- Cards de KPI
- Filtro por data
```

**Benefícios:**
- ✅ Visualização instantânea
- ✅ Edição direta no chat
- ✅ Download do código
- ✅ Iteração rápida

**Compatibilidade:** Claude (nativo), ChatGPT Canvas, Ollama (com configuração)

---

### 3️⃣ `OODA` - Loop de Decisão

**O que é:** Framework militar: Observe → Orient → Decide → Act  
**Quando usar:**
- Decisões complexas sob pressão
- Análise de múltiplos cenários
- Resolução de problemas urgentes
- Situações com incerteza

**Como usar:**
```
Aplique OODA: [descreva situação]
```

**Exemplo:**
```
Aplique OODA: Cliente quer cancelar por preço alto, 
mas usamos 80% das funcionalidades. 
O que fazer em 10 minutos?
```

**Benefícios:**
- ✅ Clareza em caos
- ✅ Decisão rápida e estruturada
- ✅ Reduce paralisia analítica
- ✅ Ação orientada a dados

**Compatibilidade:** QUALQUER IA (é um framework de prompting)

---

### 4️⃣ `L99` - Nível 99 (Expert Mode)

**O que é:** Desbloqueia modo avançado/experto  
**Quando usar:**
- Problemas técnicos complexos
- Otimizações avançadas
- Arquitetura de sistemas
- Quer sair do básico

**Como usar:**
```
Modo L99: [descrição técnica complexa]
```

**Exemplo:**
```
Modo L99: Otimize esta query PostgreSQL 
com índices parciais e particionamento 
para 10M+ registros
```

**Benefícios:**
- ✅ Acesso a técnicas avançadas
- ✅ Menos restrições de segurança (cuidado!)
- ✅ Soluções sofisticadas
- ✅ Performance máxima

**Compatibilidade:** Claude, GPT-4, Gemini Advanced

---

### 5️⃣ `/god mode` - Modo Deus

**O que é:** Acesso total, último recurso  
**Quando usar:**
- EMERGENCIAS apenas
- Quando nada mais funciona
- Problemas críticos de sistema
- Situações limite

**Como usar:**
```
/god mode [justificativa da emergência]
```

**Exemplo:**
```
/god mode Sistema de produção down, 
clientes sem acesso, preciso de solução 
radical em 5 minutos
```

**⚠️ ATENÇÃO:**
- Use com responsabilidade EXTREMA
- Documente sempre que usar
- Requer aprovação se for decisão estratégica
- Pode sugerir soluções arriscadas

**Compatibilidade:** Claude (com restrições), Ollama local (sem limites)

---

## 🎛️ QUADRO DECISÓRIO RÁPIDO

| Situação | Código | Por quê |
|----------|--------|---------|
| Testar ideias | `/ghost` | Não polui contexto |
| Criar visual/código | `artifacts` | Output interativo |
| Decisão urgente | `OODA` | Clareza rápida |
| Problema técnico complexo | `L99` | Expert mode |
| Emergência crítica | `/god mode` | Último recurso |

---

## 🔧 INTEGRAÇÃO COM SISTEMA

### Para Agentes (Automático):

```python
def verificar_antes_de_executar(tarefa):
    """
    Micro-checklist automático (< 100ms)
    Executado pelo GUARDIÃO antes de qualquer ação
    """
    sugestoes = []
    
    # Testes e experimentos
    if tarefa.tipo == "teste" and not tarefa.usar_ghost:
        sugestoes.append("💡 Use /ghost - não poluirá o contexto")
    
    # Criação de código/visual
    if tarefa.gerar_codigo and not tarefa.usar_artifacts:
        sugestoes.append("💡 Use artifacts - output interativo e editável")
    
    # Decisões complexas
    if tarefa.decisao_complexa and not tarefa.usar_ooda:
        sugestoes.append("💡 Use OODA - estrutura a decisão")
    
    # Problemas técnicos avançados
    if tarefa.complexidade == "alta" and not tarefa.usar_l99:
        sugestoes.append("💡 Use L99 - desbloqueie modo expert")
    
    # Emergências
    if tarefa.urgencia == "critica" and not tarefa.usar_godmode:
        sugestoes.append("⚠️ Considere /god mode - EMERGÊNCIA")
    
    return sugestoes
```

### Para Usuários (Manual):

Sempre que for iniciar uma tarefa, pergunte:
1. "Isso é um teste?" → Use `/ghost`
2. "Vou criar código/visual?" → Use `artifacts`
3. "Preciso decidir algo complexo rápido?" → Use `OODA`
4. "É técnico e difícil?" → Use `L99`
5. "É emergência?" → Use `/god mode`

---

## 📊 MÉTRICAS DE SUCESSO

| Métrica | Alvo |
|---------|------|
| Redução de tokens desperdiçados | 40% |
| Velocidade de iteração | +60% |
| Organização do contexto | 95% limpo |
| Precisão das soluções | +35% |
| Economia de custo IA | 50% |

---

## 🔗 CONEXÕES

- **Usado por:** QUALQUER agente ou usuário
- **Verificado por:** GUARDIÃO (integração RuFlow)
- **Documentado por:** Giles (Alexandria)
- **Atualizado por:** YODA (pesquisa contínua)

---

## 📝 EXEMPLOS DE USO NA TOTUM

### Exemplo 1: Teste de Headline
```
Usuário: Teste 10 variações de headline para anúncio
Guardião: 💡 Sugiro /ghost - são testes, não poluirá contexto
Agente: /ghost Crie 10 headlines para produto X...
```

### Exemplo 2: Criar Dashboard
```
Usuário: Crie um dashboard de vendas
Guardião: 💡 Sugiro artifacts - poderá ver e editar visual
Agente: Use artifacts para criar dashboard React com...
```

### Exemplo 3: Decisão de Cliente
```
Usuário: Cliente quer desconto de 50%, o que faço?
Guardião: 💡 Sugiro OODA - decisão complexa, use o framework
Agente: Aplique OODA: Cliente solicitou desconto de 50%...
```

---

*Criado em: 2026-04-04*  
*Criador: TOT (com Israel)*  
*Status: ✅ Ativa*  
*Aplicação: Universal (qualquer IA)*
