# Design System - Totum v3 (Industrial)

## Upixel/Totum Design Language — Industrial Edition

---

## 🎨 Paleta de Cores (via CSS Tokens)

### Cores Primárias (HSL em index.css)
| Token | Dark Mode | Light Mode | Uso |
|-------|-----------|------------|-----|
| `--primary` | `28 90% 56%` | `28 90% 56%` | Botões primários, CTAs, destaques (orange) |
| `--background` | `0 0% 7%` | `0 0% 90%` | Fundo principal |
| `--card` | `0 0% 10%` | `0 0% 96%` | Cards, containers |
| `--border` | `0 0% 18%` | `0 0% 82%` | Bordas sutis |
| `--muted` | `0 0% 16%` | `0 0% 88%` | Fundos secundários |
| `--foreground` | `0 0% 96%` | `0 0% 4%` | Texto principal |

### Tokens Industriais
| Token | Dark Mode | Uso |
|-------|-----------|-----|
| `--surface` | `0 0% 7%` | Superfície base |
| `--surface-container` | `0 0% 10%` | Container |
| `--surface-container-high` | `0 0% 13%` | Container elevado |
| `--outline` | `0 0% 30%` | Contorno |
| `--outline-variant` | `0 0% 18%` | Contorno sutil |

### Cores de Status (diretas no Tailwind — intencionais)
| Nome | Classe | Uso |
|------|--------|-----|
| **Success** | `emerald-500` | Online, sucesso, positivo |
| **Warning** | `amber-500` | Aviso, standby, atenção |
| **Error** | `red-500` / `destructive` | Erro, offline, crítico |
| **Info** | `blue-500` | Informação, links |

### ⚠️ Regra de Cores
- **SEMPRE** usar tokens semânticos: `bg-background`, `text-foreground`, `bg-card`, `text-primary`, `bg-muted`, etc.
- **NUNCA** usar: `bg-white`, `bg-black`, `text-white`, `text-black`, `bg-neutral-*`, `bg-gray-*`
- **Exceções permitidas**: cores de status (emerald, amber, red, blue) e overlays (`bg-black/80` em modais do shadcn)

---

## 🔤 Tipografia

### Fontes (Google Fonts)
| Uso | Fonte | Classe Tailwind |
|-----|-------|-----------------|
| **Corpo** | Space Grotesk (300-700) | `font-sans` / `font-body` |
| **Títulos** | Oswald (400-700) | `font-heading` / `font-display` |
| **Código/Dados** | Space Mono (400, 700) | `font-mono` |

### Aplicação automática
- `html, body` → Space Grotesk
- `h1-h6` → Oswald, weight 500, letter-spacing -0.01em
- `.label-industrial` → Space Grotesk, uppercase, tracking-widest
- `.font-mono-industrial` → Space Mono

---

## 🎭 Modo Claro / Escuro

- Gerenciado via `ThemeContext` (localStorage)
- Classe `.light` no `<html>` para modo claro
- Dark mode é o padrão (`:root`)
- Transição suave: `0.3s ease` em background-color, color, border-color, box-shadow
- Toggle flutuante: `fixed top-4 right-4 z-50`

---

## 📐 Componentes

### Cards (usar tokens)
```tsx
// Card Base — usa tokens
<Card className="bg-card border-border">
  <CardContent>{/* ... */}</CardContent>
</Card>

// Card com glow industrial
<div className="animate-totum-glow rounded-xl bg-card border border-border p-6">
  {/* Conteúdo */}
</div>
```

### Botões (usar tokens)
```tsx
// Primário (usa --primary automaticamente)
<Button>Ação</Button>

// Outline
<Button variant="outline">Ação</Button>

// Ghost
<Button variant="ghost">Ação</Button>
```

### Status Indicators
```tsx
// Badge EM BREVE / DADOS DE DEMONSTRAÇÃO
<Badge className="bg-orange-500/20 text-orange-400">EM BREVE</Badge>

// Status Online
<span className="relative flex h-2 w-2">
  <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75" />
  <span className="relative rounded-full h-2 w-2 bg-emerald-500" />
</span>
```

---

## ✨ Animações

| Nome | Classe | Efeito |
|------|--------|--------|
| Totum Glow | `animate-totum-glow` | Pulsação de sombra laranja |
| Industrial Pulse | `animate-industrial-pulse` | Fade in/out 2s |
| Grid Line Pulse | (keyframe) | Linhas de grid pulsantes |

---

## 📱 Sidebar

| Token | Dark | Light |
|-------|------|-------|
| `--sidebar-background` | `0 0% 5%` | `0 0% 96%` |
| `--sidebar-foreground` | `0 0% 90%` | `0 0% 20%` |
| `--sidebar-primary` | `28 90% 56%` | `28 90% 56%` |
| `--sidebar-border` | `0 0% 14%` | `0 0% 88%` |

Largura: 280px (desktop) | Drawer com overlay (mobile)

---

## 🔗 Recursos

- **Ícones:** Lucide React
- **UI Components:** shadcn/ui + Radix
- **Animações:** Framer Motion
- **Border Radius:** `--radius: 1rem`

---

*Design System Totum v3.0 — Industrial Edition*
