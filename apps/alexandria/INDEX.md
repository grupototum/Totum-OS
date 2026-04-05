# 📇 ALEXANDRIA INDEX

> Índice de navegação da Biblioteca Central de Conhecimento

---

## 🏛️ O QUE É

A **Alexandria** é a biblioteca central da Totum — inspirada na mítica Biblioteca de Alexandria, mas digital, semântica e impossível de queimar.

- **Documentação:** [README.md](./README.md)
- **Arquitetura:** [../ESTRUTURA_ALEXANDRIA.md](../ESTRUTURA_ALEXANDRIA.md)
- **Hub de Dados:** Supabase (project: Grupo Totum)

---

## 📂 ESTRUTURA

| Pasta | Conteúdo | Descrição |
|-------|----------|-----------|
| [agentes/](./agentes/) | Definições de agentes | Personalidades e comportamentos |
| [contextos/](./contextos/) | Contextos persistentes | Memórias entre sessões |
| [pops/](./pops/) | Protocolos Operacionais | POPs e SLAs |
| [skills/](./skills/) | Skills documentadas | Capacidades dos agentes |
| [temas/](./temas/) | Conhecimento por tema | Organização temática |
| [indice/](./indice/) | Índices de busca | Índice semântico (GILES) |
| [sync/](./sync/) | Jobs de sincronização | Estado dos syncs |

---

## 🧙‍♂️ GILES — O Bibliotecário

GILES é o guardião da Alexandria.

**Responsabilidades:**
- 📚 Catalogar todo conhecimento
- 🔗 Conectar informações
- 🔍 Facilitar busca (< 3 segundos)
- 📊 Manter índices atualizados
- 🏛️ Garantir que nada se perca

**Arquivos:**
- [../agents/giles/ARQUITETURA.md](../agents/giles/ARQUITETURA.md)
- [../agents/giles/giles_schema_supabase.sql](../agents/giles/giles_schema_supabase.sql)

---

## 🔄 FLUXO DE TRABALHO

```
1. Recebe novo contexto (confirmado)
2. Extrai metadados e tags
3. Indexa para busca semântica
4. Conecta com conhecimento relacionado
5. Atualiza índices globais
```

---

## 📋 CONVENÇÕES

| Tipo | Formato | Exemplo |
|------|---------|---------|
| Contextos | `ctx_[YYYYMMDD]_[HHMMSS]_[hash].md` | `ctx_20260405_143022_a1b2c3d4.md` |
| Agentes | `[nome].md` | `giles.md`, `tot.md` |
| POPs | `POP-[NUM]-[NOME].md` | `POP-001-CRIACAO-AGENTES.md` |
| Skills | `skill-[nome]-[versao].md` | `skill-codigos-001.md` |

---

## 📊 MÉTRICAS

| Métrica | Valor Atual | Meta |
|---------|-------------|------|
| Contextos pendentes | 0 | < 5 |
| Contextos confirmados | 0 | > 100/dia |
| Tempo de busca | N/A | < 3s |
| Taxa de sync | 0% | > 99% |

---

*Index da Alexandria*  
*Mantido por: GILES 🧙‍♂️*  
*Atualizado: 2026-04-05*
