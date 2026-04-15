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
          // Vendor bundles - React core
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react';
            }
            if (id.includes('framer-motion')) {
              return 'vendor-motion';
            }
            if (id.includes('supabase')) {
              return 'vendor-supabase';
            }
            if (id.includes('@radix-ui') || id.includes('recharts')) {
              return 'vendor-ui';
            }
            return 'vendor-other';
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
