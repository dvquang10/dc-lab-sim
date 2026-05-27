# syntax=docker/dockerfile:1.7

# ---- Builder stage: install deps and produce the Vite static bundle ----
FROM node:20-alpine AS builder

WORKDIR /app

# Copy lockfiles first so npm install can be cached when source changes
# but dependencies do not.
COPY package.json package-lock.json* ./

# Use `npm ci` when a lockfile is present (deterministic, faster);
# fall back to `npm install` otherwise. Skip husky's prepare hook —
# git hooks aren't useful inside the container.
RUN if [ -f package-lock.json ]; then \
      npm ci --no-audit --no-fund --ignore-scripts; \
    else \
      npm install --no-audit --no-fund --ignore-scripts; \
    fi

# Copy the rest of the source and build (tsc + vite build).
COPY . .
RUN npm run build


# ---- Runtime stage: serve the static bundle with nginx ----
FROM nginx:1.27-alpine AS runtime

# Drop the default site so our config is the only one in play.
RUN rm /etc/nginx/conf.d/default.conf

# SPA-friendly nginx config: gzip + try_files fallback to index.html.
COPY docker/nginx.conf /etc/nginx/conf.d/app.conf

# Copy the built static assets from the builder.
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

# Basic healthcheck — fails if nginx can't serve index.html.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
