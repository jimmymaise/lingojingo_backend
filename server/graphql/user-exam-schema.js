const userExamService = require('../services/user-exam.service');
const GraphQLJSON = require('graphql-type-json');

// The GraphQL schema in string form
const typeDefs = `
  
 
  extend type Query { getUserExam(id: ID!): UserExam }
  extend type Mutation { createUserExam(    id: String,userDeckId: String,userId: String,deckId: String,type:String,userTopicId:String,
      ,reviewTopics: [String],wrongAnswers: [String],totalQuestions: Int,date: String,score: Int,result: String): UserExam }
  extend type Mutation { updateUserExam(id: ID!,isCompleted:[Boolean] wrongAnswers: [String],  totalQuestions: Int,date: String,score: Int,result: String): UserExam}
  extend type Mutation { deleteUserExam(id: ID!): UserExam}

  type UserExam {
    _id: String,
    userDeckId: String,
    userId: String,
    deckId: String,
    type:String,
    userTopicId:String,
    topicId:String,
    reviewTopics: [String],
    wrongAnswers: [String],
    totalQuestions: Int,
    date: String,
    score: Int,
    result: String,
    timeSpent:Int
    }

`;

// The resolvers
const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    getUserExam: async (parent, args) => {
      return await quizService.getOneUserExam(args.id);
    }
  },
  Mutation: {
    createUserExam: async (parent, args) => {

      return await userExamService.addOneUserExam(args);
    },
    updateUserExam: async (parent, args) => {
      return await userExamService.updateOneUserExam(args);
    },
    deleteUserExam: async (parent, args) => {
      return await userExamService.deleteOneUserExam(args.id);
    },
  }

};

module.exports = {
  typeDefs,
  resolvers
}
