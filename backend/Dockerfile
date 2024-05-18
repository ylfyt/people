FROM node:latest as builder
ENV PORT=3000
WORKDIR /app

COPY package*.json .
RUN npm i

COPY . .
RUN npx prisma generate
RUN npm run build

CMD ["bash", "-c", "npx prisma migrate deploy && npm run start"]