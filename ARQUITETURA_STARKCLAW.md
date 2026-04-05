# 🏛️ ARQUITETURA TOTUM - ECOSISTEMA COMPLETO

> **Documento de Referência para StarkClaw**  
> Data: 2026-04-05 | Versão: 1.0 | Classificação: Interna

---

## 🎯 VISÃO GERAL

O ecossistema Totum é uma **federacão de sistemas inteligentes** conectados através da **Alexandria** (biblioteca central de conhecimento).

Cada componente tem sua função específica, mas todos convergem no **Apps** — o ponto de encontro único.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         🎛️ NOVA-COR                                     │
│                    Camada de Orquestração                              │
│                                                                         │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                │
│   │   TOT 🤖    │    │ StarkClaw ⚡ │    │  GILES 📚   │                │
│   │  (Alibaba)  │    │   (Stark)   │    │ (Supabase)  │                │
│   │             │    │             │    │             │                │
│   │ Interface   │    │ Monitor     │    │ Biblioteca  │                │
│   │ Humana      │    │ Automação   │    │ Central     │                │
│   └──────┬──────┘    └──────┬──────┘    └──────┬──────┘                │
│          │                  │                  │                        │
│          └──────────────────┼──────────────────┘                        │
│                             │                                          │
│                             ▼                                          │
│   ┌──────────────────────────────────────────────────────────────┐     │
│   │                      📱 APPS                                  │     │
│   │            PONTO DE ENCONTRO UNIVERSAL                        │     │
│   │                                                               │     │
│   │   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │     │
│   │   │   Wiki 📚    │  │  Chat 💬    │  │  Agentes 🤖  │       │     │
│   │   │  Alexandria  │  │   GILES     │  │ Dashboard    │       │     │
│   │   └──────────────┘  └──────────────┘  └──────────────┘       │     │
│   │                                                               │     │
│   └──────────────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## 🤖 COMPONENTES DO SISTEMA

### 1. TOT (Toth) - O Orquestrador
**Localização:** Alibaba Cloud (VPS principal)  
**Acesso:** Apenas Israel (dono) tem acesso direto

**Função:**
- Interface humano-máquina primária
- Tomador de decisões estratégicas
- Coordenador de outros agentes
- Ponto de entrada para comandos complexos

**Stack:**
- OpenClaw + Kimi K2.5
- Node.js + TypeScript
- Acesso a todos os sistemas

**Personalidade:**
- 75% Profissional / 25% Humor (estilo TARS)
- Direto, eficiente, leal
- Odeia desperdício e soluções temporárias

---

### 2. StarkClaw ⚡ - O Guardião do VPS
**Localização:** VPS Stark (Alibaba Cloud - servidor dedicado)
**Acesso:** Apenas Israel (dono) tem acesso direto

**Função:**
- **Monitoramento 24/7** de todos os sistemas
- **Deploy automático** quando código é pushado
- **Backup e manutenção** preventiva
- **Primeira linha de defesa** em caso de falhas
- Interface entre infraestrutura e operação

**Responsabilidades Específicas:**
```yaml
Monitoramento:
  - Pingar Apps a cada 5 minutos
  - Verificar saúde do Supabase
  - Monitorar logs de erro
  - Alertar no WhatsApp/Telegram se algo cair

Automação:
  - Deploy automático do GitHub → Lovable/VPS
  - Backup diário da Alexandria
  - Rotação de logs
  - Atualização de certificados SSL

Manutenção:
  - Limpar arquivos temporários
  - Otimizar banco de dados
  - Verificar espaço em disco
  - Restart serviços quando necessário
```

**Stack Recomendado:**
```bash
# Core
- OpenClaw (agente autônomo)
- Node.js (scripts de automação)
- PM2 (gerenciamento de processos)

# Monitoramento
- Uptime Kuma ou similar
- Scripts de health check
- Integração WhatsApp/Telegram

# Deploy
- Webhooks GitHub
- Scripts de CI/CD local
- Docker (se necessário)
```

**Comunicação:**
- Recebe comandos de: **TOT** (quando Israel pede)
- Reporta para: **TOT** e **Apps** (dashboard)
- Acessa: **Alexandria** (para logs e documentação)

---

