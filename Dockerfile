FROM node:lts-alpine as mainBuilder

WORKDIR /app

COPY ./next-main/package*.json ./
RUN npm ci

COPY ./next-main/ .
RUN cp .env.example .env
RUN npm run build

# =============================================
FROM node:lts-alpine as adminBuilder

ENV ADMIN_BASE_PATH /admin

WORKDIR /app

COPY ./next-admin/package*.json ./
RUN npm ci

COPY ./next-admin/ .
RUN cp .env.example .env
RUN npm run build

# =============================================
FROM node:lts-alpine as beBuilder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate
RUN npm run build

# =============================================
FROM node:lts-alpine

RUN apk add --no-cache tzdata
ENV TZ Asia/Jakarta

ENV ADMIN_BASE_PATH /admin
ENV PORT 3000
ENV JWT_SECRET_KEY daksndksndknsakdsandksanduqwnekasdnkasn
ENV ENV_MODE PROD
ENV NODE_ENV production
WORKDIR /app

COPY package*.json ./

COPY --from=mainBuilder /app/dist /app/dist-ui
COPY --from=adminBuilder /app/dist /app/dist-admin

COPY --from=beBuilder /app/node_modules /app/node_modules
COPY --from=beBuilder /app/dist /app/dist
COPY --from=beBuilder /app/prisma /app/prisma
COPY --from=beBuilder /app/uploads /app/uploads

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]