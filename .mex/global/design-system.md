# Design System - Totum
## Upixel/Totum Design Language

---

## 🎨 Paleta de Cores

### Cores Primárias
| Nome | Hex | Uso |
|------|-----|-----|
| **Totum Orange** | `#f76926` | Botões primários, CTAs, destaques |
| **Totum Dark** | `#050505` | Fundo principal |
| **Totum Card** | `#0a0a0a` | Cards, containers |
| **Totum Border** | `#1a1a1a` | Bordas sutis |

### Cores de Status
| Nome | Hex | Uso |
|------|-----|-----|
| **Success** | `#22c55e` | Online, sucesso, positivo |
| **Warning** | `#eab308` | Aviso, standby, atenção |
| **Error** | `#ef4444` | Erro, offline, crítico |
| **Info** | `#3b82f6` | Informação, links |

### Cores de Texto
| Nome | Hex | Uso |
|------|-----|-----|
| **Text Primary** | `#ffffff` | Títulos, texto principal |
| **Text Secondary** | `#a3a3a3` | Descrições, labels |
| **Text Muted** | `#737373` | Placeholders, desabilitado |

---

## 🔤 Tipografia

### Fontes
- **Headings:** `Inter` ou `Bricolage Grotesque`
- **Body:** `Inter`
- **Monospace:** `JetBrains Mono` (código, métricas)

### Tamanhos
```css
--text-xs: 0.75rem;      /* 12px - Labels, tags */
--text-sm: 0.875rem;     /* 14px - Descrições */
--text-base: 1rem;       /* 16px - Corpo */
--text-lg: 1.125rem;     /* 18px - Subtítulos */
--text-xl: 1.25rem;      /* 20px - Títulos pequenos */
--text-2xl: 1.5rem;      /* 24px - Títulos */
--text-3xl: 1.875rem;    /* 30px - Títulos grandes */
--text-4xl: 2.25rem;     /* 36px - Display */
```

---

## 📐 Espaçamento

### Scale
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
```

---

## 🎯 Componentes

### Cards
```tsx
// Card Base
<div className="rounded-xl ring-1 ring-white/10 bg-white/[0.02] p-6">
  {/* Conteúdo */}
</div>

// Card com Glow (destaque)
<div className="relative bg-neutral-900 rounded-[20px] p-[1.5px] overflow-hidden">
  <div className="absolute inset-0 bg-gradient-to-b from-orange-400 to-transparent opacity-40" />
  <div className="relative bg-[#0A0A0A] rounded-[18px] p-6">
    {/* Conteúdo */}
  </div>
</div>

// Card com borda colorida
<div className="rounded-xl ring-1 ring-white/10 bg-white/[0.02] overflow-hidden">
  <div className="px-4 py-2 bg-purple-500/10 border-b border-purple-500/20">
    {/* Header */}
  </div>
  <div className="p-5">
    {/* Body */}
  </div>
</div>
```

### Botões
```tsx
// Primário (Orange)
<button className="bg-[#f76926] hover:bg-[#e55a1b] text-white px-4 py-2 rounded-lg transition-colors">
  Ação
</button>

// Secundário (Outline)
<button className="ring-1 ring-white/20 hover:ring-white/40 text-white px-4 py-2 rounded-lg transition-all">
  Ação
</button>

// Ghost
<button className="text-neutral-400 hover:text-white transition-colors">
  Ação
</button>
```

### Status Indicators
```tsx
// Online
<span className="relative flex h-2 w-2">
  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
</span>

// Status Badge
<span className="text-[10px] rounded-md bg-green-500/10 text-green-400 ring-1 ring-green-500/20 px-2 py-0.5 uppercase">
  Online
</span>
```

### Progress Bars
```tsx
<div className="flex-1 bg-white/5 rounded-full h-2">
  <div className="bg-orange-500 rounded-full h-2" style={{ width: '80%' }} />
</div>
```

---

## 🌙 Dark Mode (Padrão)

O sistema usa dark mode por padrão:

```css
body {
  background-color: #050505;
  color: #ffffff;
}
```

---

## ✨ Animações

### Fade In Up
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 0.6s ease-out;
}
```

### Pulse (Status)
```css
.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}
```

### Hover Lift
```css
.hover-lift {
  transition: transform 0.2s, box-shadow 0.2s;
}
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
```

---

## 📱 Breakpoints

```css
--sm: 640px;   /* Mobile landscape */
--md: 768px;   /* Tablet */
--lg: 1024px;  /* Desktop */
--xl: 1280px;  /* Large desktop */
```

---

## 🔗 Recursos

- **Ícones:** Lucide React
- **UI Components:** shadcn/ui + Radix
- **Tailwind Config:** Extensão das cores acima

---

*Design System Totum v1.0*