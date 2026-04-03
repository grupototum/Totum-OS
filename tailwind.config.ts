import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      /* ============================================================
         FONTS - Inter (exatamente como no design system)
         ============================================================ */
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["SF Mono", "Monaco", "Inconsolata", "Fira Code", "monospace"],
      },
      
      /* ============================================================
         COLORS - Design System Totum v4
         ============================================================ */
      colors: {
        // Core Colors - exatas
        totum: {
          bg: "#EAEAE5",
          "bg-alt": "#E5E5E0",
        },
        
        // Stone scale exata
        stone: {
          50: "#FAFAF9",
          100: "#F5F5F4",
          200: "#E7E5E4",
          300: "#D6D3D1",
          400: "#A8A29E",
          500: "#78716C",
          600: "#57534E",
          700: "#44403C",
          800: "#292524",
          900: "#1C1917",
        },
        
        // Shadcn UI semantic colors
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
         LETTER SPACING - tracking-tighter para títulos
         ============================================================ */
      letterSpacing: {
        tighter: "-0.05em",
        tight: "-0.025em",
        normal: "0",
        wide: "0.025em",
        wider: "0.05em",
        widest: "0.1em",
      },
      
      /* ============================================================
         BORDER RADIUS
         ============================================================ */
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      
      /* ============================================================
         ANIMATIONS - cubic-bezier(0.16, 1, 0.3, 1)
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
        
        // Reveal animation (scroll triggered)
        reveal: {
          from: { 
            opacity: "0", 
            transform: "translateY(2rem)" 
          },
          to: { 
            opacity: "1", 
            transform: "translateY(0)" 
          },
        },
        
        // Text reveal (masked)
        "text-reveal": {
          from: { 
            transform: "translateY(110%)",
            opacity: "0",
          },
          to: { 
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        
        // Navigation load
        "nav-load": {
          from: { 
            opacity: "0", 
            transform: "translateY(-10px)" 
          },
          to: { 
            opacity: "1", 
            transform: "translateY(0)" 
          },
        },
        
        // Marquee
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        
        scroll: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-100%)" },
        },
        
        // Carousel Ken Burns
        "ken-burns": {
          from: { transform: "scale(1)" },
          to: { transform: "scale(1.1)" },
        },
        
        // Spin slow
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        
        // Fade in
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        
        // Pulse
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        
        // Reveal com easing exato
        reveal: "reveal 1s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "text-reveal": "text-reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "nav-load": "nav-load 0.8s ease-out forwards",
        
        // Marquee
        marquee: "marquee 30s linear infinite",
        scroll: "scroll 40s linear infinite",
        
        // Ken Burns
        "ken-burns": "ken-burns 10s ease-out forwards",
        
        // Spin
        "spin-slow": "spin-slow 20s linear infinite",
        
        // Fade
        "fade-in": "fade-in 0.2s ease-out",
        
        // Pulse
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      
      /* ============================================================
         TRANSITION TIMING FUNCTIONS
         ============================================================ */
      transitionTimingFunction: {
        "totum-reveal": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      
      /* ============================================================
         MAX WIDTH
         ============================================================ */
      maxWidth: {
        "container": "1400px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
