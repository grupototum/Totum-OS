import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // React core (verificação estrita para não pegar @radix-ui/react-* etc)
            if (
              id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/react-router')
            ) {
              return 'vendor-react';
            }
            if (id.includes('node_modules/framer-motion')) {
              return 'vendor-motion';
            }
            if (id.includes('node_modules/@supabase')) {
              return 'vendor-supabase';
            }
            if (
              id.includes('node_modules/@radix-ui') ||
              id.includes('node_modules/recharts') ||
              id.includes('node_modules/lucide-react') ||
              id.includes('node_modules/class-variance-authority') ||
              id.includes('node_modules/clsx') ||
              id.includes('node_modules/tailwind-merge')
            ) {
              return 'vendor-ui';
            }
            // Demais libs ficam com o gerenciamento automático do Rollup
            // (evita chunks circulares causados por catch-all genérico)
            return;
          }

          // Page-based chunks for lazy loading
          if (id.includes('/pages/docs/')) {
            return 'page-docs';
          }
          if (id.includes('/pages/agents/')) {
            return 'page-agents';
          }
          if (id.includes('/pages/ClientsCenter/') || id.includes('/pages/EditClient/')) {
            return 'page-clients';
          }
          if (id.includes('/pages/alexandria/')) {
            return 'page-alexandria';
          }
          if (id.includes('/pages/Dashboard')) {
            return 'page-dashboard';
          }

          // Component chunks
          if (id.includes('/components/')) {
            return 'components';
          }
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
    chunkSizeWarningLimit: 600,
    sourcemap: false,
  },
}));
