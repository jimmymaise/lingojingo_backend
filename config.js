'use strict';

const Confidence = require('confidence');

const criteria = {
  env: process.env.NODE_ENV
};

const config = {
  $meta: 'This file configures the plot device.',
  projectName: 'LingoJingo - Vocabulary Memory',
  port: {
    web: {
      $filter: 'env',
      test: 9000,
      dev: 3200,
      $default: 8080
    }
  },
  hapiMongoModels: {
    $filter: 'env',
    test: {
      mongodb: {
        uri: 'mongodb://localhost:27017/',
        db: 'vomemo'
      },
      autoIndex: false
    },
    dev: {
      mongodb: {
        uri: 'mongodb://mongo_test:mongo_test%40123test@localhost:27017/mongo_test?readPreference=primary',
        db: 'mongo_test'
      },
      autoIndex: false
    },
    $default: {
      mongodb: {
        uri: process.env.MONGO_URL,
        db: process.env.MONGO_DB_NAME || 'vomemo'
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
