'use strict';

const composer = require('./index');

const startServer = async () => {
  try {
    const server = await composer();
    await server.start();
    console.log('hapi days!');
  }
  catch (err) {
    console.error(err);
    process.exit(1);
  }
};

startServer();
