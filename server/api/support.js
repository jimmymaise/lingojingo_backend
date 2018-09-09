'use strict';

const Boom = require('boom');
const internals = {};

internals.applyRoutes = function (server, next) {
  const SupportService = server.plugins['support-service'];

  server.route({
    method: 'POST',
    path: '/support/ticket',
    config: {
      auth: 'firebase',
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

  return;
};

exports.register = function (server, options) {
  server.dependency(['auth', 'support-service'], internals.applyRoutes);

  return;
};

exports.name = 'support';
