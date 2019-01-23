FROM node:latest

USER node

RUN mkdir -p /home/node/app
RUN mkdir ~/.npm-global
RUN npm config set prefix '~/.npm-global'
RUN echo "export PATH=~/.npm-global/bin:$PATH" >> ~/.profile



WORKDIR /home/node/app

COPY package*.json ./

# Bundle app source

COPY . .

RUN npm install

RUN npm install pm2 -g

EXPOSE 8080

CMD [ "pm2-runtime", "node", "server.js" ]

#CMD ["node", "server.js"]