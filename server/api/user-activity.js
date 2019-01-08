'use strict';

const Boom = require('boom');
const Joi = require('joi');
const Async = require('async');

const internals = {};

internals.applyRoutes = function (server, next) {
  const UserActivityService = server.plugins['user-activity-service'];


  // POST: new wallet category
  server.route({
    method: 'POST',
    path: '/activity',
    config: {
      auth: 'firebase',
      description: 'Add user activity',
      notes: 'Add user activity',
      tags: ['api'],
      validate: {
        payload: {
          event: Joi.string().required(),
          data: Joi.string().optional().allow(null).allow(''),
          itemName: Joi.string().optional().allow(null).allow(''),
          itemId: Joi.string().optional().allow(null).allow(''),
        }
      }
    },
    handler: async (request) => {
      let data = request.payload;
      data.userId = request.auth.credentials.user_id
      data.device = request.headers['user-agent']

      try {
        const result = await UserActivityService.addUserLogActivity(data);

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
    path: '/activity',
    config: {
      description: 'Get user activity',
      notes: 'Get user activity',
      tags: ['api'],
      auth: 'firebase',
      cors: {
        additionalExposedHeaders: ['Date']
      }
    },
    handler: async (request) => {
      try {

        const params = request.query
        let userId = request.auth.credentials.user_id
        let dateTimeStart = params['start']
        let dateTimeEnd = params['end']
        let limit = params['limit']

        return await UserActivityService.getUserLogActivity(userId, dateTimeStart, dateTimeEnd, limit);
      } catch (err) {
        return Boom.internal('Get user activity error', err);
      }
    }
  });

  return;
};


exports.register = function (server, options) {
  server.dependency(['user-activity-service'], internals.applyRoutes);

  return;
};

exports.name = 'user-activity';
