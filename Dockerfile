FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN yarn

COPY . .

RUN yarn build

EXPOSE 4200

CMD ["yarn", "start:prod"]
