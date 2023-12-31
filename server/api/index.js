'use strict';

const internals = {};
const _ = require('lodash')
const getLocation = require('../utils/general').getLocation
const Boom = require('boom');
const Wreck = require('@hapi/wreck');
const envAuth = process.env.NODE_ENV === 'production' ? 'firebase' : null
let esAddr = (process.env.ES_URL) ? process.env.ES_URL : `https://staging-sts.lingojingo.com/proxyES`
const DEFAULT_CORS = require('../utils/constants').DEFAULT_CORS
let makeRequest = require('request-promise');

let proxyList = require('../utils/constants').PROXY_LIST
let usedProxies = []
let usingProxy
let notUsedProxies
const logger = require('../utils/logger.js').logger

internals.applyRoutes = function (server) {
  server.route({
    method: 'GET',
    path: '/',
    config: {
      cors: DEFAULT_CORS,
    },
    handler: function (request) {
      return {
        message: 'Welcome to LingoJingo.',
        serverTime: Date.now()
      };
    }
  });

  server.route({
    method: 'GET',
    path: '/healthz',

    config: {
      cors: DEFAULT_CORS,
    }, handler: function (request) {
      return {
        message: 'Welcome to LingoJingo.',
        serverTime: Date.now(),
        healthCheck: {
          api: "OK",
          db: "Not Implemented",
          es: "Not Implemented",
          redis: "Not Implemented",

        }
      };
    }
  });


  server.route({
    method: '*',
    path: '/proxyES/{p*}',
    config: {
      auth: envAuth,
      cors: DEFAULT_CORS,

    },

    handler: {
      proxy: {
        mapUri: function (request) {
          return {
            uri: `${esAddr}/${request.params.p}`
          };
        },
        onResponse: function (err, res, request, h, settings, ttl) {

          return Wreck.read(res, {json: true}, function (err, payload) {

            let response = h.response(payload);
            response.headers = res.headers;
            return response;
          });
        }
      }
    }
  });


  server.route({
    method: 'GET',
    path: '/version/{type}',
    config: {
      cors: DEFAULT_CORS,
    },
    handler: async function (request) {
      const Version = require('../models/version');
      return global[request.params.type] || await Version.findOne({type: request.params.type})

    }
  });

  server.route({
    method: 'POST',
    path: '/version/{type}/{id}',
    handler: async function (request) {
      const Version = require('../models/version');
      const gitlab = require('../intergration/gitlab/handler');
      let res = await gitlab.getTagDetail(request.params.type, request.params.id)

      global[request.params.type] = await Version.findOneAndUpdate({
          type: request.params.type,
        }, {
          $set: res
        },
        {
          upsert: true

        });
      return {message: 'updated version successfully.'};
    }
  });

  server.route({
    method: 'GET',
    path: '/firebase/token',
    handler: async function (request,h) {
      let params = request.query
      let options = {
        method: 'POST',
        json: true,
        simple: false,
        resolveWithFullResponse: true,
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        url: `https://securetoken.googleapis.com/v1/token?key=${params.key}`,
        body: `grant_type=${params.grant_type}&refresh_token=${params.refresh_token}`
      };
      let result = await makeRequest(options)
      return h.response(result.body).code(result.statusCode)



    }
  });


  server.route({
    method: 'POST',
    path: '/translate',
    config: {
      // auth: 'firebase',
      cors: DEFAULT_CORS,
    },
    handler: async function (request) {
      const translateText = require('../intergration/gtranslate/handler').translateText;
      const data = request.payload;
      try {
        return await translateText(data.text, data.from, data.to)
      } catch (e) {
        return Boom.serverUnavailable('Service Unavailable from google side');
      }

    }
  });


  server.route({
    method: 'GET',
    path: '/syncES/{p*}',
    config: {
      auth: 'firebase',
      cors: DEFAULT_CORS,
    },
    handler: async function (request) {
      const Deck = require('../models/deck');
      const Song = require('../models/song');
      const Article = require('../models/article');
      const UserItem = require('../models/user-item');
      const GrammarUnit = require('../models/grammar-unit');

      const getClaims = require('../graphql/permission').getClaims
      let claims = await getClaims(request.auth.credentials)
      if (!(claims['groups'] || []).includes('ADMIN')) {
        return Boom.unauthorized('Only Admin Can Sync ES !');
      }

      try {

        let process = false
        if (request.params.p === 'deck' || request.params.p === 'all') {
          process = true
          Deck.syncDataES({}, true)
        }
        if (request.params.p === 'user-item' || request.params.p === 'all') {
          process = true
          UserItem.syncDataES({}, true)
        }
        if (request.params.p === 'article' || request.params.p === 'all') {
          process = true
          Article.syncDataES({}, true)
        }
        if (request.params.p === 'song' || request.params.p === 'all') {
          process = true
          Song.syncDataES({}, true)
        }
        if (request.params.p === 'user-topic' || request.params.p === 'all') {
          process = true
          UserTopic.syncDataES({}, true)
        }
        if (request.params.p === 'grammar-unit' || request.params.p === 'all') {
          process = true
          GrammarUnit.syncDataES({}, true)
        }
        if (process) {
          return {
            "message": "Sync ES process starting"
          }
        }
        return Boom.badData('Invalid type !');

      } catch (e) {
        return {e}

      }

    }
  });

  server.route({
    method: "GET",
    path: "/proxy/{p*}",
    handler: {
      proxy: {
        rejectUnauthorized: false,
        mapUri: function (req) {


          let headers = {}
          headers['host'] = getLocation(req.params.p).hostname
          headers['accept-language'] = req.headers['accept-language']
          headers['user-agent'] = req.headers['user-agent']

          return {'uri': req.url.path.split('/proxy/')[1], 'headers': headers}

        }
      }
    }
  });


  server.route({
    method: "GET",
    path: "/rotate-proxy/{p*}",
    handler: {
      proxy: {
        rejectUnauthorized: false,
        mapUri: function (req) {


          let headers = {}
          headers['x-requested-with'] = 'https://app.lingojingo.com'
          headers['origin'] = req.headers['origin'] || 'https://app.lingojingo.com'
          headers['accept-language'] = req.headers['accept-language'] || '*'
          headers['user-agent'] = req.headers['user-agent']


          notUsedProxies = _.filter(proxyList, function (o) {
            return !usedProxies.includes(o);
          });
          usingProxy = _.sample(notUsedProxies)
          return {'uri': usingProxy + req.url.path.split('/rotate-proxy/')[1], 'headers': headers}
        },
        onResponse: function (err, res, request, h, settings, ttl) {

          console.log('receiving the response from the upstream.');
          if (!res || res.statusCode !== 200) {
            if (usedProxies.length < proxyList.length - 1) {
              logger.error("Error when using proxy " + usingProxy + "with status code " + _.get(res, 'statusCode') + err)
              console.error("Error when using proxy " + usingProxy + "with status code " + _.get(res, 'statusCode') + err)

              usedProxies.push(usingProxy)
              return h.redirect(request.url.path);
            } else {
              usedProxies = []
              usingProxy = undefined
              throw Error('Cannot get response from google side' + "with status code " + _.get(res, 'statusCode') + err)
            }

          }
          console.log("proxy " + usingProxy + "OK")
          res['headers']['content-type'] = 'application/json'
          return Wreck.read(res, {json: true}, function (err, payload) {

            console.log('some payload manipulation if you want to.')
            const response = h.response(payload);
            response.headers = res.headers;
            return response;
          });

        }
      }
    }
  });

  return;
}
;

exports.register = function (server, options) {
  server.dependency(['hapi-mongo-models'], internals.applyRoutes);

  return;
};

exports.name = 'index';
