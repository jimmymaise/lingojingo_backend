'use strict';

const composer = require('./index');
const { ApolloServer,makeExecutableSchema, gql } = require('apollo-server-hapi');
const Hapi = require('hapi');
const typeDefs = require('./server/graphql/schema.js').typeDefs
const resolvers = require('./server/graphql/schema.js').resolvers



const Config = require('./config');



const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});




const StartServer = async () => {
  try {
    const server = new ApolloServer({ schema, context: async ({ request, h }) => {
        return {};
      }});
    const app = await composer();

    await server.applyMiddleware({
      app,
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
