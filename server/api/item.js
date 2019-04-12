'use strict';

const Boom = require('boom');
const internals = {};
let get = require("lodash.get");
const getClaims =require('../graphql/permission').getClaims
const DEFAULT_CORS = require('../utils/constants').DEFAULT_CORS

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

      let claims = await getClaims(request.auth.credentials)
      if (!(claims['groups'] ||[]).includes('ADMIN')) {
        return Boom.unauthorized('nly Admin Can Upload Image! !');
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
      cors: DEFAULT_CORS,

    },
    handler: async (request) => {

      let claims = await getClaims(request.auth.credentials)
      if (!(claims['groups'] ||[]).includes('ADMIN')) {
        return Boom.unauthorized('nly Admin Can Crop Image! !');
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
    path: '/{itemType}/{itemId}/favorite/{status}',
    config: {
      auth: 'firebase',
      description: 'Add favorite for item',
      notes: 'Add favorite for item',
      tags: ['api'],
      cors: DEFAULT_CORS,

    },
    handler: async (request) => {

      try {
        return await UserItemService.updateItemFavorite(request.auth.credentials.uid, request.params.itemId,
          request.params.itemType, request.params.status);
      } catch (err) {
        return Boom.internal(err);
      }
    }
  });

  server.route({
    method: 'POST',
    path: '/images/multi-crop',
    config: {
      auth: 'firebase',
      cors: DEFAULT_CORS,
      description: 'crop folder images to xxx_images',
      notes: 'crop folder images to xxx_images',
      tags: ['api'],
    },
    handler: async (request) => {

      try {
        return await ItemService.cropAllFolder();
      } catch (err) {
        return Boom.internal(err);
      }
    }
  });


  server.route({
    method: 'PUT',
    path: '/{itemType}/{itemId}/topic/{topicId}/study',
    config: {
      auth: 'firebase',
      description: 'Add topic Study',
      notes: 'Batch crop image',
      tags: ['api'],
      cors: DEFAULT_CORS,
    },
    handler: async (request) => {

      try {
        return await UserItemService.addTopicStudy(request.auth.credentials.uid, request.params.itemId,
          request.params.itemType, request.params.topicId, request.payload);
      } catch (err) {
        return Boom.internal(err);
      }
    }
  });


  return;
};

exports.register = function (server, options) {
  server.dependency(['item-service', 'user-item-service'], internals.applyRoutes);

  return;
};

exports.name = 'item';
