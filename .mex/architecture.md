# 🏗️ Arquitetura do Sistema

## Decisões Arquiteturais da Totum

---

## ADR-001: Persistência Multi-Destino

**Status**: ✅ Aprovado  
**Data**: 2026-04-05

### Decisão
Implementar persistência de contexto em 5 destinos simultâneos.

### Contexto
Sessões de IA são voláteis. Perdemos contexto a cada reinício.

### Opções Consideradas
1. Apenas arquivos locais → Risco de perda
2. Apenas banco de dados → Dependência de serviço
3. **5 destinos** → Máxima redundância ✅

### Consequências
- Maior complexidade de sync
- Zero tolerância a perda de dados
- Investimento em infraestrutura

---

## ADR-002: Confirmação Obrigatória

**Status**: ✅ Aprovado  
**Data**: 2026-04-05

### Decisão
Toda persistência DEVE ser confirmada pelo usuário antes de propagar.

### Contexto
Evitar poluir a Alexandria com ruído.

### Implementação
1. Salvar em `ativas/` (temporário)
2. Perguntar: "Salvar no Alexandria? [S/N]"
3. Se SIM: mover para `persistidas/` + sync
4. Se NÃO: mover para `recusados/`

---

## ADR-003: Agente GILES como Bibliotecário

**Status**: ✅ Aprovado  
**Data**: 2026-04-05

### Decisão
Agente dedicado (GILES) responsável por indexação e catalogação.

### Baseado em
Rupert Giles de Buffy the Vampire Slayer — bibliotecário/watcher.

### Responsabilidades
- Indexar todo conhecimento
- Conectar informações desconectadas
- Busca < 3 segundos
- Garantir encontrabilidade

---

## ADR-004: Formato Markdown para Contexto

**Status**: ✅ Aprovado  
**Data**: 2026-04-05

### Decisão
Todo contexto salvo em formato Markdown com frontmatter YAML.

### Por quê
- Legível por humanos
- Parseável por máquinas
- Versionável no Git
- Suporte a rich text

### Estrutura
```markdown
---
id: ctx_20260405_035500_a1b2c3d4
tipo: decisao
categoria: sistema
origem: TOT
data: 2026-04-05T03:55:00
status: confirmado
---

# Conteúdo...
```

---

*Arquitetura mantida por: GILES 🧙‍♂️*
