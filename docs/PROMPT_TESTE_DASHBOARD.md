# 🧪 PROMPT DE TESTE E CORREÇÃO - Dashboard Totum

## 📋 INSTRUÇÕES PARA TESTE

Teste cada funcionalidade e marque o status. O que não estiver 100% funcional, adicione o badge **"EM BREVE"**.

---

## ✅ CHECKLIST DE FUNCIONALIDADES

### HEADER
- [ ] Logo Totum visível
- [ ] Título "Apps Totum — Dashboard Unificado"
- [ ] Status "Online" com indicador verde pulsante
- [ ] Email do usuário logado
- [ ] Botão "Hub" navega para /hub
- [ ] Botão "Sair" faz logout

**Se algum não funcionar:**
```tsx
<span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-1 rounded">
  EM BREVE
</span>
```

---

### OVERVIEW CARDS (4 cards)

| Card | O que testar | Status |
|------|--------------|--------|
| **VPS 7GB** | Mostra "Online" + descrição | ⬜ |
| **VPS KVM4** | Mostra "Online" + descrição | ⬜ |
| **GitHub Sync** | Mostra "Conectado" + nome do repo | ⬜ |
| **IAs Ativas** | Mostra "3/3" + nomes | ⬜ |

**Problemas encontrados:**
- ⬜ Nenhum
- ⬜ Dados não aparecem
- ⬜ Status incorreto

**Badge a adicionar:**
Se os dados forem mockados (não reais), adicione no canto superior direito do card:
```tsx
<span className="absolute top-2 right-2 text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">
  DEMO
</span>
```

---

### GRID PRINCIPAL

#### COLUNA ESQUERDA (3/5)

**AppStatusList**
- [ ] Lista todos os 5 apps
- [ ] Ícones visíveis (💬, 📊, 🎯, 🤖, 📓)
- [ ] Status badges coloridos (Online=verde, Standby=âmbar)
- [ ] Descrições visíveis

**ActivityLog**
- [ ] Mostra últimas 10 atividades
- [ ] Horários no formato "14:32"
- [ ] Cores por tipo (success=verde, info=azul, warning=âmbar)
- [ ] Scroll funciona

**Badge para apps em standby:**
```tsx
<span className="ml-2 text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded">
  EM BREVE
</span>
```

#### COLUNA DIREITA (2/5)

**ResourceUsage**
- [ ] Mostra VPS 7GB e VPS KVM4
- [ ] Barras de RAM/CPU/Disco visíveis
- [ ] Percentuais corretos (80%, 40%, 50%)
- [ ] Barras animam ao carregar
- [ ] Cores dinâmicas (verde <50%, âmbar 50-75%, vermelho >75%)

**CostEstimate**
- [ ] Mostra 3 categorias (IAs, Ferramentas, Hospedagem)
- [ ] Valores em R$ (660, 494, 60)
- [ ] Barras de progresso proporcionais
- [ ] Total calculado (~R$ 1.214)
- [ ] Botão "Ver detalhes" visível

**Badge EM BREVE:**
```tsx
// No botão "Ver detalhes"
<button className="..." disabled>
  Ver detalhes <span className="text-[10px] ml-1">(EM BREVE)</span>
</button>
```

**MexSync**
- [ ] Mostra 3 status (Global, Atendente, Context Hub)
- [ ] Ícones de status (check, loading, error)
- [ ] Último sync visível
- [ ] Botão "Forçar Sync"

---

### GRÁFICOS

**VpsResourceChart**
- [ ] Gráfico de área visível
- [ ] Toggle VPS 7GB / VPS KVM4 funciona
- [ ] 3 séries (RAM, CPU, Disco)
- [ ] Tooltip ao passar o mouse
- [ ] Legenda visível

**ActivityVolumeChart**
- [ ] Gráfico de linhas visível
- [ ] 3 séries (Requisições, Mensagens, Deploys)
- [ ] Últimos 7 dias no eixo X

**CostHistoryChart**
- [ ] Gráfico de barras visível
- [ ] 3 categorias (IAs, Ferramentas, Hospedagem)
- [ ] 6 meses no eixo X

