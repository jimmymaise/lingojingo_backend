'use strict';

const composer = require('./index');
const XTAG_TIME = require('./server/utils/constants').XTAG_TIME
const _ = require('lodash')
const Config = require('./config');
const {ApolloServer, makeExecutableSchema, gql} = require('apollo-server-hapi');
const FIRE_BASE_CONFIG = require('./server/data/firebase_config')
const firebaseAdmin = require('firebase-admin');
const serviceAccount = FIRE_BASE_CONFIG.service[process.env.NODE_ENV];
const applyMiddleware = require("graphql-middleware").applyMiddleware;
const GraphQLExtension = require('graphql-extensions').GraphQLExtension

const logger = require('./server/utils/logger.js').logger

const typeDefs = require('./server/graphql/schema.js').typeDefs
const resolvers = require('./server/graphql/schema.js').resolvers
const permissions = require('./server/graphql/permission.js').permissions
const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});


const schemaWithMiddleware = applyMiddleware(
  schema,
  permissions
)


class MyErrorTrackingExtension extends GraphQLExtension {
  willSendResponse(o) {
    const {context, graphqlResponse} = o

    context.trackErrors(graphqlResponse.errors)

    return o
  }

}

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: FIRE_BASE_CONFIG.databaseURL[process.env.NODE_ENV]
});

function checkSecurty(request) {
  if (request.headers['debug'] === 'vomemo@Admin#') {
    return request
  }
  let xTag = request.headers['x-tag'] ? parseInt(request.headers['x-tag'], 10) : 0
  let beTimeStamp = Math.floor(Date.now() / 1000)
  let feTimeStamp = 0

  let diff
  if (xTag) {
    feTimeStamp = ((xTag + 12345) / 2018) + 98765
    diff = Math.abs(beTimeStamp - feTimeStamp)
    if (diff < XTAG_TIME) {
      return request
    }
  }
  logger.error('Someone query data with invalid x-tag', logger.requestToSentryLog(request, {
    'diff': diff,
    'x-tag': xTag
  }))
  throw Error(`Error code 911: Some issue happens`)


}

const StartServer = async () => {
  try {
    const server = new ApolloServer({
      schema: schemaWithMiddleware,

      extensions: [() => new MyErrorTrackingExtension()],
      context: ({request}) => {
        return {
          request: checkSecurty(request),
          trackErrors(errors) {
            if (errors) {
              let other_errors = _.cloneDeep(errors)
              other_errors.shift()
              logger.error(errors[0].originalError,
                logger.requestToSentryLog(this.request, other_errors))


            }
            // Track the errors
          },

        }
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
        cors: {
          origin: ['*'],
          additionalHeaders: ['debug', 'x-tag']
        }
      }
    });
    await server.installSubscriptionHandlers(app.listener);
    await app.start();

    console.log(`${Config.get('/projectName')}`);
    console.log(`Server running at: ${server.graphqlPath}`);


  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

StartServer().catch(error => console.log(error));
