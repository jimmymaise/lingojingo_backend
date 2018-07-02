const quizService = require('../services/quiz.service');
const GraphQLJSON = require('graphql-type-json');

// The GraphQL schema in string form
const typeDefs = `
 
  extend type Query {
    getUserDeck(id: ID!): UserDeck,
    getMyUserDeck(deckId: ID!): UserDeck,
  }

  extend type Mutation { createUserDeck(userId: String, deckId: String, deckId: String, latestStudy: JSON): UserDeck }
  extend type Mutation { updateUserDeck(id: ID!, completedTopics: JSON, exams: JSON, latestStudy: JSON): UserDeck }
  extend type Mutation { deleteUserDeck(id: ID!): UserDeck}

  type UserDeck {
    _id: String,
    userId: String,
    deckId: String,
    finalExams:JSON,
    completedTopics: JSON,
    waitingReviewExamTopics:[String],
    latestStudy: LatestStudy
    finalExam: FinalExam,
    reviewExams:JSON,
    
  }

  type LatestStudy {
    latestStudyDate: String,
    latestTopic: String,
    latestUserTopic: String,
    latestStudyMode: String,
    latestUserTopicDetail: UserTopic
  }

  type FinalExam {
    highestResult: HighestResult,
    allExams:[String]
  }

  type HighestResult {
    examId: String,
    score: Int,
    result: String
  }

  input HighestResultInput {
    examId: String,
    score: Int,
    result: String
  }

`;

// The resolvers
const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    getUserDeck: async (parent, args) => {
      return await quizService.getOneUserDeck(args.id);
    },
    getMyUserDeck: async (parent, args, context) => {
      return await quizService.getOneMyUserDeckByDeckId(context.auth.credentials.uid, args.deckId);
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
  },
  LatestStudy: {
    latestUserTopicDetail: async (parent, args) => {
      if (!parent.latestUserTopic) {
        return null;
      }

      return await quizService.getOneUserTopic(parent.latestUserTopic);
    }
  }
};

module.exports = {
  typeDefs,
  resolvers
}
