'use strict';
const internals = {};

exports.register = async function (server, options) {

  server.dependency('hapi-mongo-models', await internals.applyStrategy);

  return;
};

exports.name = 'auth';

