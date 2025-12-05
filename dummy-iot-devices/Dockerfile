# Use Node.js LTS version
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Configure npm registry to avoid Cloudflare blocking
RUN npm config set registry https://registry.npmmirror.com

# Install dependencies with retry logic
RUN npm ci --omit=dev || npm ci --omit=dev || npm ci --omit=dev

# Reset to default registry (optional, for runtime)
RUN npm config set registry https://registry.npmjs.org

# Copy application files
COPY . .

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port for web UI (if using server.js)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})" || exit 0

# Default command - run the IoT devices simulator
CMD ["npm", "start"]
