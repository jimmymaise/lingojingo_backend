'use strict';

const Boom = require('boom');
const internals = {};
let get = require("lodash.get");

internals.applyRoutes = function (server, next) {
  const UploadService = server.plugins['upload-file-service'];

  server.route({
    method: 'POST',
    path: '/images/upload',
    config: {
      auth: 'firebase',
      description: 'Upload image to firebase',
      notes: 'Upload image to firebase',
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

      if (!(get(request, 'auth.credentials.claims.groups', [])).includes('ADMIN')) {
        return Boom.unauthorized('Only Admin Can Upload Image!');
      }
      let content = {}
      // let content = JSON.parse(data.content)
      // content['email'] = request.auth.credentials.email;
      let files = data.file

      try {
        return result = await UploadService.uploadFile(content, files, "/images");

      } catch (err) {
        return Boom.internal(err);
      }
    }
  });

  return;
};

exports.register = function (server, options) {
  server.dependency(['upload-file-service'], internals.applyRoutes);

  return;
};

exports.name = 'upload-file';
