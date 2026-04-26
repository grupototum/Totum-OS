import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      /* ============================================================
         FONTS — Editorial DS
         Inter is the single primary family. Mono stack kept for
         uppercase micro-labels; `display` aliases Inter at tighter
         tracking so legacy `font-manrope` usages still render.
         ============================================================ */
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        display: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        manrope: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "SF Mono",
          "Menlo",
          "Consolas",
          "Liberation Mono",
          "monospace",
        ],
      },

      /* ============================================================
         COLORS — Editorial token set
         Light surface: #F3F3F1 page, stone-300 outer, #08090A dark,
         blue-600 accent. Dark mirrors with #08090A page and blue-400.
         Legacy `brand.red` kept as a compatibility alias so existing
         callers compile; visual usage should migrate to `accent`.
         ============================================================ */
      colors: {
        brand: {
          DEFAULT: "hsl(var(--primary))",
          red: "hsl(var(--primary))",
          "red-dark": "hsl(var(--primary))",
          "red-light": "hsl(var(--primary))",
        },

        success: "#059669",
        warning: "#d97706",
        error: "#dc2626",
        "brand-red": "hsl(var(--primary))",

        // Neutral scale used across the editorial DS.
        // Aliased to Tailwind's stone/zinc defaults so existing utility
        // classes keep working; values here are the official DS tones.
        ink: {
          50: "#FAFAF9",
          100: "#F3F3F1",
          200: "#E7E5E4",
          300: "#D6D3D1",
          400: "#A8A29E",
          500: "#78716C",
          600: "#57534E",
          700: "#3F3F46",
          800: "#1C1917",
          900: "#0A0A0A",
          950: "#08090A",
        },

        zinc: {
          50: "#fafafa",
          100: "#f4f4f5",
          200: "#e4e4e7",
          300: "#d4d4d8",
          400: "#a1a1aa",
          500: "#71717a",
          600: "#52525b",
          700: "#3f3f46",
          800: "#27272a",
          900: "#18181b",
          950: "#09090b",
        },

        // Shadcn semantic tokens (HSL vars → see src/index.css)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        surface: {
          DEFAULT: "hsl(var(--surface))",
          container: "hsl(var(--surface-container))",
          high: "hsl(var(--surface-container-high))",
          inverted: "hsl(var(--surface-inverted))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },

      /* ============================================================
         BACKGROUND IMAGES — Editorial gradients (subtle)
         ============================================================ */
      backgroundImage: {
        "editorial-radial":
          "radial-gradient(circle at 20% 0%, hsl(var(--accent) / 0.08) 0%, transparent 55%)",
        "editorial-surface":
          "linear-gradient(180deg, hsl(var(--surface)) 0%, hsl(var(--surface-container)) 100%)",
      },

      /* ============================================================
         FONT SIZES — Editorial scale
         ============================================================ */
      fontSize: {
        // Display / hero headings (match reference text-9xl / text-8xl)
        "display-2xl": ["8rem", { lineHeight: "0.85", letterSpacing: "-0.04em" }],
        "display-xl": ["6rem", { lineHeight: "0.9", letterSpacing: "-0.04em" }],
        "display-lg": ["4.5rem", { lineHeight: "1", letterSpacing: "-0.03em" }],

        // Semantic heading scale (keep tokens so existing `text-h1` classes still compile)
        h1: ["4.5rem", { lineHeight: "1", letterSpacing: "-0.03em" }],
        h2: ["3rem", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        h3: ["1.75rem", { lineHeight: "1.2", letterSpacing: "-0.015em" }],
        h4: ["1.25rem", { lineHeight: "1.3", letterSpacing: "-0.01em" }],

        // Body
        "body-lg": ["1.125rem", { lineHeight: "1.65" }],
        body: ["0.9375rem", { lineHeight: "1.6" }],
        "body-sm": ["0.8125rem", { lineHeight: "1.5" }],

        // Micro-labels (uppercase mono)
        "label-lg": ["0.8125rem", { lineHeight: "1.4", letterSpacing: "0.18em" }],
        "label-md": ["0.75rem", { lineHeight: "1.4", letterSpacing: "0.22em" }],
        "label-sm": ["0.6875rem", { lineHeight: "1.4", letterSpacing: "0.25em" }],
        mono: ["0.65rem", { lineHeight: "1.4", letterSpacing: "0.25em" }],
      },

      letterSpacing: {
        tighter: "-0.04em",
        tight: "-0.02em",
        normal: "0",
        wide: "0.025em",
        wider: "0.05em",
        widest: "0.1em",
        label: "0.22em",
        "label-xl": "0.25em",
      },

      /* ============================================================
         BORDER RADIUS — Editorial scale
         Pill-forward: default components sit on `lg` (0.75rem)
         while big surfaces use `2xl` / `3xl` (the 2rem / 2.5rem rings
         around the reference design's hero panels).
         ============================================================ */
      borderRadius: {
        sm: "0",
        md: "0",
        lg: "var(--radius)",
        xl: "0",
        "2xl": "0",
        "3xl": "0",
        "4xl": "0",
      },

      /* ============================================================
         ANIMATIONS — kept minimal and editorial
         ============================================================ */
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-slide-in": {
          "0%": {
            opacity: "0",
            transform: "translateY(24px)",
            filter: "blur(6px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
            filter: "blur(0px)",
          },
        },
        "column-reveal": {
          "0%": { clipPath: "inset(0 0 100% 0)", opacity: "0" },
          "100%": { clipPath: "inset(0 0 0% 0)", opacity: "1" },
        },
        "nav-load": {
          from: { opacity: "0", transform: "translateY(-8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        spin: {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        "industrial-pulse": {
          "0%, 100%": { transform: "scale(1)", opacity: "1" },
          "50%": { transform: "scale(0.85)", opacity: "0.55" },
        },
        "page-enter": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-slide-in": "fade-slide-in 900ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-slide-in-800": "fade-slide-in 900ms cubic-bezier(0.16, 1, 0.3, 1) 0.8s forwards",
        "fade-slide-in-1000": "fade-slide-in 900ms cubic-bezier(0.16, 1, 0.3, 1) 1s forwards",
        "fade-slide-in-1200": "fade-slide-in 900ms cubic-bezier(0.16, 1, 0.3, 1) 1.2s forwards",
        "fade-slide-in-1400": "fade-slide-in 900ms cubic-bezier(0.16, 1, 0.3, 1) 1.4s forwards",
        "column-reveal": "column-reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) backwards",
        "nav-load": "nav-load 700ms ease-out forwards",
        spin: "spin 4s linear infinite",
        "spin-slow": "spin 3s linear infinite",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "industrial-pulse": "industrial-pulse 1.5s ease-in-out infinite",
        "page-enter": "page-enter 0.35s ease-out",
        "fade-in": "fade-in 0.3s ease-out",
      },

      transitionTimingFunction: {
        "ds-reveal": "cubic-bezier(0.16, 1, 0.3, 1)",
        "ds-smooth": "cubic-bezier(0.25, 1, 0.5, 1)",
      },

      maxWidth: {
        container: "1400px",
        editorial: "1400px",
      },

      /* ============================================================
         SHADOWS — Editorial / soft
         ============================================================ */
      boxShadow: {
        editorial:
          "0 1px 0 0 rgba(10, 10, 10, 0.02), 0 24px 60px -28px rgba(10, 10, 10, 0.22)",
        "editorial-lg":
          "0 2px 0 0 rgba(10, 10, 10, 0.03), 0 40px 80px -24px rgba(10, 10, 10, 0.25)",
        "inner-hairline": "inset 0 0 0 1px rgba(10, 10, 10, 0.06)",
      },

      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
