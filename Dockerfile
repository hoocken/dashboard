FROM node:lts-alpine AS frontend
RUN corepack enable && corepack prepare pnpm@latest --activate 
# Install pnpm

WORKDIR /app
COPY my-app/package.json my-app/pnpm-lock.yaml ./
RUN pnpm install

COPY my-app/public ./public
COPY my-app/src ./src
COPY my-app/eslint.config.mjs my-app/next.config.ts my-app/tsconfig.json my-app/next-env.d.ts ./

FROM frontend AS frontend-dev
EXPOSE 3000
CMD ["npm", "run", "frontend"]

###############################################################################
FROM python:3.9-slim-buster as backend
WORKDIR /app
COPY backend/package.json backend/requirements.txt ./
RUN pip install -r requirements.txt

COPY /backend ./

FROM backend AS backend-dev
EXPOSE 5050
CMD ["python", "app.py"]




