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
          phone: Joi.string().optional(),
          aboutContent: Joi.string(),
          isLearnMailNotify: Joi.boolean(),
          isNewBlogMailNotify: Joi.boolean(),
          isGeneralMailNotify: Joi.boolean()
        }
      }
    },
    handler: async (request) => {
      const data = request.payload;
      data.email = request.auth.credentials.email;
      try {
        const result = await UserInfoService.createOrUpdateForClient(request.auth.credentials.uid, data);
        return {
          success: true,
          message: 'successfully',
          data: result
        };
      } catch (err) {
        return Boom.internal('Update User Data error!');
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
      auth: 'firebase'
    },
    handler: async (request) => {
      try {
        const result = await UserInfoService.getOneForClient(request.auth.credentials.uid);
        return result;
      } catch (err) {
        return Boom.internal('Get user info error', err);
      }
    }
  });

  return;
};

exports.register = function (server, options) {
  server.dependency(['auth', 'user-info-service'], internals.applyRoutes);

  return;
};

exports.name = 'user-info';
