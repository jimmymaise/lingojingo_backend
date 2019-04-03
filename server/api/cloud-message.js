'use strict';

const Boom = require('boom');
const checkSecurity = require('../utils/general').checkSecurity


const internals = {};

internals.applyRoutes = function (server, next) {
  const cloudMessage = require('../cloud_messages/handlers')

  server.route({
    method: 'POST',
    path: '/cloud-message/{topic}',
    config: {
      auth: 'firebase',
      description: 'send cloud-message for User',
      notes: 'send cloud-message for user ',
      tags: ['api']
    },
    handler: async (request) => {
      checkSecurity(request)
      try {
        const result = await cloudMessage.sendMessageToTopic(request.payload, request.params.topic)
        return {
          success: true,
          message: 'successfully',
          data: result
        };
      } catch (err) {
        return Boom.internal('Send Message To Topic Error !');
      }
    }
  });

  return;
};

exports.register = function (server, options) {
  server.dependency([], internals.applyRoutes);

  return;
};

exports.name = 'cloud-message';
