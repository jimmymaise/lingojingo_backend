const leaderBoardService = require('../services/leader-board.service');
const userInfoService = require('../services/user-info.service');

const GraphQLJSON = require('graphql-type-json');
//db.getCollection("user_exams").find({deckId:'5b1bfc365c44cc013e87280b',topicId:'5b1bf1615c44cc013e872289'}).sort({score:-1}).limit(5).toArray()
// The GraphQL schema in string form
const typeDefs = `
  extend type Query {
    getTopicLeaderBoard(topicId: String!,deckId:String!,top:Int): [LeaderBoard],
    getGeneralLeaderBoard(topicId: String,deckId:String,type:String,top:Int): LeaderBoardInfo

  }
  
  type LeaderBoardInfo {
    currentUser: LeaderBoard,
    leaderBoard: [LeaderBoard]
  
  }
  
  type LeaderBoard {
    _id: String,
    userInfo: UserInfo,
    score: Float,
    totalExams: Int,
    timeSpentAvg: Float,
    totalCorrectAnswers: Int,
    timeSpent: Int,
    rank: Int

}
 
`;

// The resolvers
const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    // getTopicLeaderBoard: async (parent, args) => {
    //   return await leaderBoardService.getTopicLeaderBoard(args);
    // },
    getGeneralLeaderBoard: async (parent, args, context) => {
      args['currentUserId'] = context.request.auth.credentials.user_id
      return await leaderBoardService.getGeneralLeaderBoard(args);
    },

  },
  LeaderBoard: {
    userInfo: async (parent, args, context) => {
      data = await userInfoService.getOne(parent.userId);
      return data
    },

  }

};

module.exports = {
  typeDefs,
  resolvers
}