**Badge para todos os gráficos:**
Se os dados forem mockados:
```tsx
<div className="relative">
  {/* gráfico */}
  <span className="absolute top-2 right-2 text-[10px] bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
    DADOS DE DEMONSTRAÇÃO
  </span>
</div>
```

---

### TRINDADE (AgentCards)

- [ ] 3 cards visíveis (Miguel, Liz, Jarvis)
- [ ] Emojis corretos (🤖, 👩‍💻, 🦾)
- [ ] Nomes e funções
- [ ] Status online/offline
- [ ] Contador de tarefas
- [ ] Botão "Ver detalhes →" aparece no hover

**Badge:**
```tsx
<button className="... opacity-50 cursor-not-allowed" disabled>
  Ver detalhes → <span className="text-[10px]">(EM BREVE)</span>
</button>
```

---

### FOOTER
- [ ] Versão "Apps Totum v1.0.0"
- [ ] Data de deploy atualizada
- [ ] Alinhado ao centro

---

## 🔧 CORREÇÕES NECESSÁRIAS

### Sistema de Badge "EM BREVE"

Para cada funcionalidade não implementada, use este padrão:

```tsx
// Variante 1: Badge inline
<span className="text-[10px] bg-orange-500/20 text-orange-400 px-2 py-1 rounded ml-2">
  EM BREVE
</span>

// Variante 2: Tooltip no hover
<div className="group relative">
  <button disabled>Ver detalhes</button>
  <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-popover px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
    EM BREVE
  </span>
</div>

// Variante 3: Badge absoluto no card
<span className="absolute top-2 right-2 text-[10px] bg-orange-500/20 text-orange-400 px-2 py-1 rounded border border-orange-500/30">
  EM BREVE
</span>
```

---

## 🎨 PADRÃO VISUAL PARA "EM BREVE"

**Cores:**
- Background: `bg-orange-500/20` ou `bg-amber-500/20`
- Texto: `text-orange-400` ou `text-amber-400`
- Borda (opcional): `border-orange-500/30`

**Tamanho:**
- Fonte: `text-[10px]` ou `text-[11px]`
- Padding: `px-2 py-1` ou `px-1.5 py-0.5`

**Posição:**
- Preferencialmente no canto superior direito do elemento
- Ou inline após o texto/botão

---

## 📱 TESTES DE RESPONSIVIDADE

Teste em diferentes larguras:

| Largura | Layout Esperado | Status |
|---------|-----------------|--------|
| 1920px (Desktop) | 2 colunas + 4 cards lado a lado | ⬜ |
| 1024px (Laptop) | 2 colunas + 4 cards lado a lado | ⬜ |
| 768px (Tablet) | 1 coluna + 2x2 cards | ⬜ |
| 375px (Mobile) | 1 coluna empilhado | ⬜ |

---

## 🐛 REPORT DE BUGS

Para cada bug encontrado, preencha:

```markdown
### Bug #X
**Onde:** (página/componente)
**O que deveria acontecer:** 
**O que aconteceu:**
**Screenshot:** (anexar)
**Severidade:** 🔴 Alta / 🟡 Média / 🟢 Baixa
```

---

## ✅ CRITÉRIOS DE APROVAÇÃO

O Dashboard está aprovado se:

- [ ] Nenhum erro no console do navegador (F12)
- [ ] Todas as animações funcionam suavemente
- [ ] Responsividade OK em todos os breakpoints
- [ ] Cores seguem design system (#f76926)
- [ ] Funcionalidades não implementadas têm badge "EM BREVE"
- [ ] Navegação entre Dashboard e Hub funciona
- [ ] Logout funciona

---

## 🚀 PRÓXIMOS PASSOS APÓS TESTE

1. **Corrigir** bugs encontrados
2. **Adicionar** badges "EM BREVE" onde necessário
3. **Deploy** para produção (Vercel/Netlify)
4. **Documentar** funcionalidades implementadas vs pendentes

---

*Prompt de teste - Dashboard Totum v1.0*
