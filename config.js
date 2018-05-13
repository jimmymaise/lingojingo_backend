'use strict';

const Confidence = require('confidence');

const criteria = {
  env: process.env.NODE_ENV
};

const config = {
  $meta: 'This file configures the plot device.',
  projectName: 'Wallet Master',
  port: {
    web: {
      $filter: 'env',
      production: 3800,
      test: 9000,
      $default: 3600
    }
  },
  hapiMongoModels: {
    $filter: 'env',
    production: {
      mongodb: {
        uri: process.env.DB_SERVERS
      },
      autoIndex: false
    },
    test: {
      mongodb: {
        uri: 'mongodb://localhost:27017/wallet_master'
      },
      autoIndex: false
    },
    $default: {
      mongodb: {
        uri: 'mongodb://walltermaster_admin:g8E[FML{VAtmyn3C@ds029224.mlab.com:29224/aznode-walltet-master'
      },
      autoIndex: false
    }
  }
};

const store = new Confidence.Store(config);

exports.get = function (key) {
  return store.get(key, criteria);
};

exports.meta = function (key) {
  return store.meta(key, criteria);
};
