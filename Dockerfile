# Dockerfile - Totum App
FROM node:20-alpine

WORKDIR /app

# Copiar package.json
COPY package*.json ./
COPY api/package*.json ./api/

# Instalar dependências
RUN npm ci --only=production
RUN cd api && npm ci --only=production

# Copiar código
COPY . .

# Build do frontend
RUN npm run build

# Expor porta
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3001/api/health || exit 1

# Comando de start
CMD ["node", "api/server.js"]
