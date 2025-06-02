# Use Node.js 22 Alpine for smaller image size
FROM node:22-alpine AS base

# Install dependencies stage
FROM base AS deps
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files for dependency installation
COPY package.json package-lock.json* ./
COPY apps/trivia-mcp/package.json ./apps/trivia-mcp/

# Install all dependencies (needed for build)
RUN npm ci

# Builder stage
FROM base AS builder
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code
COPY . .

# Build the trivia-mcp project using turbo
RUN npx turbo run build --filter=trivia-mcp

# Production dependencies stage
FROM base AS prod-deps
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./
COPY apps/trivia-mcp/package.json ./apps/trivia-mcp/

# Install only production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Production runtime stage
FROM base AS runner
WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 trivia

# Copy the built application and production dependencies
COPY --from=builder --chown=trivia:nodejs /app/apps/trivia-mcp/dist ./dist
COPY --from=builder --chown=trivia:nodejs /app/apps/trivia-mcp/package.json ./package.json
COPY --from=prod-deps --chown=trivia:nodejs /app/node_modules ./node_modules

# Switch to non-root user
USER trivia

# Set default PORT and expose it (Cloud Run will inject PORT env var)
ENV PORT=8080
EXPOSE $PORT

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the server
CMD ["node", "dist/server.js"] 