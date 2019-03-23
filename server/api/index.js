'use strict';

const internals = {};
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
      return {message: 'Welcome to LingoJingo.'};
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

      const getClaims =require('../graphql/permission').getClaims
      let claims = await getClaims(request.auth.credentials)
      if (!(claims['groups'] ||[]).includes('ADMIN')) {
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
      } catch (e) {
        return {e}

      }

    }
  });
  server.route({
    method: '*',
    path: '/proxyES/{p*}',
    config: {
      auth: envAuth
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

  return;
};

exports.register = function (server, options) {
  server.dependency(['hapi-mongo-models'], internals.applyRoutes);

  return;
};

exports.name = 'index';
