const quizService = require('../services/quiz.service');
const userStatisticsService = require('../services/user-statistics.service');

const GraphQLJSON = require('graphql-type-json');

// The GraphQL schema in string form
const typeDefs = `
 
  extend type Query {
    getUserDeck(id: ID!): UserDeck,
    getMyUserDeck(deckId: ID!): UserDeck,
    getUserDeckStatistics(userId:ID!):[WordStatistics]
  }

  extend type Mutation { createUserDeck(userId: String, deckId: String, deckId: String, latestStudy: JSON): UserDeck }
  extend type Mutation { updateUserDeck(id: ID!, completedTopics: JSON, exams: JSON, latestStudy: JSON): UserDeck }
  extend type Mutation { deleteUserDeck(id: ID!): UserDeck}

  type UserDeck {
    _id: String,
    userId: String,
    deckId: String,
    completedTopics: JSON,
    latestStudy: LatestStudy,
    wordStatistics: WordStatistics,
    createdAt:String,
    expiredAt:String
  }

  type LatestStudy {
    latestStudyDate: String,
    latestTopic: String,
    latestUserTopic: String,
    latestStudyMode: String,
    latestUserTopicDetail: UserTopic
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
      return await quizService.getOneMyUserDeckByDeckId(context.request.auth.credentials.uid, args.deckId);
    },
//Thống kê từ đang học, chưa học, đã học cho toàn bộ deck của user
    getUserDeckStatistics: async (parent, args) => {
      return await userStatisticsService.getWordStatics(args);
    }
  },
  UserDeck:{ wordStatistics: async (parent, args) => {
      //Thống kê từ đang học, chưa học, đã học cho 1 deck cụ thể của user

      let queryData = {}
      queryData.deckId = parent.deckId
      queryData.userId  = parent.userId

      data = await userStatisticsService.getWordStatics(queryData);
      return data[0]
    }},
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
