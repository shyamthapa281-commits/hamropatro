# Multi-stage Dockerfile for Hamro Patro Full-Stack Application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy application code
COPY . .

# Build Vite client and bundle Node.js Express server
RUN npm run build

# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy built artifacts and dependencies
COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

# Standard Cloud Run container port
ENV PORT=8080
EXPOSE 8080

CMD ["node", "dist/server.cjs"]
