'use strict';

const Boom = require('boom');
const DEFAULT_CORS = require('../utils/constants').DEFAULT_CORS


const internals = {};

internals.applyRoutes = function (server, next) {

  server.route({
    method: 'POST',
    path: '/global-notification',
    config: {
      auth: 'firebase',
      cors: DEFAULT_CORS,
      description: 'Websocket send notification to global',
      notes: 'Websocket',
      tags: ['web-socket'],
      plugins: {
        'hapi-io': {
          event: 'create-user'
        }
      }
    },
    handler: async (request) => {
      console.log('Hlloe', request.payload)
      try {
        const socket = request.plugins['hapi-io'].socket;
        socket.broadcast.emit('create-user', 'hello');

        return {
          success: true,
          message: 'successfully',
        };
      } catch (err) {
        console.log('err', err)
        return Boom.internal('error!');
      }
    }
  });

  return;
};

exports.register = function (server, options) {
  server.dependency([], internals.applyRoutes);

  return;
};

exports.name = 'global-notification';
