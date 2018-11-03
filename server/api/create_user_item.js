'use strict';

const Boom = require('boom');
const Joi = require('joi');
const Async = require('async');

const internals = {};

internals.applyRoutes = function (server, next) {
  const UserItemService = server.plugins['user-item-service'];

  server.route({
    method: 'POST',
    path: '/user-item/{itemType}/{itemId}',
    config: {
      auth: 'firebase',
      description: 'Create User-Item for User',
      notes: 'Create User-Item for User when user want to start study item',
      tags: ['api']
    },
    handler: async (request) => {

      try {

        const result = await UserItemService.createMyUserItem(request.auth.credentials.uid, request.params.itemId, request.params.itemType);
        return {
          success: true,
          message: 'successfully',
          data: result
        };
      } catch (err) {
        return Boom.internal('Create User Item error!');
      }
    }
  });

  return;
};

exports.register = function (server, options) {
  server.dependency(['user-item-service'], internals.applyRoutes);

  return;
};


exports.name = 'user-item';
