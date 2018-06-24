const quizService = require('../services/quiz.service');
const GraphQLJSON = require('graphql-type-json');

// The GraphQL schema in string form
const typeDefs = `
  
 
  extend type Query { getExam(id: ID!): Exam }
  extend type Mutation { createExam(    topics: [String],id: String,userDeckId: String,userId: String,deckId: String,type:String
      ,topics: [String],wrongAnswer: [String],totalQuestions: Int,date: String,score: Int,result: String): Exam }
  extend type Mutation { updateExam(id: ID!, wrongAnswer: [String],  totalQuestions: Int,date: String,score: Int,result: String): Exam}
  extend type Mutation { deleteExam(id: ID!): Exam}

  type Exam {
    _id: String,
    userDeckId: String,
    userId: String,
    deckId: String,
    type:String
    topics: [String],
    wrongAnswer: [String],
    totalQuestions: Int,
    date: String,
    score: Int,
    result: String
    }

`;

// The resolvers
const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    getExam: async (parent, args) => {
      return await quizService.getOneExam(args.id);
    }
  },
  Mutation: {
    createExam: async (parent, args) => {
      return await quizService.addOneExam(args);
    },
    updateExam: async (parent, args) => {
      return await quizService.updateOneExam(args);
    },
    deleteExam: async (parent, args) => {
      return await quizService.deleteOneExam(args.id);
    },
  }

};

module.exports = {
  typeDefs,
  resolvers
}
