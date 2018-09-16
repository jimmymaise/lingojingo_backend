const graphqlTools = require('graphql-tools');
const merge = require('lodash/merge');

const cardSchema = require('./card-schema');
const sentry = require('../utils/logger').logger;

const deckSchema = require('./deck-schema');
const topicSchema = require('./topic-schema');
const userTopicSchema = require('./user-topic-schema');
const examSchema = require('./user-exam-schema');
const userDeckSchema = require('./user-deck-schema');
const rewardSchema = require('./reward-schema');
const leaderBoardSchema = require('./leader-board-schema');

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
  type HighestResult {    
    examId: String,
    score: Int,
    result: Int,
    timeSpent: Int,
    knownAnswer: JSON,
    totalQuestions: Int,
    totalCorrectAnswers: Int,
    timeSpentAvg: Int,
  }
  
  type WordStatistics{
    notLearned: Int,
    learned: Int,
    learning: Int,
  }

  type UserInfo{
    fullName: String,
    email: String,
    phone: String,
    avatarUrl: String,
  }  

  type DeckCategory{
    _id: String,
    name: String,
    decks:[JSON]
  }

  input HighestResultInput {
    examId: String,
    score: Int,
    result: Int,
    timeSpent: Int,
    knownAnswer: JSON,
    totalQuestions: Int,    
  }
`

const typeDefs = [externalType, rootType, cardSchema.typeDefs, deckSchema.typeDefs, topicSchema.typeDefs,
  userTopicSchema.typeDefs, examSchema.typeDefs, userDeckSchema.typeDefs, rewardSchema.typeDefs, leaderBoardSchema.typeDefs];
const resolvers = merge(rootResolver, cardSchema.resolvers, deckSchema.resolvers, topicSchema.resolvers,
  userTopicSchema.resolvers, examSchema.resolvers, userDeckSchema.resolvers, rewardSchema.resolvers, leaderBoardSchema.resolvers);
const logger = { log: e => console.error(e) }
module.exports = graphqlTools.makeExecutableSchema({
  typeDefs,
  resolvers,
  logger
});

