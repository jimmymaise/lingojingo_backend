'use strict';

const Confidence = require('confidence');

const criteria = {
  env: process.env.NODE_ENV
};

const config = {
  $meta: 'This file configures the plot device.',
  projectName: 'Vomemo - Vocabulary Memory',
  port: {
    web: {
      $filter: 'env',
      production: 3800,
      test: 9000,
      dev: 3200,
      $default: 8080
    }
  },
  hapiMongoModels: {
    $filter: 'env',
    production: {
      mongodb: {
        uri: process.env.MONGO_PROD_URL,
        db: 'vomemo'
      },
      autoIndex: false
    },
    test: {
      mongodb: {
        uri: 'mongodb://localhost:27017/',
        db: 'vomemo'
      },
      autoIndex: false
    },
    dev: {
      mongodb: {
        uri: 'mongodb://vomemo_user:Aa123456!@ds117960.mlab.com:17960/vomemo',
        db: 'vomemo'
      },
      autoIndex: false
    },
    $default: {
      mongodb: {
        uri: 'mongodb://vomemo_user:Aa123456!@ds117960.mlab.com:17960/vomemo',
        db: 'vomemo'
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
