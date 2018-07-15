const graphqlTools = require('graphql-tools');
const merge = require('lodash/merge');

const cardSchema = require('./card-schema');
const deckSchema = require('./deck-schema');
const topicSchema = require('./topic-schema');
const userTopicSchema = require('./user-topic-schema');
const examSchema = require('./user-exam-schema');
const userDeckSchema = require('./user-deck-schema');
const rewardSchema = require('./reward-schema');

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
    hasNext: Boolean,
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

const externalType = `
  scalar JSON
`

const typeDefs = [externalType, rootType, cardSchema.typeDefs, deckSchema.typeDefs, topicSchema.typeDefs,
  userTopicSchema.typeDefs, examSchema.typeDefs, userDeckSchema.typeDefs,rewardSchema.typeDefs];
const resolvers = merge(rootResolver, cardSchema.resolvers, deckSchema.resolvers, topicSchema.resolvers,
  userTopicSchema.resolvers, examSchema.resolvers, userDeckSchema.resolvers,rewardSchema.resolvers);

module.exports = graphqlTools.makeExecutableSchema({
  typeDefs,
  resolvers,
});

