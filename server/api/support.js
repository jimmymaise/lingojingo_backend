'use strict';

const Boom = require('boom');
const internals = {};
const DEFAULT_CORS = require('../utils/constants').DEFAULT_CORS

internals.applyRoutes = function (server, next) {
  const SupportService = server.plugins['support-service'];

  server.route({
    method: 'POST',
    path: '/support/ticket',
    config: {
      auth: 'firebase',
      cors: DEFAULT_CORS,
      description: 'Support Ticket Jira',
      notes: 'Create ticket for supporting user',
      tags: ['api'],
      payload: {
        output: 'file',
        parse: true,
        allow: 'multipart/form-data',
        maxBytes: 4194304
      },
    },
    handler: async (request) => {
      const data = request.payload;
      let content = JSON.parse(data.content)
      content['email'] = request.auth.credentials.email;
      let files = data.file

      try {
        const result = await SupportService.addTicket(content, files);
        if (result.ticketId) {
          return {
            success: true,
            message: 'successfully',
            data: result
          };
        } else {
          return Boom.internal('Cannot create support ticket')
        }

      } catch (err) {
        return Boom.internal(err);
      }
    }
  });

  return;
};

exports.register = function (server, options) {
  server.dependency(['support-service'], internals.applyRoutes);

  return;
};

exports.name = 'support';
