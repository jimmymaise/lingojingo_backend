FROM node:latest

USER node

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

# Bundle app source

COPY . .

RUN npm install

EXPOSE 8080

CMD ["node", "server.js"]