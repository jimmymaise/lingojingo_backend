'use strict';

const composer = require('./index');
const Config = require('./config');
const {ApolloServer, makeExecutableSchema, gql} = require('apollo-server-hapi');
const FIRE_BASE_CONFIG = require('./server/data/firebase_config')
const firebaseAdmin = require('firebase-admin');
const serviceAccount = FIRE_BASE_CONFIG.service[process.env.NODE_ENV];

const logger = require('./server/utils/logger.js').logger

const typeDefs = require('./server/graphql/schema.js').typeDefs
const resolvers = require('./server/graphql/schema.js').resolvers
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: FIRE_BASE_CONFIG.databaseURL[process.env.NODE_ENV]
});

const StartServer = async () => {
  try {
    const server = new ApolloServer({
      schema,
      context: ({request}) => {
        return request;
      },
      formatError: error => {
        logger.error(error.originalError, error.source);
        console.error(error);
        return new Error('Internal server error');
      }
    });
    const app = await composer();
    app.auth.strategy('firebase', 'firebase', {
      instance: firebaseAdmin
    })
    await server.applyMiddleware({
      app,
      route: {
        auth: 'firebase',
        cors: true
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
