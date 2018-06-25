const quizService = require('../services/quiz.service');
const GraphQLJSON = require('graphql-type-json');

// The GraphQL schema in string form
const typeDefs = `
 
  extend type Query { getUserDeck(id: ID!): UserDeck }
  extend type Mutation { createUserDeck(userId:String,deckId:String,deckId:String,latestStudy:JSON): UserDeck }
  extend type Mutation { updateUserDeck(id: ID!,completedTopics:JSON,exams:[String],latestStudy:JSON): UserDeck }
  extend type Mutation { deleteUserDeck(id: ID!): UserDeck}

  type UserDeck {
    _id: String,
    userId: String,
    deckId: String,
    exams: [String],
    completedTopics:JSON,
    latestStudy:LatestStudy
    }
    
    type LatestStudy {
    latestStudyDate: String,
    latestTopic:String,
    lastestUserTopic: String,
    lastestStudyMode:String,
    completeFinalExam:Boolean
    
    }

`;

// The resolvers
const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    getUserDeck: async (parent, args) => {
      return await quizService.getOneUserDeck(args.id);
    }
  },
  Mutation: {
    createUserDeck: async (parent, args) => {
      return await quizService.addOneUserDeck(args
      );
    },
    updateUserDeck: async (parent, args) => {
      return await quizService.updateOneUserDeck(args
      );
    },
    deleteUserDeck: async (parent, args) => {
      return await quizService.deleteOneUserDeck(args.id
      );
    },
  }

};

module.exports = {
  typeDefs,
  resolvers
}
