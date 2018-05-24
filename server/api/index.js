'use strict';

const internals = {};

internals.applyRoutes = function (server) {
  server.route({
    method: 'GET',
    path: '/',
    handler: function (request) {
      return { message: 'Welcome to Vomemo.' };
    }
  });

  return;
};

exports.register = function (server, options) {
  server.dependency(['auth', 'hapi-mongo-models'], internals.applyRoutes);

  return;
};

exports.name = 'index';
