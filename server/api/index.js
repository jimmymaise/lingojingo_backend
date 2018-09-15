'use strict';

const internals = {};

internals.applyRoutes = function (server) {
  server.route({
    method: 'GET',
    path: '/',
    handler: function (request) {
      return {message: 'Welcome to Vomemo.'};
    }
  });

  server.route({
    method: 'GET',
    path: '/syncES',
    handler: async function (request) {
      const Deck = require('../models/deck');
      await Deck.syncDataES({},true)
      const UserTopic = require('../models/user-topic');
      await UserTopic.syncDataES()
    }
  });

  return;
};

exports.register = function (server, options) {
  server.dependency(['auth', 'hapi-mongo-models'], internals.applyRoutes);

  return;
};

exports.name = 'index';
