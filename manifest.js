'use strict';

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
    cache: { engine: require('catbox-memory') },
    debug: {
      request: ['error']
    },
    port: Config.get('/port/web')
  },
  register: {
    plugins: [
      {
        plugin: require('hapi-firebase-auth')
      },
      {
        plugin: require('hapi-mongo-models'),
        options: {
          models: [
            Path.resolve(__dirname, './server/models/wallet-category'),
            Path.resolve(__dirname, './server/models/wallet-transaction'),
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
        plugin: './server/auth'
      },
      {
        plugin: './server/services/wallet.service'
      },
      {
        plugin: './server/api/index',
        options: {
          routes: { prefix: '/api' }
        }
      },
      {
        plugin: './server/api/wallet-category',
        options: {
          routes: { prefix: '/api' }
        }
      },
      {
        plugin: './server/api/wallet-transaction',
        options: {
          routes: { prefix: '/api' }
        }
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
