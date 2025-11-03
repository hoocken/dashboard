# From https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile
FROM node:lts-alpine AS base

# Install dep if needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
COPY my-app/package.json my-app/pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate 
RUN pnpm install

# Rebuild source code if needed
FROM base AS builder
WORKDIR /app
COPY --from=deps app/node_modules ./node_modules
COPY my-app/. .

ENV NEXT_TELEMETRY_DISABLED=1

# Build
RUN corepack enable pnpm && pnpm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder app/public ./public
COPY --from=builder --chown=nextjs:nodejs app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs app/.next/static ./.next/static

USER nextjs

EXPOSE 80

ENV PORT=80


ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]
# FROM frontend AS build
# CMD ["npm", "run", "build"]

# FROM build AS deploy
# CMD ["npm", "run", "start"]

# FROM nginx:1.23.3-alpine as nginx
# COPY nginx.conf /etc/nginx/nginx.conf
# EXPOSE 80
# EXPOSE 443

###############################################################################
# FROM python:3.9-slim-buster as backend
# WORKDIR /app
# COPY backend/package.json backend/requirements.txt ./
# RUN pip install -r requirements.txt

# COPY /backend ./

# FROM backend AS backend-dev
# EXPOSE 5050
# CMD ["python", "app.py"]




