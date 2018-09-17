'use strict';

const composer = require('./index');
const {ApolloServer, makeExecutableSchema, gql} = require('apollo-server-hapi');
const Hapi = require('hapi');
const typeDefs = require('./server/graphql/schema.js').typeDefs
const resolvers = require('./server/graphql/schema.js').resolvers


'use strict';
const FIRE_BASE_CONFIG = require('./server/data/firebase_config')
const Boom = require('boom');
const {graphqlHapi, graphiqlHapi} = require('apollo-server-hapi');
const firebaseAdmin = require('firebase-admin');

// const Config = require('../config');
const serviceAccount = FIRE_BASE_CONFIG.service[process.env.NODE_ENV];
const graphqlSchema = require('./server/graphql/schema');

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: FIRE_BASE_CONFIG.databaseURL[process.env.NODE_ENV]
});
// internals.applyStrategy = async function (server) {
//   server.auth.strategy('firebase', 'firebase', {
//     instance: firebaseAdmin
//   });

const Config = require('./config');


const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});


const StartServer = async () => {
  try {
    const server = new ApolloServer({
      schema, // You'll need to pass the request object and optionally the repsponse toolkit.
      context: (request, h) => ({request, h}),
    });
    const app = await composer();
    app.auth.strategy('firebase', 'firebase', {
      instance: firebaseAdmin
    })
    await server.applyMiddleware({
      app,
      route: {
        auth: 'firebase'
      }
    });
    await server.installSubscriptionHandlers(app.listener);
    await app.start();

    console.log(`${Config.get('/projectName')}`);
    console.log(`Server running at: ${server.graphqlPath}`);


  }
  catch (err) {
    console.error(err);
    process.exit(1);
  }
};

StartServer().catch(error => console.log(error));
