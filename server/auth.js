'use strict';

const Boom = require('boom');
const Config = require('../config');
const firebaseAdmin = require('firebase-admin');
const serviceAccount = require("./data/wallet-master-fbf88-firebase-adminsdk-xq9u1-268ecd2249.json");

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://wallet-master-fbf88.firebaseio.com"
});

const internals = {};

internals.applyStrategy = function (server, next) {
  server.auth.strategy('firebase', 'firebase', { 
    firebaseAdmin 
  });

  next();
};


internals.preware = {
  // ensureRole: function (roles) {

  //   return {
  //     assign: 'ensureRole',
  //     method: function (request, reply) {

  //       if (Object.prototype.toString.call(roles) !== '[object Array]') {
  //         roles = [roles];
  //       }

  //       const roleFound = _.includes(roles, request.auth.credentials.user.role);

  //       if (!roleFound) {
  //         return reply(Boom.notFound('Permission denied to this resource.'));
  //       }

  //       reply();
  //     }
  //   };
  // }
};



exports.register = function (server, options, next) {

  server.dependency('hapi-mongo-models', internals.applyStrategy);

  next();
};


exports.preware = internals.preware;


exports.register.attributes = {
  name: 'auth'
};
