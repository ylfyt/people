FROM node:latest as nextBuilder

# ARG NEXT_PUBLIC_API_BASE_URL
# ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NODE_ENV production
ENV PORT 3000
EXPOSE 3000

WORKDIR /app

COPY ./next-main/package*.json .
RUN npm ci

COPY ./next-main/ .
RUN cp .env.example .env
RUN npm run build

# =============================================
FROM node:latest as beBuilder

WORKDIR /app

COPY package*.json .
RUN npm i

COPY . .
RUN npx prisma generate
RUN npm run build

# =============================================
FROM node:latest

ENV PORT 3000
WORKDIR /app

COPY package*.json .

COPY --from=nextBuilder /app/dist /app/dist-ui
COPY --from=beBuilder /app/node_modules /app/node_modules
COPY --from=beBuilder /app/dist /app/dist
COPY --from=beBuilder /app/prisma /app/prisma
COPY --from=beBuilder /app/uploads /app/uploads

CMD ["bash", "-c", "npx prisma migrate deploy && npm run start"]