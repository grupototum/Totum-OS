# MEX - Modelo Contextual Expansível

## O que é

O MEX é o **sistema de banco de dados de contextos** da Alexandria. Ele armazena, organiza e relaciona todo o conhecimento da Totum de forma estruturada e recuperável.

## Filosofia

> *"Conhecimento não é arquivo. Conhecimento é relação."*

Um documento isolado tem valor limitado. Um documento **relacionado** com outros documentos, indexado, categorizado e versionado tem valor exponencial.

## Estrutura

```
mex/
├── index.json                 # Índice mestre (este arquivo)
├── schemas/                   # Validação de dados
│   ├── context.schema.json    # Schema de contextos
│   └── metadata.schema.json   # Schema de metadados
├── contexts/                  # Contextos por domínio
│   ├── totum/                 # Conhecimento de negócio
│   ├── stark/                 # Conhecimento técnico
│   ├── alexandria/            # Conhecimento sobre o sistema
│   └── pixel/                 # Conhecimento do CRM
├── embeddings/                # Busca semântica (futuro)
└── sync/                      # Sincronização entre instâncias
```

## Formato de Contexto

Todo contexto segue o schema JSON definido em `schemas/context.schema.json`:

```json
{
  "id": "ctx_dominio_categoria_nome",
  "domain": "stark|totum|alexandria|pixel",
  "category": "deploy|arquitetura|pop|sla|...",
  "tags": ["tag1", "tag2"],
  "version": "1.0",
  "created": "2026-04-05T10:00:00Z",
  "relations": [
    {"to": "ctx_outro", "type": "depends|requires|extends|replaces|related"}
  ],
  "content": {
    "summary": "Resumo do conteúdo",
    "data": { },
    "markdown": "Conteúdo completo"
  }
}
```

## Tipos de Relações

| Tipo | Significado | Exemplo |
|------|-------------|---------|
| **depends** | A depende de B | Deploy depende de SSL |
| **requires** | A requer B como pré-requisito | POP requer ferramenta X |
| **extends** | A estende/expande B | POP v2 extends POP v1 |
| **replaces** | A substitui B (B obsoleto) | Nova arquitetura replaces antiga |
| **related** | A tem relação com B | Análise related ao Decisão |

## Como Adicionar Contexto

1. Criar arquivo JSON no domínio apropriado (`contexts/{dominio}/`)
2. Seguir o schema em `schemas/context.schema.json`
3. Mapear relações com contextos existentes
4. Atualizar índice do domínio (`contexts/{dominio}/index.json`)
5. Atualizar índice mestre (`index.json`)

## Como Consultar Contexto

**Via GILES:**
```
"GILES, qual o contexto de deploy React?"
→ Retorna ctx_stark_deploy_react_vps + relacionados
```

**Via busca direta:**
1. Abrir índice do domínio
2. Filtrar por categoria/tags
3. Seguir relações para contextos conectados

## Integração

- **GILES:** Indexa e recupera contextos
- **ABED:** Analisa contextos para sugerir melhorias
- **Agentes:** Consultam contexto antes de executar tarefas
- **Sync:** Replica para redundância

## Versionamento

Contextos usam versionamento semântico simplificado:
- **X.Y** onde X = major (mudança estrutural), Y = minor (atualização)
- Versões antigas mantidas com status "obsoleto"
- Nova versão deve relacionar-se com anterior via `replaces`

---

*Sistema MEX v1.0 - Alexandria*
