const quizService = require('../services/quiz.service');
const GraphQLJSON = require('graphql-type-json');

// The GraphQL schema in string form
const typeDefs = `
  scalar JSON
 
  extend type Query { getUserDeck(id: ID!): UserDeck }
  extend type Mutation { createUserDeck(userId:String,deckId:String,deckId:String,filterKnownCard:JSON,exams:[String],highestResult:JSON): UserDeck }
  extend type Mutation { updateUserDeck(id: ID!,filterKnownCard:JSON,exams:[String],highestResult:JSON): UserDeck }
  extend type Mutation { deleteUserDeck(id: ID!): UserDeck}

  type UserDeck {
    _id: String,
    userId: String,
    deckId: String,
    exams: [String],
    "latestStudyDate": String,
    learntNotRemember:[String],
    studiedTopics:JSON,
    latestTopic:LastestTopic
    latestReviewExam:LastestReview
    }
    type LastestTopic {
    topicOrder: String,
    lastestExamId: String,
    topicId:String,
    userTopicId:String,
    latestExamScore:Int,
    filterKnownCards:JSON,
    wrongAnswers:[String]
    type latestfinalExam
    
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
      return await quizService.addOneUserDeck(args.userId, args.deckId, args.deckId, args.filterKnownCard,
        args.exams, args.highestResult
      );
    },
    updateUserDeck: async (parent, args) => {
      return await quizService.updateOneUserDeck(args.id, args.filterKnownCard,
        args.exams, args.highestResult
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
