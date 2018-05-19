'use strict';

const Boom = require('boom');
const Config = require('../config');
const firebaseAdmin = require('firebase-admin');
const serviceAccount = require("./data/voca-memo-firebase-adminsdk-s6hgg-066a023101.json");

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://voca-memo.firebaseio.com/"
});

const internals = {};

internals.applyStrategy = function (server) {
  server.auth.strategy('firebase', 'firebase', { 
    instance: firebaseAdmin 
  });

  return;
};


// internals.preware = {
//   ensureRole: function (roles) {

//     return {
//       assign: 'ensureRole',
//       method: function (request, reply) {

//         if (Object.prototype.toString.call(roles) !== '[object Array]') {
//           roles = [roles];
//         }

//         const roleFound = _.includes(roles, request.auth.credentials.user.role);

//         if (!roleFound) {
//           return reply(Boom.notFound('Permission denied to this resource.'));
//         }

//         reply();
//       }
//     };
//   }
// };



exports.register = function (server, options) {

  server.dependency('hapi-mongo-models', internals.applyStrategy);

  return;
};


exports.preware = internals.preware;


exports.name = 'auth';

