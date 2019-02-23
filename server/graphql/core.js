const applyMiddleware = require("graphql-middleware").applyMiddleware;
const GraphQLExtension = require('graphql-extensions').GraphQLExtension
const {makeExecutableSchema} = require('apollo-server-hapi');

const typeDefs = require('./schema.js').typeDefs
const resolvers = require('./schema.js').resolvers
const permissions = require('./permission.js').permissions

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

module.exports = {
  MyErrorTrackingExtension,
  schemaWithMiddleware,
}