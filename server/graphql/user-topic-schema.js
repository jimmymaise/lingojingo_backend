const quizService = require('../services/quiz.service');
const GraphQLJSON = require('graphql-type-json');

// The GraphQL schema in string form
const typeDefs = `
  input UserTopicInput {
    userId: String,
    deckId: String!,
    topicId: String!,
    exams: [String],
    currentStudyMode: String,
    filterKnownCard: JSON,
    highestResult: HighestResultInput,
    knownAnswer: JSON
  }
 
  extend type Query { getUserTopic(id: ID!): UserTopic }
  extend type Query { getUserTopicByDeckAndTopic(deckId: ID!, topicId: ID!): UserTopic }
  extend type Mutation { createMyUserTopic(userTopic: UserTopicInput!): UserTopic }
  extend type Mutation { createOrUpdateMyUserTopic(userTopic: UserTopicInput!): UserTopic }
  extend type Mutation { updateUserTopic(id: ID!, filterKnownCard: JSON, exams: [String], highestResult: JSON, currentStudyMode: String): UserTopic }
  extend type Mutation { deleteUserTopic(id: ID!): UserTopic}

  type UserTopic {
    _id: String,
    userId: String,
    deckId: String,
    topicId: String,
    exams: [String],
    currentStudyMode: String,
    filterKnownCard: JSON,
    highestResult: HighestResult,
    knownAnswer: JSON,
    topicType: Int,
    totalExam: Int
  }
`;

// The resolvers
const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    getUserTopic: async (parent, args) => {
      return await quizService.getOneUserTopic(args.id);
    },
    getUserTopicByDeckAndTopic: async (parent, args, context) => {
      return await quizService.getUserTopicByDeckAndTopic(context.request.auth.credentials.uid, args.deckId, args.topicId);
    }
  },
  Mutation: {
    createMyUserTopic: async (parent, args, context) => {
      return await quizService.addOneUserTopic(context.request.auth.credentials.uid, args.userTopic);
    },
    createOrUpdateMyUserTopic: async (parent, args, context) => {
      return await quizService.createOrUpdateUserTopic(context.request.auth.credentials.uid, args.userTopic);
    },
    updateUserTopic: async (parent, args) => {
      return await quizService.updateOneUserTopic(args);
    },
    deleteUserTopic: async (parent, args) => {
      return await quizService.deleteOneUserTopic(args.id);
    },
  }

};

module.exports = {
  typeDefs,
  resolvers
}
