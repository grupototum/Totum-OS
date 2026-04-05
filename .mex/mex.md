# 📚 MEX - Memory EXtraction Scaffold
## Bootstrap da Alexandria

> Resumo enxuto para início de sessão (~120 tokens)

---

## 🎯 O que é este projeto

**Totum Workspace**: Sistema de agentes de IA para orquestração de operações de marketing e automação.

**Alexandria**: Biblioteca central de conhecimento com persistência em 5 destinos.

---

## 🏗️ Arquitetura

- **Workspace**: `/root/.openclaw/workspace/`
- **Alexandria**: `alexandria/` (contexto, agentes, POPs, SLAs)
- **Apps**: `apps-totum/` (aplicações React)
- **Agentes**: `agents/` (documentação de 17+ agentes)
- **Persistência**: `.mex/` (sistema de contexto)

---

## 🔗 Destinos de Persistência

| # | Destino | Status | Uso |
|---|---------|--------|-----|
| 1 | VPS Local | ✅ Ativo | Operação imediata |
| 2 | Supabase | 🔄 Configurando | Busca semântica |
| 3 | GitHub | 🔄 Pendente | Versionamento |
| 4 | Google Drive | 🔄 Pendente | Acesso humano |
| 5 | Servidor | 🔄 Pendente | Backup |

---

## 🧠 Agente Principal: TOT

- **Função**: Orquestrador geral
- **Emoji**: 🎛️
- **Deve**: Perguntar antes de salvar contexto
- **Não deve**: Deixar decisões na memória só da sessão

---

## 🧙‍♂️ GILES (Bibliotecário)

Responsável por indexar e catalogar tudo na Alexandria.

---

## 📝 Convenção de Salvamento

**SEMPRE PERGUNTAR**: "Salvar no Alexandria? [S/N]"

**O que salvar**: Decisões, agentes novos, regras, aprendizados

**O que não salvar**: Brainstorming, testes falhos, conversas casuais

---

## 📂 Estrutura de Contexto

```
alexandria/contextos/
├── ativas/        ← ⏳ Pendente confirmação
├── persistidas/   ← ✅ Confirmado
└── recusados/     ← ❌ Descartado
```

---

## 🚀 Quick Start

1. Detectar decisão importante
2. Perguntar: "Salvar no Alexandria?"
3. Se SIM: salvar em `contextos/ativas/`
4. Confirmar: mover para `contextos/persistidas/`
5. Sync automático para outros destinos

---

## 📊 Estado Atual

- Contextos pendentes: ver `python .mex/persistencia.py listar`
- Último sync: ver `logs/persistencia.log`
- Agente GILES: responsável por indexação

---

*Bootstrap atualizado: 2026-04-05*  
*Versão: 2.0*
