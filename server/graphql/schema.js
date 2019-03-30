const graphqlTools = require('graphql-tools');
const merge = require('lodash/merge');

const cardSchema = require('./card-schema');
const quoteSchema = require('./quote-schema');

const sentry = require('../utils/logger').logger;

const deckSchema = require('./deck-schema');
const songSchema = require('./song-schema');
const articleSchema = require('./article-schema');

const grammarExerciseSchema = require('./grammar-exercise-schema');
const grammarReferenceSchema = require('./grammar-reference-schema');

const grammarGroupSchema = require('./grammar-group-schema');
const grammarSectionSchema = require('./grammar-section-schema');
const grammarUnitSchema = require('./grammar-unit-schema');


const topicSchema = require('./topic-schema');
const examSchema = require('./user-exam-schema');
const userItem = require('./user-item-schema');

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
  grammarExerciseSchema.typeDefs,
  grammarGroupSchema.typeDefs,
  grammarSectionSchema.typeDefs,
  grammarReferenceSchema.typeDefs,
  grammarUnitSchema.typeDefs,
  quoteSchema.typeDefs,
  , examSchema.typeDefs, rewardSchema.typeDefs, leaderBoardSchema.typeDefs, songSchema.typeDefs, articleSchema.typeDefs, userItem.typeDefs];
const resolvers = merge(rootResolver, cardSchema.resolvers, deckSchema.resolvers, topicSchema.resolvers,
  grammarExerciseSchema.resolvers,
  grammarGroupSchema.resolvers,
  grammarSectionSchema.resolvers,
  grammarReferenceSchema.resolvers,
  grammarUnitSchema.resolvers,
  quoteSchema.resolvers
  , examSchema.resolvers, rewardSchema.resolvers, leaderBoardSchema.resolvers, songSchema.resolvers, articleSchema.resolvers, userItem.resolvers);

module.exports = {
  typeDefs,
  resolvers
}


