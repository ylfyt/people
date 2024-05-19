FROM node:lts-alpine as nextBuilder

# ARG NEXT_PUBLIC_API_BASE_URL
# ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV PORT 3000
EXPOSE 3000

WORKDIR /app

COPY ./next-main/package*.json ./
RUN npm ci

COPY ./next-main/ .
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

ENV PORT 3000
ENV JWT_SECRET_KEY daksndksndknsakdsandksanduqwnekasdnkasn
ENV ENV_MODE PROD
ENV NODE_ENV production
WORKDIR /app

COPY package*.json ./

COPY --from=nextBuilder /app/dist /app/dist-ui
COPY --from=beBuilder /app/node_modules /app/node_modules
COPY --from=beBuilder /app/dist /app/dist
COPY --from=beBuilder /app/prisma /app/prisma
COPY --from=beBuilder /app/uploads /app/uploads

CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]