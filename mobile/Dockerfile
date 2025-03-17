FROM node:latest

RUN npm install -g exp-cli

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8081

CMD ["npx", "expo", "start"]