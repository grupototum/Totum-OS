# 📚 ALEXANDRIA - Biblioteca Central de Conhecimento Totum

> "O conhecimento é inútil se não puder ser encontrado." - GILES 🧙‍♂️

---

## 🏛️ O que é

A **Alexandria** é a biblioteca central da Totum — inspirada na mítica Biblioteca de Alexandria, mas digital, semântica e impossível de queimar.

Aqui vive **TODO** o conhecimento da Totum:
- Decisões de negócio
- Aprendizados de projetos
- Contexto entre sessões
- Documentação de agentes
- POPs, SLAs, Skills

---

## 📂 Estrutura Completa

```
alexandria/
│
├── 📁 contextos/                 ← Contexto de conversas
│   ├── ativas/                   ← Sessões em andamento
│   ├── persistidas/              ← Contexto confirmado (VPS)
│   └── recusados/                ← Contexto descartado
│
├── 📁 agentes/                   ← Documentação dos agentes
│   ├── tot.md
│   ├── data.md
│   ├── giles.md
│   └── ... (todos os agentes)
│
├── 📁 pops/                      ← Protocolos Operacionais
│   ├── POP-001-CRIACAO-AGENTES.md
│   └── ...
│
├── 📁 slas/                      ← SLAs e Métricas
│   └── ...
│
├── 📁 skills/                    ← Skills documentadas
│   ├── skill-codigos-001.md
│   └── ...
│
├── 📁 temas/                     ← Conhecimento por tema
│   ├── Design-System/
│   ├── Apps-Totum/
│   ├── Infraestrutura/
│   └── Agentes/
│
├── 📁 indice/                    ← Índices de busca (GILES)
│   └── indice-semantico.json
│
├── 📁 sync/                      ← Jobs de sincronização
│   └── sync_[id].json
│
└── README.md                     ← Este arquivo
```

---

## 🔗 Destinos de Persistência

| Destino | Tipo | Status | Uso |
|---------|------|--------|-----|
| **VPS Local** | Arquivos | ✅ Ativo | Operação imediata |
| **Supabase** | Banco + Vector | 🔄 Configurando | Busca semântica |
| **GitHub** | Git | 🔄 Pendente | Versionamento skills |
| **Google Drive** | Nuvem | 🔄 Pendente | Acesso humano |
| **Servidor Dedicado** | Backup | 🔄 Pendente | Disaster recovery |

---

## 🧙‍♂️ Agente GILES - O Bibliotecário

**GILES** é o guardião da Alexandria.

### Responsabilidades:
- 📚 Catalogar todo conhecimento entrante
- 🔗 Conectar informações aparentemente desconectadas
- 🔍 Facilitar busca e recuperação (< 3 segundos)
- 📊 Manter índices atualizados
- 🏛️ Garantir que nada se perca

### Fluxo de Trabalho:
```
1. Recebe novo contexto (confirmado)
2. Extrai metadados e tags
3. Indexa para busca semântica
4. Conecta com conhecimento relacionado
5. Atualiza índices globais
```

---

## 🔄 Fluxo de Persistência

```
┌─────────────────────────────────────────────────────────┐
│  1. CONVERSA                                           │
│  ├── IA detecta decisão/contexto importante            │
│  └── PERGUNTA: "Salvar no Alexandria? [S/N]"           │
├─────────────────────────────────────────────────────────┤
│  2. SALVAMENTO TEMPORÁRIO (VPS)                        │
│  ├── Cria arquivo em contextos/ativas/                 │
│  └── Status: ⏳ Pendente                                │
├─────────────────────────────────────────────────────────┤
│  3. CONFIRMAÇÃO                                        │
│  ├── Se SIM: Move para contextos/persistidas/          │
│  └── Se NÃO: Move para contextos/recusados/            │
├─────────────────────────────────────────────────────────┤
│  4. SINCRONIZAÇÃO (Automática)                         │
│  ├── Supabase: Inserção imediata                      │
│  ├── GitHub: Commit no próximo batch                  │
│  ├── Drive: Sync a cada 10 minutos                    │
│  └── Servidor: Backup diário                          │
├─────────────────────────────────────────────────────────┤
│  5. INDEXAÇÃO (GILES)                                  │
│  ├── Processa embeddings                              │
│  ├── Conecta conceitos relacionados                   │
│  └── Atualiza índice semântico                        │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 Convenções de Nomenclatura

### Contextos:
- `ctx_[YYYYMMDD]_[HHMMSS]_[hash].md`
- Ex: `ctx_20260405_035500_a1b2c3d4.md`

### Agentes:
- `[nome].md` em `agentes/`
- Ex: `giles.md`, `data.md`

### POPs:
- `POP-[NUM]-[NOME].md`
- Ex: `POP-001-CRIACAO-AGENTES.md`

### Skills:
- `skill-[nome]-[versao].md`
- Ex: `skill-codigos-001.md`

---

## 🚀 Uso Rápido

### Salvar contexto (via código):
```python
from .mex.persistencia import manager

# Criar contexto
result = manager.salvar(
    tipo="decisao",
    conteudo="Vamos usar Supabase para persistência",
    categoria="sistema",
    origem="TOT"
)

# Confirmar
manager.confirmar(result['id'])
```

### Ver pendentes:
```bash
python /root/.openclaw/workspace/.mex/persistencia.py listar
```

---

## 📊 Métricas

| Métrica | Valor Atual | Meta |
|---------|-------------|------|
| Contextos pendentes | 0 | < 5 |
| Contextos confirmados | 0 | > 100/dia |
| Tempo de busca | N/A | < 3s |
| Taxa de sync | 0% | > 99% |

---

## 📝 Regras de Ouro

1. **Toda decisão importante DEVE ser salva**
2. **Nada vive só na memória da sessão**
3. **GILES indexa tudo em < 24h**
4. **5 destinos, 0 perda de dados**
5. **Busca deve retornar em < 3s**

---

*Mantido por: GILES 🧙‍♂️*  
*Criado em: 2026-04-05*  
*Status: 🟢 Ativo*
