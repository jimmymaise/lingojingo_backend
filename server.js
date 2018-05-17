'use strict';

const composer = require('./index');
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
