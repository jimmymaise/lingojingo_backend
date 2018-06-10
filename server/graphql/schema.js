const graphqlTools = require('graphql-tools');
const merge = require('lodash/merge');

const cardSchema = require('./card-schema');
const deckSchema = require('./deck-schema');

const rootResolver = {
  Query: {
    version() {
      return '';
    },
  },
  Mutation: {
    version() {
      return '';
    },
  },
};

const rootType = `
  input PaginationInput {
    limit: Int,
    page: Int
  }
  type PageInfo {
    current: Int,
    prev: Int,
    hasPrev: Boolean,
    next: Int,
    hasNex: Boolean,
    total: Int
  }
  type PageItemInfo {
    limit: Int,
    begin: Int,
    end: Int,
    total: Int
  }
  type Query {
    version: String
  }
  type Mutation {
    version: String
  }
  schema {
    query: Query
    mutation: Mutation
  }
`;

const typeDefs = [rootType, cardSchema.typeDefs, deckSchema.typeDefs];
const resolvers = merge(rootResolver, cardSchema.resolvers, deckSchema.resolvers);

module.exports = graphqlTools.makeExecutableSchema({
  typeDefs,
  resolvers,
});

