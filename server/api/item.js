'use strict';

const Boom = require('boom');
const internals = {};
let get = require("lodash.get");

internals.applyRoutes = function (server, next) {
  const ItemService = server.plugins['item-service'];
  const UserItemService = server.plugins['user-item-service'];


  server.route({
    method: 'PUT',
    path: '/images/batch-update',
    config: {
      auth: 'firebase',
      description: 'Batch update image for item',
      notes: 'Batch update image',
      tags: ['api'],
    },
    handler: async (request) => {

      if (!(get(request, 'auth.credentials.claims.groups', [])).includes('ADMIN')) {
        return Boom.unauthorized('Only Admin Can Upload Image!');
      }

      try {
        return await ItemService.batchUpdateImage(request.payload);

      } catch (err) {
        return Boom.internal(err);
      }
    }
  });


  server.route({
    method: 'PUT',
    path: '/images/batch-crop',
    config: {
      auth: 'firebase',
      description: 'Batch crop image for item',
      notes: 'Batch crop image',
      tags: ['api'],
    },
    handler: async (request) => {

      if (!(get(request, 'auth.credentials.claims.groups', [])).includes('ADMIN')) {
        return Boom.unauthorized('Only Admin Can Crop Image!');
      }

      try {
        return await ItemService.batchCropImage(request.payload);
      } catch (err) {
        return Boom.internal(err);
      }
    }
  });
  server.route({
    method: 'PUT',
    path: '/user-item/{id}/favorite/{status}',
    config: {
      auth: 'firebase',
      description: 'Add favorite for item',
      notes: 'Add favorite for item',
      tags: ['api'],
    },
    handler: async (request) => {

      try {
        return await UserItemService.updateItemFavorite(request.auth.credentials.uid, request.params.id, request.params.status);
      } catch (err) {
        return Boom.internal(err);
      }
    }
  });

  server.route({
    method: 'PUT',
    path: '/user-item/{id}/topic/{topicId}/study',
    config: {
      auth: 'firebase',
      description: 'Add topic Study',
      notes: 'Batch crop image',
      tags: ['api'],
    },
    handler: async (request) => {

      try {
        return await UserItemService.addTopicStudy(request.auth.credentials.uid, request.params.id, request.params.topicId, request.payload);
      } catch (err) {
        return Boom.internal(err);
      }
    }
  });


  return;
};

exports.register = function (server, options) {
  server.dependency(['item-service','user-item-service'], internals.applyRoutes);

  return;
};

exports.name = 'item';
