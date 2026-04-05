# 🏛️ ARQUITETURA TOTUM - CENTRAL DE CONTEXTO E SKILLS
## Visão de plataforma unificada para o VPS Stark

**Data:** Abril 2026  
**Ambiente:** VPS Stark (produção)  
**Status:** Especificação técnica

---

## 🎯 VISÃO GERAL

Criar uma **Central Unificada** no Stark que integre:
1. **Portal de POPs** - A Bíblia acessível a todos
2. **Sistema de Contexto** - Arquivos de contexto transformáveis
3. **Central de Skills** - Criação, edição e compartilhamento de skills

---

## 📐 ARQUITETURA DE COMPONENTES

```
┌─────────────────────────────────────────────────────────────────┐
│                     TOTUM CENTRAL PLATFORM                       │
│                         (Stark VPS)                              │
└─────────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   ┌────┴────┐           ┌────┴────┐          ┌────┴────┐
   │  PORTAL │           │CONTEXTO │          │ SKILLS  │
   │  POPs   │           │  HUB    │          │ CENTRAL │
   └────┬────┘           └────┬────┘          └────┬────┘
        │                     │                     │
   ┌────┴────┐           ┌────┴────┐          ┌────┴────┐
   │• Bíblia │           │• Arquivos│         │• Criar  │
   │• SLAs   │           │• Transform│        │• Editar │
   │• KPIs   │           │• Versionar│        │• Compart.│
   │• Search │           │• Acessar │         │• Template│
   └─────────┘           └─────────┘          └─────────┘
```

---

## 1️⃣ PORTAL DE POPs

### Funcionalidades

| Feature | Descrição | Benefício |
|---------|-----------|-----------|
| **Visualização** | Renderização da Bíblia em interface web | Fácil acesso, navegação |
| **Busca Full-text** | Pesquisa em todos os POPs | Encontrar rapidamente |
| **Filtros** | Por departamento, gatilho, SLA | Navegação estruturada |
| **Versionamento** | Histórico de mudanças na Bíblia | Rastreabilidade |
| **Comentários** | Anotações por departamento | Colaboração |
| **Checklists** | Marcar cumprimento de gatilhos | Controle operacional |

### Estrutura de Dados

```json
{
  "pop": {
    "departamento": "atendimento",
    "status": "versao_final",
    "gatilhos": [
      {
        "id": "G1",
        "nome": "Recebimento da Demanda",
        "tipo": "gatilho",
        "acoes": [...],
        "sla": "2h"
      }
    ],
    "slas": [...],
    "kpis": [...],
    "regras": [...],
    "versao": "1.0",
    "updated_at": "2026-04-01"
  }
}
```

### Endpoints Propostos

```
GET  /api/pops                    # Lista todos os POPs
GET  /api/pops/{departamento}     # POP específico
GET  /api/pops/{departamento}/gatilhos
GET  /api/pops/search?q={termo}
POST /api/pops/{id}/checklist     # Marcar progresso
```

---

## 2️⃣ SISTEMA DE CONTEXTO (CONTEXT HUB)

### Conceito
Central onde **todos os agentes** (Miguel, Liz, Jarvis, Kimi Totum, etc.) podem:
- Acessar arquivos de contexto
- Transformar/formatar contexto para diferentes usos
- Versionar mudanças
- Compartilhar entre IAs

### Tipos de Contexto

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| **Personalidade** | Perfis de agentes | jarvis_personality.json |
| **Memória** | Eventos, decisões | memory_2026-04-01.md |
| **Conhecimento** | Documentos técnicos | bitable_schema.md |
| **Processo** | POPs, SLAs | atendimento_pop.json |
| **Cliente** | Dados específicos | cliente_acme_context.json |

### Transformações Suportadas

```python
# Pseudo-código de transformações
context.transform("markdown" → "json")
context.transform("pdf" → "markdown")
context.transform("structured" → "prompt")
context.transform("multiple" → "consolidated")
context.transform("verbose" → "summary")
```

### Estrutura do Context Hub

```
/context-hub/
├── /personalities/           # Perfis de agentes
│   ├── miguel.json
│   ├── liz.json
│   ├── jarvis.json
│   └── kimi-totum.json
├── /memory/                  # Memórias temporais
│   ├── 2026/
│   │   ├── 04/
│   │   │   └── 01.md
│   │   └── daily/
│   └── long-term/
│       └── memory.json
├── /knowledge/               # Conhecimento técnico
│   ├── /skills/
│   ├── /tools/
│   └── /processes/
├── /clients/                 # Contexto por cliente
│   ├── /acme/
│   └── /totum/
└── /system/                  # Configurações do sistema
    ├── config.json
    └── manifest.json
```

