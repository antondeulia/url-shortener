FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN pnpm run build

EXPOSE 4200

CMD ["pnpm", "run", "start:prod"]
