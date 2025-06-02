# Use Node.js 22 Alpine for smaller image size
FROM node:22-alpine AS base

# Install turbo globally 
FROM base AS builder
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app
RUN npm install -g turbo@^2
COPY . .

# Generate a partial monorepo with a pruned lockfile for trivia-mcp
RUN turbo prune trivia-mcp --docker

# Install dependencies stage
FROM base AS installer
RUN apk update && apk add --no-cache libc6-compat
WORKDIR /app

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN npm ci

# Build the project
COPY --from=builder /app/out/full/ .
RUN npx turbo run build --filter=trivia-mcp

# Create production dependencies
FROM base AS deps
WORKDIR /app
COPY --from=builder /app/out/json/ .
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
COPY --from=installer --chown=trivia:nodejs /app/apps/trivia-mcp/dist ./dist
COPY --from=installer --chown=trivia:nodejs /app/apps/trivia-mcp/package.json ./package.json
COPY --from=deps --chown=trivia:nodejs /app/node_modules ./node_modules

# Switch to non-root user
USER trivia

# Set default PORT and expose it (Cloud Run will inject PORT env var)
ENV PORT=8080
EXPOSE $PORT

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the server
CMD ["node", "dist/server.js"] 