### API de Contexto

```
GET    /api/context/{type}/{id}           # Ler contexto
POST   /api/context/{type}                # Criar contexto
PUT    /api/context/{type}/{id}           # Atualizar
DELETE /api/context/{type}/{id}           # Remover
POST   /api/context/transform             # Transformar formato
POST   /api/context/consolidate           # Unificar múltiplos
GET    /api/context/search?q={termo}      # Buscar
```

---

## 3️⃣ CENTRAL DE SKILLS

### Conceito
Repositório onde todas as IAs podem:
- **Criar** novas skills
- **Editar** skills existentes
- **Compartilhar** skills entre agentes
- **Versionar** evolução das skills

### Tipos de Skills

| Categoria | Exemplo | Uso |
|-----------|---------|-----|
| **Integração** | feishu-bitable, wecom-msg | Conectar APIs |
| **Processamento** | pdf-extract, image-ocr | Transformar dados |
| **Análise** | sentiment-analysis, kpis | Extrair insights |
| **Geração** | report-generator, prompt-builder | Criar conteúdo |
| **Comunicação** | slack-notify, email-send | Enviar mensagens |

### Estrutura de uma Skill

```json
{
  "skill": {
    "name": "feishu-bitable",
    "version": "1.2.0",
    "description": "Operações em multidimensional tables do Feishu",
    "author": "totum-team",
    "category": "integration",
    "tags": ["feishu", "database", "crud"],
    "inputs": {
      "app_token": { "type": "string", "required": true },
      "action": { "type": "enum", "options": ["list", "create", "update"] }
    },
    "outputs": {
      "records": { "type": "array" },
      "success": { "type": "boolean" }
    },
    "code": "base64_encoded_script",
    "tests": [...],
    "documentation": "markdown_content",
    "permissions": ["miguel", "liz", "jarvis"]
  }
}
```

### Funcionalidades da Central

| Feature | Descrição |
|---------|-----------|
| **Editor** | IDE web para criar/editar skills |
| **Testes** | Rodar testes antes de publicar |
| **Versionamento** | Git-like para skills |
| **Permissions** | Controle de quem pode usar/editar |
| **Discovery** | Buscar skills por categoria/tag |
| **Templates** | Base para criar novas skills |

### API de Skills

```
GET    /api/skills                  # Listar skills
GET    /api/skills/{name}           # Detalhes
POST   /api/skills                  # Criar skill
PUT    /api/skills/{name}           # Atualizar
POST   /api/skills/{name}/test      # Testar skill
POST   /api/skills/{name}/execute   # Executar skill
GET    /api/skills/search?tag=crm   # Buscar
```

---

## 🔧 STACK TÉCNICO SUGERIDO

### Backend
| Componente | Tecnologia | Motivo |
|------------|------------|--------|
| API | FastAPI (Python) | Performance, async, OpenAPI |
| Database | PostgreSQL + JSONB | Dados estruturados + flexíveis |
| Cache | Redis | Performance de contexto |
| Search | Elasticsearch | Full-text nos POPs |
| Files | MinIO (S3-compatible) | Arquivos de contexto |
| Auth | JWT + RBAC | Segurança por agente |

### Frontend
| Componente | Tecnologia | Motivo |
|------------|------------|--------|
| Framework | React + TypeScript | Tipagem, componentização |
| UI | Tailwind + HeadlessUI | Design consistente |
| Editor | Monaco Editor | IDE para skills |
| Visualização | Mermaid / D3 | Diagramas de processo |

### Infraestrutura (Stark)
| Componente | Config |
|------------|--------|
| Docker | Containers isolados |
| Nginx | Reverse proxy |
| SSL | Let's Encrypt |
| Backup | Diário automático |

---

## 📋 FLUXOS DE USO

### Cenário 1: Miguel acessa POP de Governança

```
1. Acessa https://stark.totum.com/pops
2. Clica em "Governança"
3. Visualiza 12 gatilhos
4. Marca G3 (Auditoria) como concluído
5. Adiciona comentário sobre ajuste no G5
```

### Cenário 2: Liz cria nova skill de validação

```
1. Acessa https://stark.totum.com/skills/new
2. Seleciona template "Validação"
3. Edita código no Monaco Editor
4. Roda testes automáticos
5. Publica skill "valida-escopo-v2"
6. Skill disponível para todos os agentes
```

