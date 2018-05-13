'use strict';

const Confidence = require('confidence');
const Config = require('./config');


const criteria = {
  env: process.env.NODE_ENV
};


const manifest = {
  $meta: 'This file defines the plot device.',
  server: {
    debug: {
      request: ['error']
    },
    connections: {
      routes: {
        security: true
      }
    }
  },
  connections: [{
    port: Config.get('/port/web'),
    routes: {
      cors: true
    },
    labels: ['web']
  }],
  registrations: [
    {
      plugin: './server/firebase-auth'
    },
    {
      plugin: {
        register: 'hapi-mongo-models',
        options: {
          mongodb: Config.get('/hapiMongoModels/mongodb'),
          models: {
            WalletCategory: './server/models/wallet-category',
            WalletTransaction: './server/models/wallet-transaction'
          },
          autoIndex: Config.get('/hapiMongoModels/autoIndex')
        }
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
};

const store = new Confidence.Store(manifest);

exports.get = function (key) {

  return store.get(key, criteria);
};

exports.meta = function (key) {

  return store.meta(key, criteria);
};
