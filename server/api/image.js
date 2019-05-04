'use strict';

const Boom = require('boom');
const internals = {};
const DEFAULT_CORS = require('../utils/constants').DEFAULT_CORS
let request = require('request-promise');
const getImageUrl = require('../intergration/gcloud/handler').getImageUrl


const FIRE_BASE_CONFIG = require('../data/firebase_config')
const PROJECT_ID = FIRE_BASE_CONFIG.service[process.env.NODE_ENV].project_id;
const AppSpotHost = PROJECT_ID + ".appspot.com"
internals.applyRoutes = function (server, next) {
  server.route({
    method: "GET",
    path: "/files/{path*}",
    config: {
      // auth: 'firebase',
      cors: DEFAULT_CORS,

    },
    handler: {
      proxy: {
        mapUri: async function (req) {
          let uri
          let imageData = req.params.path.split('=')
          let imagePath = imageData[0]
          if (imageData.length > 1) {
            let imageParam = imageData[1]

            uri = await request.get(`https://${AppSpotHost}/image-url?bucket=${AppSpotHost}&image=${imagePath}`)
            uri = uri + '=' + imageParam
          } else {
            uri = await getImageUrl(imagePath)
          }
          return {
            uri
          }

        }
      }
    }
  });

  return;
};

exports.register = function (server, options) {
  server.dependency(['support-service'], internals.applyRoutes);

  return;
};

exports.name = 'image';
