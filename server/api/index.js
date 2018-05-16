'use strict';

const internals = {};

internals.applyRoutes = function (server) {
  server.route({
    method: 'GET',
    path: '/',
    handler: function (request) {
      return { message: 'Welcome to Wallet Master.' };
    }
  });

  server.route({
    method: 'GET',
    path: '/test',
    config: {
      auth: 'firebase'
    },
    handler: function (request) {
      console.log("kkkk");
      console.log(request.auth);
      request.auth.credentials.then((data) => {
        console.log("hahaha", data);
      });
      return 'hello ';
    }
  });

  return;
};

exports.register = function (server, options) {
  server.dependency(['auth', 'hapi-mongo-models'], internals.applyRoutes);

  return;
};

exports.name = 'index';
