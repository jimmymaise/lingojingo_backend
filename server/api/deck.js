'use strict';

const Boom = require('boom');
const Joi = require('joi');
const Async = require('async');

const internals = {};

internals.applyRoutes = function (server, next) {
  const DeckService = server.plugins['deck-service'];

  server.route({
    method: 'POST',
    path: '/deck/buy/{id}',
    config: {
      auth: 'firebase',
      description: 'Buy deck for User',
      notes: 'Buy deck for User when payment complete',
      tags: ['api']
    },
    handler: async (request) => {

      try {
        const result = await DeckService.buyDeck(request.auth.credentials.uid, request.params.id);
        return {
          success: true,
          message: 'successfully',
          data: {
            decks: result.decks
          }
        };
      } catch (err) {
        return Boom.internal('Buy Deck error!');
      }
    }
  });

  return;
};

exports.register = function (server, options) {
  server.dependency(['deck-service'], internals.applyRoutes);

  return;
};

exports.name = 'deck';
