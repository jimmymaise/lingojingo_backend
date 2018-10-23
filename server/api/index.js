'use strict';

const internals = {};
const envAuth = process.env.NODE_ENV === 'production' ? 'firebase' : null
const Wreck = require('wreck');
// let esAddr=`${process.env.ES_HOST }:9200`
// let esAddr = (process.env.ES_HOST)?`${process.env.ES_HOST }:9200`:`https://stag-api.vomemo.com/es`

internals.applyRoutes = function (server) {
  server.route({
    method: 'GET',
    path: '/',
    handler: function (request) {
      return {message: 'Welcome to Vomemo.'};
    }
  });

  server.route({
    method: 'GET',
    path: '/syncES',
    config: {
      auth: 'firebase'
    },
    handler: async function (request) {
      const Deck = require('../models/deck');
      const UserTopic = require('../models/user-topic');
      const Song = require('../models/song');
      const Article = require('../models/article');



      try {
        await Article.syncDataES({}, true)
        await Song.syncDataES({}, true)
        await Deck.syncDataES({}, true)
        await UserTopic.syncDataES({}, true)

      }
      catch (e) {
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
            uri: `http://${process.env.ES_HOST || '13.76.130.203'}:9200/${request.params.p}`
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
