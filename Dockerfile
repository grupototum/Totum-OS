# Dockerfile - Totum App
FROM node:20-alpine

WORKDIR /app

# Instalar curl para healthcheck
RUN apk add --no-cache curl

# Copiar package.json
COPY package*.json ./
COPY api/package*.json ./api/

# Instalar TODAS as dependências (incluindo devDependencies para build)
RUN npm ci
RUN cd api && npm ci

# Copiar código
COPY . .

# Build do frontend
RUN npm run build

# Expor porta
EXPOSE 3002
ENV PORT=3002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3002/api/health || exit 1

# Comando de start
CMD ["node", "api/server.js"]