### 3. GILES 📚 - O Bibliotecário
**Localização:** Supabase (PostgreSQL + pgvector)
**Acesso:** Todos os agentes (via API)

**Função:**
- **Hub central de conhecimento**
- Indexa todo conhecimento da Totum
- Busca semântica em < 3 segundos
- Mantém relações entre conceitos (ontologia)

**Cérebro:** Google Gemini
- Modelo padrão: Gemini 2.0 Flash
- Custo controlado: 1M tokens/mês grátis, depois pay-as-you-go
- Limite configurável no Google Cloud

**Estrutura:**
```
Alexandria/
├── giles_knowledge (chunks de conhecimento)
├── giles_dominios (taxonomia)
├── giles_consultas (logs)
└── giles_sinonimos (aliases)
```

**Integrações:**
- **TOT** → Persiste decisões importantes
- **StarkClaw** → Lê POPs e procedimentos
- **Apps** → Fornece contexto para Wiki e Chat
- **Futuros agentes** → Todos consultam antes de agir

---

### 4. Apps 📱 - O Ponto de Encontro
**Localização:** Lovable (frontend) + Supabase (backend)
**URL:** totum-app-harmony.lovable.app
**Acesso:** Israel + equipe (quando liberado)

**Função:**
- **Interface visual única** para todo o ecossistema
- **Wiki Alexandria** - Busca e navegação de conhecimento
- **Chat GILES** - Conversa com o bibliotecário
- **Dashboard de Agentes** - Status e controle
- **Hub de Integração** - Onde tudo converge

**Módulos:**
| Rota | Função | Integração |
|------|--------|------------|
| `/wiki` | Wiki Alexandria | GILES (busca semântica) |
| `/giles` | Chat com GILES | Gemini + Alexandria |
| `/agents` | Dashboard de Agentes | Status de TOT, StarkClaw, etc |
| `/hub` | Centro de Operações | Ações rápidas |

**Stack:**
- React + Vite + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (auth + database)
- TanStack Query

---

## 🔗 FLUXO DE COMUNICAÇÃO

### Cenário 1: Israel pede informação
```
Israel → TOT (pergunta)
            ↓
    TOT consulta GILES
            ↓
    GILES busca na Alexandria
            ↓
    TOT responde Israel
            ↓
    (opcional) StarkClaw loga o evento
```

### Cenário 2: Sistema cai
```
StarkClaw (monitor) detecta falha
            ↓
    StarkClaw tenta auto-recuperação
            ↓
    Se falhar → Alerta Israel (WhatsApp)
            ↓
    Loga incidente na Alexandria
            ↓
    TOT fica sabendo via Alexandria
```

### Cenário 3: Nova decisão importante
```
Israel decide algo com TOT
            ↓
    TOT pergunta: "Salvar na Alexandria?"
            ↓
    Se sim → GILES indexa conhecimento
            ↓
    Fica disponível para:
    - StarkClaw (POPs)
    - Apps (Wiki)
    - Futuros agentes
```

---

## 🎭 HIERARQUIA DE AGENTES

```
┌─────────────────────────────────────────┐
│  CAMADA 0: ORQUESTRAÇÃO                 │
│  👤 Israel (Humano) - Único dono        │
│                                         │
│  Acesso exclusivo a:                    │
│  • TOT (OpenClaw na Alibaba)            │
│  • StarkClaw (OpenClaw no VPS Stark)    │
│  • Apps (via interface web)             │
└─────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  CAMADA 1: INTERFACE                    │
│                                         │
│  🤖 TOT (Toth)                          │
│  - OpenClaw + Kimi K2.5                 │
│  - Alibaba Cloud                        │
│  - Interface conversacional             │
└─────────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
┌───────────────┐     ┌───────────────┐
│ StarkClaw ⚡  │     │   GILES 📚    │
│               │     │               │
│ - Monitor     │     │ - Conhecimento│
│ - Automação   │     │ - Busca       │
│ - Infra       │     │ - Memória     │
│               │     │               │
│ VPS Stark     │     │ Supabase      │
│ OpenClaw      │     │ Gemini        │
└───────┬───────┘     └───────┬───────┘
        │                     │
        └──────────┬──────────┘
                   ▼
┌─────────────────────────────────────────┐
│  CAMADA 2: HUB VISUAL                   │
│                                         │
│  📱 APPS                                │
│  - Wiki Alexandria                      │
│  - Chat GILES                           │
│  - Dashboard                            │
│                                         │
│  Lovable + Supabase                     │
└─────────────────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│  CAMADA 3: EQUIPE (futuro)              │
│                                         │
│  👥 Liz, Jarvis, equipe                 │
│  - Acesso apenas ao Apps                │
│  - Não acessam OpenClaw diretamente     │
│  - Interagem via interface web          │
└─────────────────────────────────────────┘
```

