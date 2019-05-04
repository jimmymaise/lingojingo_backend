'use strict';

const Boom = require('boom');
const internals = {};
const DEFAULT_CORS = require('../utils/constants').DEFAULT_CORS
const gcloudHandler = require('../intergration/gcloud/handler')

const FIRE_BASE_CONFIG = require('../../data/firebase_config')
const KEY_FILE = FIRE_BASE_CONFIG.service[process.env.NODE_ENV]
const CACHE_CONTROL = require('../../utils/constants').CACHE_CONTROL
const {Storage} = require('@google-cloud/storage');
const logger = require('../../utils/logger.js').logger

const PROJECT_ID = KEY_FILE.project_id;
const AppSpotHost = PROJECT_ID + ".appspot.com"
internals.applyRoutes = function (server, next) {
  server.route({
    method: "GET",
    path: "/files/{filePath}",
    config: {
      auth: 'firebase',
      cors: DEFAULT_CORS,

    },
    handler: {
      proxy: {
        mapUri: function (req) {
          let headers = {}
          headers['user-agent'] = req.headers['user-agent']
          return {
            'uri': `https://${AppSpotHost}/image-url?bucket=${AppSpotHost}&image=${req.params.filePath}`,}

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

exports.name = 'support';
