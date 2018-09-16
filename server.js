'use strict';

const composer = require('./index');
let Raven = require('raven');
Raven.config('https://d8c9d908c23144068f61a4152a7593ef@sentry.io/1281759').install();

const Config = require('./config');

const startServer = async () => {
  try {
    const server = await composer();

    await server.start();

    console.log(`${Config.get('/projectName')}`);
    console.log(`Server running at: ${server.info.uri}`);


  }
  catch (err) {
    console.error(err);
    process.exit(1);
  }
};

startServer();
