# 🎯 PROMPT: Dashboard Unificado Totum
## Para Lovable (ou Antigravity/Cursor)

---

## 📝 Instruções Gerais

Crie um **Dashboard Unificado** para o ecossistema **Apps Totum**. Este painel será o "Mission Control" centralizado onde o usuário pode visualizar e gerenciar todas as partes do sistema.

---

## 🎨 Design System

### Cores (Upixel/Totum)
- **Primária:** `#f76926` (laranja Totum)
- **Secundária:** `#1a1a1a` (fundo escuro)
- **Sucesso:** `#22c55e` (verde)
- **Aviso:** `#eab308` (amarelo)
- **Erro:** `#ef4444` (vermelho)
- **Info:** `#3b82f6` (azul)
- **Texto:** `#ffffff` (branco) / `#a3a3a3` (cinza claro)

### Tipografia
- **Títulos:** Inter ou Bricolage Grotesque
- **Corpo:** Inter
- **Monospace:** JetBrains Mono (para dados técnicos)

### Estilo Visual
- Dark mode (fundo #050505 ou #0a0a0a)
- Cards com bordas sutis (border: 1px solid rgba(255,255,255,0.1))
- Glassmorphism leve (backdrop-blur)
- Gradientes sutis de laranja para destaques
- Animações suaves (fadeIn, slideUp)

---

## 📐 Estrutura do Dashboard

### 1. HEADER / TOP BAR

```
[Logo Totum]  Apps Totum — Dashboard Unificado          [Status: Online 🟢]  [Usuário: Admin ▼]
```

**Elementos:**
- Logo Totum (laranja #f76926)
- Título: "Apps Totum — Dashboard Unificado"
- Status do sistema (Online/Offline)
- Menu do usuário (dropdown)

---

### 2. OVERVIEW CARDS (4 cards principais)

Linha superior com 4 cards de métricas:

| Card | Cor | Valor | Subtexto |
|------|-----|-------|----------|
| **VPS 7GB** | 🔵 Azul | Online | OpenClaw + Bot + Coordenação |
| **VPS KVM4** | 🟢 Verde | Online | 16GB RAM + IA Local + Hospedagem |
| **GitHub Sync** | 🟣 Roxo | Conectado | Apps_totum_Oficial |
| **IAs Ativas** | 🟠 Laranja | 3/3 | Miguel, Liz, Jarvis |

**Design:**
- Cards com ícones à esquerda
- Borda colorida sutil (left-border: 2px)
- Hover: leve elevação (shadow)

---

### 3. GRID PRINCIPAL (2 colunas)

#### COLUNA ESQUERDA (60%)

##### A. STATUS DOS APPS (Lista)

Liste todos os apps do ecossistema:

```
📱 Atendente (Telegram)     🟢 Online    @totum_agents_bot
📊 Gestor de Tráfego        🟡 Standby   Aguardando deploy
🎯 Radar Estratégico        🟡 Standby   Aguardando deploy
🤖 Orquestrador (Kimi)      🟢 Online    Coordenando
📓 Notebook LM              🟡 Standby   Aguardando config
```

**Elementos por app:**
- Ícone (emoji ou Lucide)
- Nome do app
- Status (Online/Standby/Offline com cor)
- Descrição curta
- Botão "Acessar" ou "Configurar"

##### B. LOG DE ATIVIDADES (Timeline)

```
[🕐 14:32] Bot Atendente respondeu mensagem
[🕐 14:15] Sync GitHub: 3 commits enviados
[🕐 13:50] IA Local (Groq): 12 requisições
[🕐 12:20] Manutenção automática concluída
```

Scroll infinito com as últimas 20 atividades.

---

#### COLUNA DIREITA (40%)

##### C. USO DE RECURSOS (Gráficos)

**VPS 7GB ( atual):**
```
RAM:  ████████░░ 80% (5.6GB/7GB)
CPU:  ████░░░░░░ 40%
Disco: █████░░░░░ 50%
```

**VPS KVM4 (16GB):**
```
RAM:  ████░░░░░░ 25% (4GB/16GB)
CPU:  ██░░░░░░░░ 20%
Disco: ███░░░░░░░ 30%
```

**Formato:** Progress bars coloridas

##### D. CUSTOS ESTIMADOS (Mês)

```
IAs Cloud:     R$ 660  ████████░░
Ferramentas:   R$ 494  ██████░░░░
Hospedagem:    R$ 60   █░░░░░░░░░
───────────────────────────────
Total:        ~R$ 1.214/mês
```

Link: "Ver detalhes →"

##### E. CONTEXTO / MEX SYNC

```
🧠 MEX Status
├── Global:    ✅ Sincronizado
├── Atendente: ✅ Sincronizado
└── Context Hub: 🔄 Sincronizando...

Último sync: 2 minutos atrás
```

Botão: "Forçar Sync"

---

### 4. SEÇÃO INFERIOR: AGENTES (Trindade)

Cards horizontais para cada agente:

```
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│   🤖 MIGUEL     │  │   👩‍💻 LIZ       │  │   🦾 JARVIS     │
│   Arquiteto     │  │   Guardiã       │  │   Executor      │
│                 │  │                 │  │                 │
│  Status: 🟢     │  │  Status: 🟢     │  │  Status: 🟡     │
│  Tarefas: 3     │  │  Tarefas: 5     │  │  Tarefas: 0     │
│                 │  │                 │  │                 │
│ [Ver detalhes]  │  │ [Ver detalhes]  │  │ [Ver detalhes]  │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

---

### 5. FOOTER

```
Apps Totum v1.0.0  |  Último deploy: 31/03/2026 14:32  |  [Documentação] [Suporte]
```

---

## 🔧 FUNCIONALIDADES (MVP)

### Must Have (Versão 1):
1. ✅ Visualização de status dos 2 VPS
2. ✅ Lista de apps com status
3. ✅ Uso de recursos (RAM/CPU/Disco)
4. ✅ Log de atividades (últimas 20)
5. ✅ Cards da Trindade (Miguel, Liz, Jarvis)

### Nice to Have (Versão 2):
1. 🔄 Ações: Restart VPS, Sync GitHub
2. 📊 Gráficos de uso ao longo do tempo
3. 🔔 Notificações em tempo real
4. 🔗 Links rápidos para cada app
5. 📈 Previsão de custos

---

## 🔌 INTEGRAÇÕES (Dados Fake por Enquanto)

Use dados mockados inicialmente:

```typescript
const mockData = {
  vps: [
    { name: "VPS 7GB", status: "online", ram: 80, cpu: 40, disk: 50 },
    { name: "VPS KVM4", status: "online", ram: 25, cpu: 20, disk: 30 }
  ],
  apps: [
    { name: "Atendente", status: "online", icon: "💬", description: "Bot Telegram" },
    { name: "Gestor Tráfego", status: "standby", icon: "📊", description: "Aguardando deploy" }
  ],
  agents: [
    { name: "Miguel", role: "Arquiteto", status: "online", tasks: 3 },
    { name: "Liz", role: "Guardiã", status: "online", tasks: 5 },
    { name: "Jarvis", role: "Executor", status: "standby", tasks: 0 }
  ],
  costs: {
    ia: 660,
    tools: 494,
    hosting: 60,
    total: 1214
  }
};
```

---

## 📱 RESPONSIVIDADE

- **Desktop:** Layout 2 colunas (60/40)
- **Tablet:** Layout 1 coluna, cards em grid 2x2
- **Mobile:** Lista vertical, cards empilhados

---

## 🎯 ENTREGÁVEIS

1. **Dashboard React** componentizado
2. **Mock data** funcional
3. **Estilos** com Tailwind (dark mode)
4. **Animações** suaves
5. **Responsivo**

---

## 💡 REFERÊNCIAS VISUAIS

Inspire-se em:
- **Vercel Dashboard** (limpo, dark mode)
- **GitHub Actions** (status visual)
- **Datadog** (métricas)
- **Linear** (simplicidade)

---

## ✅ CRITÉRIOS DE ACEITE

- [ ] Dark mode consistente
- [ ] Cores da marca Totum (#f76926)
- [ ] Status visual claro (online/offline/standby)
- [ ] Animações suaves
- [ ] Responsivo
- [ ] Código limpo e componentizado

---

*Prompt para Lovable/Antigravity — Dashboard Totum*
