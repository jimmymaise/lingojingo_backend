'use strict';

const Boom = require('boom');
const Joi = require('joi');
const Async = require('async');

const internals = {};

internals.applyRoutes = function (server, next) {
  const UserInfoService = server.plugins['user-info-service'];

  // POST: new wallet category
  server.route({
    method: 'POST',
    path: '/me',
    config: {
      auth: 'firebase',
      description: 'Update current user info data',
      notes: 'Update and return newest data',
      tags: ['api'],
      validate: {
        payload: {
          avatarUrl: Joi.string().optional().allow(null),
          fullName: Joi.string().optional().allow(null),
          phone: Joi.string().optional().allow(null).allow(''),
          aboutContent: Joi.string().optional().allow(null).allow(''),
          isLearnMailNotify: Joi.boolean().optional().allow(null),
          isNewBlogMailNotify: Joi.boolean().optional().allow(null),
          isGeneralMailNotify: Joi.boolean().optional().allow(null)
        }
      }
    },
    handler: async (request) => {
      const data = request.payload;
      data.email = request.auth.credentials.email;
      let setClaimToFireBase = require('../utils/general').setClaimToFireBase
      await setClaimToFireBase(request.auth.credentials.user_id)

      try {
        const result = await UserInfoService.createOrUpdateForClient(request.auth.credentials.uid, data);
        return {
          success: true,
          message: 'successfully',
          data: result
        };
      } catch (err) {
        return Boom.internal(err);
      }
    }
  });

  // GET all category
  server.route({
    method: 'GET',
    path: '/me',
    config: {
      description: 'Get current user info',
      notes: 'Returns current user info',
      tags: ['api'],
      auth: 'firebase',
      cors: {
        additionalExposedHeaders: ['Date']
      }
    },
    handler: async (request) => {
      try {
        let setClaimToFireBase = require('../utils/general').setClaimToFireBase
        await setClaimToFireBase(request.auth.credentials.user_id)
        const result = await UserInfoService.getOneForClient(request);

        if (result.avatarUrl && result.avatarUrl.indexOf('facebook') >= 0
          && result.avatarUrl.indexOf('type=large') < 0) {
            result.avatarUrl += '?type=large';
        }

        return result;
      } catch (err) {
        return Boom.internal('Get user info error', err);
      }
    }
  });

  return;
};

exports.register = function (server, options) {
  server.dependency(['user-info-service'], internals.applyRoutes);

  return;
};

exports.name = 'user-info';
