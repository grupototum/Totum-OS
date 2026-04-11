# Dockerfile - Totum App
FROM node:20-alpine

WORKDIR /app

# Instalar curl para healthcheck
RUN apk add --no-cache curl

# Argumentos de build para variáveis de ambiente do frontend
ARG VITE_SUPABASE_URL=https://cgpkfhrqprqptvehatad.supabase.co
ARG VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNncGtmaHJxcHJxcHR2ZWhhdGFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyMjQyNjIsImV4cCI6MjA5MDgwMDI2Mn0.fXMvQhyLQXLgD_rK-slcHO4Jd_XF8mR_kYFTDHCsoxw

# Variáveis de ambiente para o build
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY

# Copiar package.json
COPY package*.json ./
COPY api/package*.json ./api/

# Instalar TODAS as dependências (incluindo devDependencies para build)
RUN npm ci
RUN cd api && npm ci

# Copiar código (incluindo .env)
COPY . .

# Build do frontend (agora com variáveis de ambiente disponíveis)
RUN npm run build

# Expor porta
EXPOSE 3002
ENV PORT=3002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3002/api/health || exit 1

# Comando de start
CMD ["node", "api/server.js"]
