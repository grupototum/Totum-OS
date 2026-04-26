# TOTUM OS DESIGN SYSTEM — Light Ops / Dark Command

> Base clara e minimalista para operação diária, com dark mode reservado para chats técnicos, logs e consoles.
> Black background + zinc scale + brand red (#ef233c) accent
> Zero border-radius, high contrast, industrial aesthetic

---

## Índice

1. [Design Tokens](#design-tokens)
2. [Cores](#cores)
3. [Tipografia](#tipografia)
4. [Layout](#layout)
5. [Animações](#animações)
6. [Componentes](#componentes)
7. [Ícones](#ícones)
8. [Acessibilidade](#acessibilidade)
9. [Exemplos de Uso](#exemplos-de-uso)

---

## Design Tokens

### Cores Principais

| Token | Valor | Uso |
|-------|-------|-----|
| `--background` | `#000000` | Background principal (páginas) |
| `--foreground` | `#fafafa` | Texto principal |
| `--primary` | `#ef233c` | Brand red — CTAs, badges, active states |
| `--primary-foreground` | `#ffffff` | Texto sobre primary |
| `--card` | `#09090b` | Cards, modais, popovers |
| `--card-foreground` | `#fafafa` | Texto em cards |
| `--muted` | `#27272a` | Backgrounds secundários |
| `--muted-foreground` | `#a1a1aa` | Texto secundário, labels |
| `--border` | `#27272a` | Bordas, divisores |
| `--sidebar` | `#000000` | Sidebar background |
| `--sidebar-border` | `#27272a` | Sidebar borders |
| `--sidebar-accent` | `#27272a` | Hover/selected em sidebar |
| `--sidebar-foreground` | `#fafafa` | Texto na sidebar |

### Tipografia

| Token | Valor | Uso |
|-------|-------|-----|
| Fonte Principal | `Inter` | Todo o texto |
| Fonte Mono | `JetBrains Mono` | Labels, códigos, badges numéricas |
| Títulos | `tracking-tighter` | H1, H2, H3 |
| Labels | `tracking-widest uppercase` | Metadados, section labels |

### Layout

| Token | Valor |
|-------|-------|
| Container Max | `1400px` |
| Grid | `12 colunas` |
| Padding | `p-6` (mobile), `p-8` (desktop) |
| Border Radius | `0` (brutalist — nenhuma borda arredondada) |
| Border Radius (exceções) | `rounded-full` (avatars, status dots apenas) |

---

## Cores

### Background

```css
bg-background          /* Principal (#000) */
bg-card                /* Cards (#09090b) */
bg-muted               /* Seções secundárias (#27272a) */
bg-sidebar             /* Sidebar (#000) */
bg-primary/10          /* Hover sutil em primary */
```

### Texto

```css
text-foreground        /* Principal (#fafafa) */
text-muted-foreground  /* Secundário (#a1a1aa) */
text-primary           /* Brand red (#ef233c) */
text-white             /* Sobre fundos escuros */
```

### Bordas

```css
border-border          /* Padrão (#27272a) */
border-border/40       /* Guias de grid, divisores sutis */
border-primary/30      /* Bordas em hover de cards */
```

### Estados

```css
/* Hover em cards */
bg-card hover:bg-muted border-border hover:border-primary/30

/* Active/Selected */
bg-sidebar-accent text-primary

/* Disabled */
opacity-50 cursor-not-allowed

/* Focus ring (acessibilidade) */
focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background
```

---

## Tipografia

### Títulos

```tsx
// Display H1 - Hero
<h1 className="text-4xl md:text-6xl font-semibold tracking-tighter leading-none text-foreground">
  Dashboard
</h1>

// Heading H2
<h2 className="text-3xl md:text-4xl font-medium tracking-tighter text-foreground">
  AI Command Center
</h2>

// Heading H3
<h3 className="text-2xl font-medium tracking-tight text-foreground">
  Configurações
</h3>
```

### Labels (Mono)

```tsx
// Section label na sidebar
<span className="font-mono text-[10px] uppercase tracking-widest text-sidebar-foreground/35">
  Visão
</span>

// Badge / metadata
<span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
  Online
</span>
```

### Body

```tsx
// Body Large
<p className="text-lg leading-relaxed text-foreground">
  Descrição principal...
</p>

// Body padrão
<p className="text-sm leading-relaxed text-muted-foreground">
  Descrição secundária...
</p>
```

---

## Layout

### Container Principal

```tsx
<div className="max-w-[1400px] mx-auto border-x border-border relative bg-background">
  {/* Grid Guides */}
  <div className="absolute inset-0 pointer-events-none grid grid-cols-1 md:grid-cols-12 gap-0 z-0 h-full w-full">
    <div className="hidden md:block md:col-span-3 border-r border-border/40 h-full" />
    <div className="hidden md:block md:col-span-6 border-r border-border/40 h-full" />
    <div className="hidden md:block md:col-span-3 h-full" />
  </div>
  
  {/* Content */}
  ...
</div>
```

### Grid 12 Colunas

```tsx
<div className="grid grid-cols-1 md:grid-cols-12">
  <div className="col-span-1 md:col-span-9">Left content</div>
  <div className="col-span-1 md:col-span-3">Right content</div>
</div>
```

### Seção com Borda

```tsx
<section className="relative z-10 border-b border-border">
  ...
</section>
```

---

## Animações

### Transições Padrão

```css
transition-all duration-200        /* Hover states */
transition-colors duration-200     /* Cores */
transition-transform duration-300  /* Movimentos */
```

### Micro-interações

```tsx
// Card hover — subtle lift + border glow
<div className="bg-card border border-border hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-200">
  ...
</div>

// Button hover
<button className="bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-200">
  ...
</button>

// Icon hover
<Icon className="text-muted-foreground group-hover:text-primary transition-colors duration-200" />
```

### Loading / Skeleton

```tsx
// Skeleton pulse
<div className="animate-pulse bg-muted rounded-none h-4 w-32" />

// Industrial pulse (logo loader)
<div className="animate-industrial-pulse">
  <div className="w-[5px] h-6 bg-primary rounded-full" />
  <div className="w-[5px] h-4 bg-primary/60 rounded-full" />
  <div className="w-[5px] h-6 bg-primary rounded-full" />
</div>
```

---

## Componentes

### Cards

```tsx
<Card className="bg-card border-border rounded-none">
  <CardHeader>
    <CardTitle className="text-foreground">Título</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-muted-foreground">Conteúdo...</p>
  </CardContent>
</Card>
```

### Badges

```tsx
// Status badge
<Badge variant="default" className="rounded-none">Ativo</Badge>

// Outline badge
<Badge variant="outline" className="rounded-none">Pendente</Badge>

// Secondary badge
<Badge variant="secondary" className="rounded-none">Beta</Badge>
```

### Buttons

```tsx
// Primary
<Button className="rounded-none">Ação</Button>

// Secondary
<Button variant="secondary" className="rounded-none">Secundário</Button>

// Outline
<Button variant="outline" className="rounded-none">Outline</Button>

// Ghost
<Button variant="ghost" className="rounded-none">Ghost</Button>

// Destructive
<Button variant="destructive" className="rounded-none">Remover</Button>
```

### Inputs

```tsx
<Input 
  className="rounded-none bg-card border-border focus-visible:ring-primary focus-visible:ring-offset-background" 
  placeholder="Digite aqui..."
/>
```

### Sidebar Navigation

```tsx
// Active item
<button className="w-full flex items-center gap-3 px-3 py-2.5 bg-sidebar-accent text-primary rounded-lg">
  <Icon className="w-[18px] h-[18px]" />
  <span className="text-[13px] font-medium tracking-wide">Item</span>
</button>

// Inactive item
<button className="w-full flex items-center gap-3 px-3 py-2.5 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-lg transition-all duration-200">
  <Icon className="w-[18px] h-[18px]" />
  <span className="text-[13px] font-medium tracking-wide">Item</span>
</button>
```

---

## Ícones

- **Biblioteca:** `lucide-react`
- **Tamanho padrão:** `w-[18px] h-[18px]` (navegação), `w-4 h-4` (inline)
- **Cor padrão:** herda do texto pai ou `text-muted-foreground`
- **Active state:** `text-primary`

```tsx
import { Bot, Brain, Settings } from "lucide-react";

<Bot className="w-[18px] h-[18px]" />
<Brain className="w-4 h-4 text-muted-foreground" />
<Settings className="w-4 h-4 text-primary" />
```

---

## Acessibilidade

### Focus Rings

Todos os elementos interativos devem ter focus rings visíveis:

```tsx
<button className="focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background">
  ...
</button>
```

### Contraste

- Texto principal: `#fafafa` sobre `#000000` (ratio 19.5:1) ✅
- Texto secundário: `#a1a1aa` sobre `#000000` (ratio 8.6:1) ✅
- Primary: `#ef233c` sobre `#000000` (ratio 5.8:1) ✅

### Reduced Motion

```tsx
// Respeitar prefers-reduced-motion
<div className="motion-safe:animate-pulse motion-reduce:animate-none">
  ...
</div>
```

### ARIA Labels

- Botões de ícone sempre com `aria-label`
- Links de navegação com `aria-current="page"` quando ativos
- Modais com `role="dialog"` e `aria-modal="true"`

---

## Exemplos de Uso

### Página Completa

```tsx
export default function ExamplePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border px-6 py-4">
        <h1 className="text-2xl font-semibold tracking-tight">Título da Página</h1>
        <p className="text-sm text-muted-foreground mt-1">Descrição da página</p>
      </header>

      {/* Content */}
      <main className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card border-border rounded-none">
            <CardContent className="p-6">
              <h3 className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
                Métrica
              </h3>
              <p className="text-3xl font-semibold text-foreground">1,234</p>
            </CardContent>
          </Card>
          ...
        </div>
      </main>
    </div>
  );
}
```

### Empty State

```tsx
<div className="flex flex-col items-center justify-center py-16 text-center">
  <div className="w-16 h-16 bg-muted flex items-center justify-center mb-4">
    <Inbox className="w-8 h-8 text-muted-foreground" />
  </div>
  <h3 className="text-lg font-medium text-foreground mb-2">Nada aqui ainda</h3>
  <p className="text-sm text-muted-foreground max-w-sm mb-4">
    Descrição do que o usuário pode fazer.
  </p>
  <Button className="rounded-none">Criar novo</Button>
</div>
```

### Toast / Notification

```tsx
toast.success("Operação concluída", {
  style: {
    background: "#09090b",
    border: "1px solid #27272a",
    borderRadius: "0",
    color: "#fafafa",
  },
});
```

---

## Changelog

### v4.1 — Dark Mode (Atual)
- Background alterado de `#EAEAE5` para `#000000`
- Escala de cores alterada de `stone` para `zinc`
- Accent color: `#ef233c` (brand red)
- Border radius: `0` (brutalist)
- Sidebar: dark, sem blur intenso

### v4.0 — Base
- Sistema original com cores light-mode
