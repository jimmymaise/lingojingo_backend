FROM node:boron
# Create a new user to our new container and avoid the root user
RUN useradd --user-group --create-home --shell /bin/false nupp && \
    apt-get clean

# RUN apt-get update && apt-get install -y nginx

# RUN rm /etc/nginx/sites-enabled/default
# COPY ./nginx.conf /etc/nginx/sites-available/
# RUN ln -s /etc/nginx/sites-available/nginx.conf /etc/nginx/sites-enabled/nginx.conf

ENV HOME=/home/nupp
COPY package.json $HOME/app/
COPY . $HOME/app
RUN chown -R nupp:nupp $HOME/* /usr/local/
WORKDIR $HOME/app
RUN npm cache clean && \
    npm install --silent --progress=false --production
RUN chown -R nupp:nupp $HOME/*
USER nupp
EXPOSE 3800

ENV NODE_ENV "production"

CMD ["npm", "start"]