---

## 🧩 O PAPEL DO STARKCLAW

### O que é
StarkClaw é o **OpenClaw instalado no VPS Stark** — seu assistente pessoal no servidor.

### O que ele faz (funcionalidades)
1. **Monitoramento Proativo**
   - Verifica se Apps está online a cada 5 min
   - Pinga Supabase (GILES)
   - Monitora espaço em disco do VPS
   - Verifica logs de erro

2. **Automação de Deploy**
   - Quando Israel faz push no GitHub
   - StarkClaw detecta e faz deploy no Lovable
   - Ou no VPS local (se configurado)

3. **Backup e Segurança**
   - Backup diário da Alexandria
   - Export de dados importantes
   - Verificação de certificados SSL

4. **Comunicação**
   - Alerta Israel no WhatsApp se algo cair
   - Envia relatórios diários
   - Confirma ações automáticas

### Como se relaciona com os outros
| Com quem | Como |
|----------|------|
| **TOT** | Recebe comandos de orquestração; reporta status |
| **GILES** | Lê POPs e procedimentos; loga eventos |
| **Apps** | Monitora saúde; mostra status no dashboard |
| **Israel** | Alerta direto no WhatsApp; executa comandos |

### Acesso ao StarkClaw
**Apenas Israel** tem acesso ao terminal do VPS Stark, onde o StarkClaw roda.

**Comandos úteis:**
```bash
# Ver status do StarkClaw
openclaw status

# Ver logs
openclaw logs

# Executar tarefa manual
openclaw run --task backup_alexandria

# Configurar monitoramento
openclaw config monitoring --enable
```

---

## 🚀 PRÓXIMOS PASSOS PARA STARKCLAW

### 1. Mapear Capacidades Atuais
- [ ] O que o StarkClaw já faz hoje?
- [ ] Quais scripts estão rodando?
- [ ] Qual o status do monitoramento?

### 2. Integrar com Alexandria
- [ ] Configurar acesso ao Supabase
- [ ] Criar tabela de logs do Stark
- [ ] Indexar procedimentos de infra

### 3. Comunicação com TOT
- [ ] Canal de mensagens entre agentes
- [ ] Protocolo de alertas
- [ ] Sincronização de estado

### 4. Dashboard no Apps
- [ ] Widget de status do VPS
- [ ] Logs de monitoramento
- [ ] Botões de ação (restart, backup, etc)

---

## 📞 PROTOCOLO DE COMUNICAÇÃO

### Quando TOT chama StarkClaw:
```
TOT: "StarkClaw, status do Apps?"
StarkClaw: "🟢 Apps online | ⏱️ 45 dias uptime | 📊 200MB logs"

TOT: "StarkClaw, fazer backup da Alexandria"
StarkClaw: "🔄 Iniciando backup... ✅ Backup concluído | 📦 15MB | ⏱️ 2min"
```

### Quando StarkClaw alerta:
```
StarkClaw → WhatsApp Israel:
"⚠️ ALERTA: Apps offline há 5 minutos
🔄 Tentando auto-recuperação...
📊 Último ping: 14:32:15"
```

---

## 📝 NOTAS IMPORTANTES

1. **Acesso Exclusivo:** Apenas Israel acessa TOT e StarkClaw diretamente
2. **Apps é o Hub:** Toda a equipe futura usa Apps como ponto único
3. **Alexandria é a Memória:** Todos os agentes leem/escrevem lá
4. **StarkClaw é o Guardião:** Silencioso, eficiente, 24/7
5. **TOT é o Orquestrador:** Quando Israel precisa, TOT coordena todos

---

*Documento criado por: TOT*  
*Para: StarkClaw e Israel*  
*Sistema: Totum Ecosystem v1.0*
