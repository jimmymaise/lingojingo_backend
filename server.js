'use strict';

const composer = require('./index');
const _ = require('lodash')
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

const GraphQLExtension = require('graphql-extensions').GraphQLExtension

class MyErrorTrackingExtension extends GraphQLExtension {
  willSendResponse(o) {
    const {context, graphqlResponse} = o

    context.trackErrors(graphqlResponse.errors)

    return o
  }

  // Other lifecycle methods include
  // requestDidStart
  // parsingDidStart
  // validationDidStart
  // executionDidStart
  // willSendResponse
}

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: FIRE_BASE_CONFIG.databaseURL[process.env.NODE_ENV]
});

function checkSecurty(request) {
  if (request.headers['x-tag'] === 'vomemo@Admin') {
    return request
  }
  let vmmPassPort = parseInt(request.headers['x-tag'], 10)
  let beTimeStamp = Math.floor(Date.now() / 1000)
  let feTimeStamp = 0
  // let timestamp = Math.floor(Date.now() / 1000)
  //
  // let vmmPassport = (timestamp-98765) * 2018 - 12345

  if (vmmPassPort) {
    feTimeStamp = ((vmmPassPort + 12345) / 2018) + 98765
    let diff = Math.abs(beTimeStamp - feTimeStamp)
    if (diff < 1800) {
      return request
    }
  }
  else {
    return request
  }
  throw Error(`Error code 911: Some issue happens.`)


}

const StartServer = async () => {
  try {
    const server = new ApolloServer({
      schema,

      extensions: [() => new MyErrorTrackingExtension()],
      context: ({request}) => {
        return {
          request: checkSecurty(request),
          trackErrors(errors) {
            if (errors) {
              let other_errors = _.cloneDeep(errors)
              other_errors.shift()
              logger.error(errors[0].originalError, {
                request: {
                  method: this.request.method,
                  headers: this.request.headers,
                  cookies: this.request.state,
                  url: this.request.path,
                  body: this.request.payload.query,
                },
                extra: {
                  timestamp: this.request.info.received,
                  id: this.request.info.id,
                  remoteAddress: this.request.info.remoteAddress,
                  userInfo: request.auth,
                  otherErrors: JSON.stringify(other_errors)

                },
              })


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
          additionalHeaders: ['cache-control', 'x-tag']
        }
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
