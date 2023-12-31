const userExamService = require('../services/user-exam.service');
const deckService = require('../services/deck.service');
const GraphQLJSON = require('graphql-type-json');

// The GraphQL schema in string form
const typeDefs = `
  input UserExamInput {
    deckId: String,
    # Link den Table Topics, de biet exam nay cua topic nao
    topicId: String,
    knownAnswer: JSON,
    # time spent to complete the exam (using to calculate score and ranking) - In Milisecond
    timeSpent: Int
  }

  extend type Query { getUserExam(id: ID!): UserExam }
  extend type Query { getRecentlyUserExams(topicId: String): [UserExam] }

  extend type Mutation { createUserExam(userExam: UserExamInput!): UserExam }
  extend type Mutation { updateUserExam(id: ID!,isCompleted:[Boolean] knownAnswer: [String],  totalQuestions: Int,date: String,score: Int,result: String): UserExam}
  extend type Mutation { deleteUserExam(id: ID!): UserExam}

  type UserExam {
    _id: String,
    userId: String,
    deckId: String,
    # Link den Table Topics, de biet exam nay cua topic nao
    topicId: String,
    knownAnswer: JSON,
    totalQuestions: Int,
    timeCreated: String,
    score: Int,
    # time spent to complete the exam (using to calculate score and ranking) - In Second
    timeSpent: Int,
    # 0 - Failed | 1 - Passed
    result: Int,
    topicDetail: Topic
  }
`;

// The resolvers
const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    getUserExam: async (parent, args) => {
      return await userExamService.getOneUserExam(args.id);
    },
    getRecentlyUserExams: async (parent, args, context) => {
      const userId = context.request.auth.credentials.uid;
      return await userExamService.getRecentlyUserExams(userId, args.topicId, 10);
    }
  },
  Mutation: {
    createUserExam: async (parent, args, context) => {
      const userExam = args.userExam;
      userExam.userId = context.request.auth.credentials.uid;

      return await userExamService.addOneUserExam(userExam);
    },
    updateUserExam: async (parent, args) => {
      // Tam thời ko cho update exam
      return null;
      // return await userExamService.updateOneUserExam(args);
    },
    deleteUserExam: async (parent, args) => {
      // Tạm thời ko cho delete exam
      return null;
      // return await userExamService.deleteOneUserExam(args.id);
    },
  },
  UserExam: {
    topicDetail: async (parent) => {
      return await deckService.getOneTopic(parent.topicId);
    }
  }
};

module.exports = {
  typeDefs,
  resolvers
}
