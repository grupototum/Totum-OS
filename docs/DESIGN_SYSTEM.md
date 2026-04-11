# TOTUM DESIGN SYSTEM v4

> Replica exata do Design System Digital Architect  
> Aplicado ao Apps Totum

---

## Índice

1. [Design Tokens](#design-tokens)
2. [Cores](#cores)
3. [Tipografia](#tipografia)
4. [Layout](#layout)
5. [Animações](#animações)
6. [Componentes](#componentes)
7. [Ícones](#ícones)
8. [Exemplos de Uso](#exemplos-de-uso)

---

## Design Tokens

### Cores Principais

| Token | Valor | Uso |
|-------|-------|-----|
| `--totum-bg` | `#EAEAE5` | Background principal |
| `--totum-stone-900` | `#1C1917` | Texto principal, botões |
| `--totum-stone-500` | `#78716C` | Texto secundário |
| `--totum-stone-300` | `#D6D3D1` | Bordas, divisores |

### Tipografia

| Token | Valor | Uso |
|-------|-------|-----|
| Fonte Principal | `Inter` | Todo o texto |
| Fonte Mono | `SF Mono` | Labels, códigos |
| Títulos | `tracking-tighter` | H1, H2, H3 |
| Labels | `tracking-widest uppercase` | Metadados |

### Layout

| Token | Valor |
|-------|-------|
| Container Max | `1400px` |
| Grid | `12 colunas` |
| Padding | `p-8` (mobile), `p-12` (desktop) |

---

## Cores

### Background

```css
bg-[#EAEAE5]        /* Principal */
bg-stone-50         /* Cards hover */
bg-white            /* Cards hover */
bg-stone-100        /* Seções secundárias */
bg-stone-900        /* Footer, badges primary */
```

### Texto

```css
text-stone-900      /* Principal */
text-stone-800      /* Secundário */
text-stone-600      /* Body */
text-stone-500      /* Muted, labels */
text-stone-400      /* Placeholders */
text-white          /* Sobre fundos escuros */
```

### Bordas

```css
border-stone-300    /* Padrão */
border-stone-300/40 /* Grid guides */
border-white/40     /* Glass badges */
```

---

## Tipografia

### Títulos

```tsx
// Display H1 - Hero
<h1 className="text-6xl md:text-8xl font-semibold tracking-tighter leading-none text-stone-900">
  Digital Architect
</h1>

// Heading H2
<h2 className="text-5xl font-medium tracking-tighter text-stone-900">
  Design & Strategy
</h2>

// Heading H3
<h3 className="text-4xl font-medium tracking-tight text-stone-900">
  Case Studies
</h3>
```

### Labels (Mono)

```tsx
// Label padrão
<span className="font-mono text-xs uppercase tracking-widest text-stone-500">
  Currently available for Q4 2024
</span>

// Section number
<span className="font-mono text-xs uppercase text-stone-500">
  01 / Selected Work
</span>
```

### Body

```tsx
// Body Large
<p className="text-lg leading-relaxed text-stone-800">
  Thoughts on the intersection of design, technology...
</p>

// Body padrão
<p className="text-sm leading-relaxed text-stone-500">
  Description of the project...
</p>
```

---

## Layout

### Container Principal

```tsx
<div className="max-w-[1400px] mx-auto border-x border-stone-300 relative bg-[#EAEAE5]">
  {/* Grid Guides */}
  <div className="absolute inset-0 pointer-events-none grid grid-cols-1 md:grid-cols-12 gap-0 z-0 h-full w-full">
    <div className="hidden md:block md:col-span-3 border-r border-stone-300/40 h-full" />
    <div className="hidden md:block md:col-span-6 border-r border-stone-300/40 h-full" />
    <div className="hidden md:block md:col-span-3 h-full" />
  </div>
  
  {/* Content */}
  ...
</div>
```

### Grid 12 Colunas

```tsx
<div className="grid grid-cols-1 md:grid-cols-12">
  <div className="col-span-1 md:col-span-9" >Left content</div>
  <div className="col-span-1 md:col-span-3" >Right content</div>
</div>
```

### Seção com Borda

```tsx
<section className="relative z-10 border-b border-stone-300">
  ...
</section>
```

---

## Animações

### Reveal (Scroll)

```tsx
import { useReveal } from "@/hooks/useReveal";

function MyComponent() {
  const { ref, isActive } = useReveal({ threshold: 0.15 });
  
  return (
    <div 
      ref={ref} 
      className={cn("reveal", isActive && "active")}
    >
      Content
    </div>
  );
}
```

### Stagger Delays

```tsx
<div className={cn("reveal delay-100", isActive && "active")}>Item 1</div>
<div className={cn("reveal delay-200", isActive && "active")}>Item 2</div>
<div className={cn("reveal delay-300", isActive && "active")}>Item 3</div>
```

### Text Reveal (Masked)

```tsx
import { useTextReveal } from "@/hooks/useReveal";

function HeroTitle() {
  const { ref, isActive } = useTextReveal();
  
  return (
    <h1 
      ref={ref} 
      className={cn("text-6xl font-semibold tracking-tighter", isActive && "reveal-active")}
    >
      <span className="text-reveal-wrapper">
        <span className="text-reveal-content delay-200">Digital</span>
      </span>
      {" "}
      <span className="text-reveal-wrapper">
        <span className="text-reveal-content delay-300">Architect</span>
      </span>
    </h1>
  );
}
```

### Navigation Load

```tsx
import { useNavLoad } from "@/hooks/useReveal";

function Header() {
  const loaded = useNavLoad(100);
  
  return (
    <header className={cn("nav-load", loaded && "loaded")}>
      ...
    </header>
  );
}
```

### Easing

```css
/* Easing padrão para reveals */
cubic-bezier(0.16, 1, 0.3, 1)

/* Duração */
1s        /* Reveal padrão */
1.2s      /* Text reveal */
0.8s      /* Nav load */
0.5s      /* Hover states */
```

---

## Componentes

### Button

```tsx
import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

// Primary
<Button variant="primary">Primary Action</Button>

// Primary com ícone
<Button 
  variant="primary" 
  icon={<Icon icon="solar:file-download-linear" />}
>
  Download CV
</Button>

// Outline (Pill)
<Button variant="outline">
  View All Projects
  <Icon icon="solar:arrow-right-linear" />
</Button>

// Link
<Button variant="link">View Portfolio</Button>
```

### Card

```tsx
import { Card, ProjectCard, StatCard } from "@/components/ui/card";

// Card básico
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Description...</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
</Card>

// Project Card
<ProjectCard
  number="01"
  category="Fintech"
  title="Nova Finance"
  description="Redesigning the investment flow..."
  imageUrl="/path/to/image.jpg"
/>

// Stat Card
<StatCard
  icon={<Icon icon="solar:layers-minimalistic-linear" className="text-3xl" />}
  value="42"
  label="PROJECTS SHIPPED"
  delay="500"
/>
```

### Badge

```tsx
import { Badge, StatusBadge, CountBadge } from "@/components/ui/badge";

// Glass badge (para fundos escuros)
<Badge variant="glass">UI/UX</Badge>

// Status badges
<Badge variant="success">Completed</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="error">Failed</Badge>
<Badge variant="info">Info</Badge>

// Status Badge com dot
<StatusBadge status="online" label="Online" />

// Count Badge
<CountBadge count={5} />
```

### Label

```tsx
import { Label, SectionNumber, MetaLabel } from "@/components/ui/label";

// Label padrão
<Label>Currently available</Label>

// Variantes
<Label variant="muted">Muted text</Label>
<Label variant="dark">Dark text</Label>

// Section Number
<SectionNumber number="01" total="Selected Work" />

// Meta Label
<MetaLabel date="Oct 12, 2024" category="Fintech" />
```

### Navigation

```tsx
import { Navigation } from "@/components/ui/navigation";
import { Icon } from "@iconify/react";
import { useNavLoad } from "@/hooks/useReveal";

function Header() {
  const loaded = useNavLoad();
  
  return (
    <Navigation
      loaded={loaded}
      brand={{
        icon: <Icon icon="solar:atom-linear" />,
        name: "TOTUM"
      }}
      leftLinks={[
        { label: "Work", href: "#work" },
        { label: "Writing", href: "#writing", hidden: true },
      ]}
      rightLinks={[
        { label: "About", href: "#about", hidden: true },
        { label: "Contact", href: "#contact" },
      ]}
    />
  );
}
```

---

## Ícones

Usamos a biblioteca **Solar** do Iconify.

### Instalação

```bash
npm install @iconify/react
```

### Uso

```tsx
import { Icon } from "@iconify/react";

// Básico
<Icon icon="solar:atom-linear" />

// Com tamanho
<Icon icon="solar:atom-linear" className="text-3xl" />

// Com cor
<Icon icon="solar:atom-linear" className="text-stone-400" />

// Com transição
<Icon 
  icon="solar:atom-linear" 
  className="text-stone-400 group-hover:text-stone-800 transition-colors"
/>
```

### Ícones Comuns

| Ícone | Uso |
|-------|-----|
| `solar:atom-linear` | Brand, logo |
| `solar:layers-minimalistic-linear` | Projects |
| `solar:clock-circle-linear` | Time, experience |
| `solar:cup-star-linear` | Awards |
| `solar:arrow-right-linear` | Navigation |
| `solar:arrow-right-up-linear` | External link |
| `solar:arrow-down-linear` | Scroll |
| `solar:check-circle-linear` | Check, completed |
| `solar:file-download-linear` | Download |
| `solar:scanner-linear` | Scan, process |
| `solar:pen-new-square-linear` | Writing |
| `solar:globe-linear` | Global, footer |
| `solar:star-fall-linear` | Decorative |
| `solar:record-circle-linear` | Decorative |

---

## Exemplos de Uso

### Hero Section

```tsx
<section className="relative z-10 grid grid-cols-1 md:grid-cols-12 border-b border-stone-300 min-h-[600px]">
  {/* Hero Image */}
  <div className="col-span-1 md:col-span-9 border-b md:border-b-0 md:border-r border-stone-300 relative overflow-hidden">
    <img 
      src="/hero.jpg" 
      className="w-full h-full object-cover grayscale contrast-125"
      alt="Hero"
    />
    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-stone-900/40" />
    
    {/* Hero Text */}
    <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white mix-blend-difference z-20">
      <h1 className="text-6xl md:text-8xl font-semibold tracking-tighter leading-none mb-2">
        <span className="text-reveal-wrapper">
          <span className="text-reveal-content delay-200">Digital</span>
        </span>
        {" "}
        <span className="text-reveal-wrapper">
          <span className="text-reveal-content delay-300">Architect</span>
        </span>
      </h1>
      
      <div className="mt-6 flex items-center gap-4">
        <Badge variant="glass">UI/UX</Badge>
        <Badge variant="glass">Interaction</Badge>
      </div>
    </div>
  </div>
  
  {/* Stats */}
  <div className="col-span-1 md:col-span-3 grid grid-rows-2">
    <StatCard
      icon={<Icon icon="solar:layers-minimalistic-linear" />}
      value="42"
      label="PROJECTS"
      delay="500"
    />
    <StatCard
      icon={<Icon icon="solar:clock-circle-linear" />}
      value="6+"
      label="YEARS"
      delay="700"
    />
  </div>
</section>
```

### Project List

```tsx
<section id="work" className="relative z-10 py-12">
  <SectionHeader 
    number="01 / Selected Work" 
    title="Case Studies" 
  />
  
  <div className="divide-y divide-stone-300">
    {projects.map((project, index) => (
      <ProjectCard
        key={project.id}
        number={String(index + 1).padStart(2, '0')}
        category={project.category}
        title={project.title}
        description={project.description}
        imageUrl={project.imageUrl}
      />
    ))}
  </div>
</section>
```

### Marquee

```tsx
<div className="border-b border-stone-300 overflow-hidden py-6 bg-stone-100/50">
  <div className="flex overflow-hidden">
    <div className="flex shrink-0 animate-scroll">
      <span className="text-sm font-mono uppercase tracking-widest text-stone-500 mx-8">
        Currently available for Q4 2024
      </span>
      <span className="text-sm font-mono uppercase tracking-widest text-stone-500 mx-8">•</span>
      <span className="text-sm font-mono uppercase tracking-widest text-stone-500 mx-8">
        Based in San Francisco
      </span>
      <span className="text-sm font-mono uppercase tracking-widest text-stone-500 mx-8">•</span>
    </div>
    {/* Duplicate for seamless loop */}
    <div className="flex shrink-0 animate-scroll">
      ...
    </div>
  </div>
</div>
```

---

## Arquivos

```
src/
├── components/
│   └── ui/
│       ├── button.tsx      # Botões (primary, outline, link)
│       ├── card.tsx        # Cards (padrão, project, stat)
│       ├── badge.tsx       # Badges (glass, status, count)
│       ├── label.tsx       # Labels mono
│       └── navigation.tsx  # Header/Nav
├── hooks/
│   └── useReveal.ts        # Hooks para animações
├── styles/
│   └── design-system.css   # CSS puro com todas as classes
├── index.css               # Importa design-system.css
└── tailwind.config.ts      # Configuração Tailwind
```

---

## Créditos

Design baseado em **Digital Architect** - Portfolio Template  
Implementado para **Apps Totum** v4
