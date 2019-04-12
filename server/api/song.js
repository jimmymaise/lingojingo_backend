'use strict';

const Boom = require('boom');
const DEFAULT_CORS = require('../utils/constants').DEFAULT_CORS


const internals = {};

internals.applyRoutes = function (server, next) {
  const SongService = server.plugins['song-service'];

  server.route({
    method: 'POST',
    path: '/song/buy/{id}',
    config: {
      auth: 'firebase',
      description: 'Buy song for User',
      notes: 'Buy song for User when payment complete',
      tags: ['api'],
      cors: DEFAULT_CORS,

    },
    handler: async (request) => {

      try {
        const result = await SongService.buySong(request.auth.credentials.uid, request.params.id);
        return {
          success: true,
          message: 'successfully',
          data: {
            songs: result.songs
          }
        };
      } catch (err) {
        return Boom.internal('Buy Song error!');
      }
    }
  });

  return;
};

exports.register = function (server, options) {
  server.dependency(['song-service'], internals.applyRoutes);

  return;
};

exports.name = 'song';
