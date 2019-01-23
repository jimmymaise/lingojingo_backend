FROM node:latest

USER node

RUN mkdir -p /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

# Bundle app source

COPY . .

RUN npm install

RUN npm install pm2 -g

EXPOSE 8080

CMD [ "pm2-runtime", "node", "server.js" ]

#CMD ["node", "server.js"]