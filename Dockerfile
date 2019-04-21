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

#RUN npm install pm2 -g

EXPOSE 8080


#CMD [ "/home/node/.npm-global/lib/node_modules/pm2/bin/pm2-runtime", "server.js" ]

CMD ["node", "server.js"]
