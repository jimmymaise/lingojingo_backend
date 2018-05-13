'use strict';

const internals = {};

internals.applyRoutes = function (server, next) {
  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      reply({ message: 'Welcome to Wallet Master.' });
    }
  });

  server.route({
    method: 'GET',
    path: '/test',
    config: {
      auth: 'firebase'
    },
    handler: function (request, reply) {
      console.log("kkkk");
      console.log(request.auth);
      request.auth.credentials.then((data) => {
        console.log("hahaha", data);
      });
      reply('hello ');
    }
  });

  next();
};

exports.register = function (server, options, next) {
  server.dependency(['auth', 'hapi-mongo-models'], internals.applyRoutes);

  next();
};

exports.register.attributes = {
  name: 'index'
};
