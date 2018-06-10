'use strict';

const Boom = require('boom');
const { graphqlHapi, graphiqlHapi } = require('apollo-server-hapi');
const firebaseAdmin = require('firebase-admin');

const Config = require('../config');
const serviceAccount = require("./data/voca-memo-firebase-adminsdk-s6hgg-066a023101.json");
const graphqlSchema = require('./graphql/schema');

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: "https://voca-memo.firebaseio.com/"
});

const internals = {};

internals.applyStrategy = async function (server) {
  server.auth.strategy('firebase', 'firebase', { 
    instance: firebaseAdmin 
  });

  // TODO: Refactor - Start
  // Because the GraphQL not support define in manifest
  // So need move it to here
  // And the Strategy must apply first
  if (process.env.NODE_ENV === 'dev') {
    await server.register({
      plugin: graphiqlHapi,
      options: {
        path: '/graphiql',
        graphiqlOptions: {
          endpointURL: '/graphql'
        },
        route: {
          cors: true
        }
      }
    });
  }

  await server.register({
    plugin: graphqlHapi,
    options: {
      path: '/graphql',
      graphqlOptions: request => ({
        schema: graphqlSchema,
        context: request // hapi request
      }),
      route: {
        auth: 'firebase',
        cors: true
      }
    }
  });
  // TODO: Refactor - End

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



exports.register = async function (server, options) {

  server.dependency('hapi-mongo-models', await internals.applyStrategy);

  return;
};


exports.preware = internals.preware;


exports.name = 'auth';

