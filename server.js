'use strict';


const composer = require('./index');
const checkSecurty = require('./server/utils/general').checkSecurty
const _ = require('lodash')
const Config = require('./config');
const {ApolloServer} = require('apollo-server-hapi');
const firebaseAdmin = require('./server/utils/fb');
const logger = require('./server/utils/logger.js').logger
const {schemaWithMiddleware,MyErrorTrackingExtension} = require('./server/graphql/core')

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
    // const GrammarUnit = require('./server/models/grammar-unit');
    //
    // GrammarUnit.syncDataES({}, true)


  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

StartServer().catch(error => console.log(error));

