import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: false, // usamos public/manifest.json
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*$/,
            handler: "NetworkFirst",
            options: {
              cacheName: "supabase-api",
              expiration: { maxEntries: 100, maxAgeSeconds: 86400 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*$/,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts",
              expiration: { maxEntries: 10, maxAgeSeconds: 31536000 },
            },
          },
        ],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
  },
  optimizeDeps: {
    entries: ["index.html", "src/**/*.{ts,tsx}"],
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
            // Charts — recharts + d3 deps (100KB+ gzip)
            if (
              id.includes('node_modules/recharts') ||
              id.includes('node_modules/d3-') ||
              id.includes('node_modules/victory-') ||
              id.includes('node_modules/d3/') ||
              id.includes('node_modules/internmap') ||
              id.includes('node_modules/robust-predicates')
            ) {
              return 'vendor-charts';
            }
            // Icons — lucide-react (tree-shaken but still chunked separately)
            if (id.includes('node_modules/lucide-react')) {
              return 'vendor-icons';
            }
            // UI primitives — Radix + styling utils
            if (
              id.includes('node_modules/@radix-ui') ||
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

          // Componentes ficam no chunk da página que os importa
          // (evita circularidade com vendor chunks)
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
    chunkSizeWarningLimit: 800,
    sourcemap: false,
  },
}));