### Cenário 3: Kimi Totum busca contexto

```
1. Recebe pergunta sobre SLA de atendimento
2. Chama API: GET /api/context/search?q=SLA+atendimento
3. Recebe trecho relevante da Bíblia
4. Transforma para formato de resposta
5. Responde ao usuário com precisão
```

### Cenário 4: Jarvis atualiza contexto do cliente

```
1. Finaliza campanha para cliente Acme
2. Atualiza: PUT /api/context/clients/acme
3. Adiciona resultados da campanha
4. Sistema notifica Miguel (visão executiva)
```

---

## 🚀 ROADMAP DE IMPLEMENTAÇÃO

### Fase 1: Fundação (Semanas 1-4)
- [ ] Setup VPS Stark
- [ ] Docker + PostgreSQL + Redis
- [ ] API básica (FastAPI)
- [ ] Autenticação JWT

### Fase 2: Portal POPs (Semanas 5-8)
- [ ] Importar Bíblia para DB
- [ ] Interface de visualização
- [ ] Sistema de busca
- [ ] Checklists operacionais

### Fase 3: Context Hub (Semanas 9-12)
- [ ] Estrutura de arquivos
- [ ] API de contexto
- [ ] Transformadores (markdown→json, etc.)
- [ ] Versionamento

### Fase 4: Skills Central (Semanas 13-16)
- [ ] Editor de skills
- [ ] Sistema de testes
- [ ] Versionamento git-like
- [ ] Descoberta de skills

### Fase 5: Integração (Semanas 17-20)
- [ ] Conectar Kimi Totum
- [ ] Integrar com n8n
- [ ] Webhooks para eventos
- [ ] Documentação completa

---

## 💾 MODELO DE DADOS

### Tabela: pops
```sql
CREATE TABLE pops (
    id UUID PRIMARY KEY,
    departamento VARCHAR(50),
    status VARCHAR(20),
    conteudo JSONB,
    versao VARCHAR(10),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Tabela: contextos
```sql
CREATE TABLE contextos (
    id UUID PRIMARY KEY,
    tipo VARCHAR(50),
    agente VARCHAR(50),
    conteudo JSONB,
    parent_id UUID REFERENCES contextos(id),
    versao INTEGER,
    created_at TIMESTAMP
);
```

### Tabela: skills
```sql
CREATE TABLE skills (
    id UUID PRIMARY KEY,
    nome VARCHAR(100),
    versao VARCHAR(20),
    categoria VARCHAR(50),
    codigo TEXT,
    testes JSONB,
    autor VARCHAR(100),
    permissions JSONB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Tabela: execucoes_skills
```sql
CREATE TABLE execucoes_skills (
    id UUID PRIMARY KEY,
    skill_id UUID REFERENCES skills(id),
    agente VARCHAR(50),
    inputs JSONB,
    outputs JSONB,
    status VARCHAR(20),
    duracao_ms INTEGER,
    created_at TIMESTAMP
);
```

---

## 🔐 SEGURANÇA E PERMISSÕES

### Níveis de Acesso

| Agente | POPs | Contexto | Skills |
|--------|------|----------|--------|
| Miguel | Leitura + Comentário | Todo | Criar/Editar/Todas |
| Liz | Leitura + Checklist | Todo | Usar/Todas |
| Jarvis | Leitura | Todo | Usar/Todas |
| Kimi Totum | Leitura (API) | Todo (API) | Usar (API) |
| Agentes Especialistas | Leitura (seu depto) | Limitado | Usar (permitidas) |

### Auditoria
- Todas as ações logadas
- Quem acessou qual POP
- Quem executou qual skill
- Mudanças em contexto versionado

---

## 🎯 BENEFÍCIOS ESPERADOS

| Benefício | Métrica |
|-----------|---------|
| **Acesso rápido a POPs** | < 2s para encontrar qualquer gatilho |
| **Consistência** | 100% dos agentes usando mesma versão |
| **Colaboração** | Skills reutilizáveis entre IAs |
| **Rastreabilidade** | Histórico completo de mudanças |
| **Escala** | Novos agentes onboard em 1 dia |
| **Qualidade** | Erros operacionais -50% |

---

## 📎 PRÓXIMOS PASSOS

1. **Aprovar especificação** técnica
2. **Provisionar** Stark com recursos necessários
3. **Contratar/Alocar** dev para implementação
4. **Criar** protótipos das interfaces
5. **Importar** Bíblia como dados iniciais

---

*Especificação técnica para a plataforma Totum Central*  
*Abril 2026*
