FROM node:lts-alpine AS frontend
RUN corepack enable && corepack prepare pnpm@latest --activate 

# Install pnpm
WORKDIR /app
COPY my-app/package.json my-app/pnpm-lock.yaml ./
RUN pnpm install

COPY my-app/public ./public
COPY my-app/src ./src
COPY my-app/eslint.config.mjs my-app/next.config.ts my-app/tsconfig.json my-app/next-env.d.ts ./

FROM frontend AS build
CMD ["npm", "run", "build"]

FROM build AS deploy
CMD ["npm", "run", "start"]

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




