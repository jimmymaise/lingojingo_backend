'use strict';

const internals = {};
const getLocation = require('../utils/general').getLocation
const envAuth = process.env.NODE_ENV === 'production' ? 'firebase' : null
const Wreck = require('wreck');
let esAddr = (process.env.ES_HOST) ? `http://${process.env.ES_HOST}:9200` : `https://stag-api.lingojingo.com/proxyES`
let get = require("lodash.get");
const Boom = require('boom');


internals.applyRoutes = function (server) {
  server.route({
    method: 'GET',
    path: '/',
    handler: function (request) {
      return {
        message: 'Welcome to LingoJingo.',
        serverTime: Date.now()
      };
    }
  });


  server.route({
    method: 'GET',
    path: '/version/{type}',
    config: {
      auth: 'firebase'
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
    method: 'POST',
    path: '/translate',
    config: {
      auth: 'firebase'
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
      auth: 'firebase'
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
        if (request.params.p === 'deck' || request.params.p === 'all') {
          return await Deck.syncDataES({}, true)
        }
        if (request.params.p === 'user-item' || request.params.p === 'all') {
          return await UserItem.syncDataES({}, true)
        }
        if (request.params.p === 'article' || request.params.p === 'all') {
          return await Article.syncDataES({}, true)
        }
        if (request.params.p === 'song' || request.params.p === 'all') {
          return await Song.syncDataES({}, true)
        }
        if (request.params.p === 'user-topic' || request.params.p === 'all') {
          return await UserTopic.syncDataES({}, true)
        }
        if (request.params.p === 'grammar-unit' || request.params.p === 'all') {
          return await GrammarUnit.syncDataES({}, true)
        }
        return Boom.badData('Invalid type !');

      } catch (e) {
        return {e}

      }

    }
  });
  let remotes = [
    {url: "https://translate.google.com", path: 'server-1'},
  ]

  server.route({
    method: "GET",
    path: "/proxy/{p*}",
    handler: {
      proxy: {
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

  return;
};

exports.register = function (server, options) {
  server.dependency(['hapi-mongo-models'], internals.applyRoutes);

  return;
};

exports.name = 'index';
