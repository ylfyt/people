FROM node:latest as builder

WORKDIR /app

COPY package*.json .
RUN npm i

COPY . .
RUN npx prisma generate
RUN npm run build

CMD ["npm", "run", "start"]