'use strict';
const Pack = require('./package');

const Path = require('path');
const Confidence = require('confidence');

const Config = require('./config');

const criteria = {
  env: process.env.NODE_ENV
};


const manifest = {
  $meta: 'This file defines the plot device.',
  server: {
    address: '0.0.0.0',
    cache: {engine: require('catbox-memory')},
    debug: {
      request: ['error']
    },
    port: Config.get('/port/web'),
    routes: {
      cors: true
    }
  },
  register: {
    plugins: [
      {
        plugin: require('inert')
      },
      {
        plugin: require('./server/utils/sentry')
      },
      {
        plugin: require('h2o2')
      },
      {
        plugin: require('vision')
      },
      {
        plugin: require('hapi-swagger'),
        options: {
          info: {
            title: 'API Documentation',
            version: Pack.version,
          }
        }
      },
      {
        plugin: require('hapi-firebase-auth')
      },
      {
        plugin: require('hapi-mongo-models'),
        options: {
          models: [
            Path.resolve(__dirname, './server/models/user-info'),
            Path.resolve(__dirname, './server/models/wallet-category'),
            Path.resolve(__dirname, './server/models/wallet-transaction'),
            Path.resolve(__dirname, './server/models/card'),
            Path.resolve(__dirname, './server/models/deck'),
            Path.resolve(__dirname, './server/models/topic')
          ],
          mongodb: {
            connection: {
              uri: Config.get('/hapiMongoModels/mongodb/uri'),
              db: Config.get('/hapiMongoModels/mongodb/db')
            },
            options: {
              useNewUrlParser: true
            }
          },
          autoIndex: Config.get('/hapiMongoModels/autoIndex')
        }
      },
      {
        plugin: './server/services/user-info.service'
      },
      {
        plugin: './server/services/wallet.service'
      },
      {
        plugin: './server/services/quiz.service'
      },
      {
        plugin: './server/services/deck.service'
      },
      {
        plugin: './server/services/song.service'
      },
      {
        plugin: './server/services/article.service'
      },
      {
        plugin: './server/services/support.service'
      },
      {
        plugin: './server/services/upload-file.service'
      },
      {
        plugin: './server/api/index'
      },
      {
        plugin: './server/api/wallet-category'
      },
      {
        plugin: './server/api/user-info'
      },
      {
        plugin: './server/api/deck'
      },
      {
        plugin: './server/api/song'
      },
      {
        plugin: './server/api/article'
      },
      {
        plugin: './server/api/support'
      },
      {
        plugin: './server/api/upload'
      }
    ]
  }
};

const store = new Confidence.Store(manifest);

exports.get = function (key) {

  return store.get(key, criteria);
};

exports.meta = function (key) {

  return store.meta(key, criteria);
};
