const leaderBoardService = require('../services/leader-board.service');
const examService = require('../services/user-exam.service');
const userInfoService = require('../services/user-info.service');
let get = require("lodash.get");

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
    userInfo: UserInfo,
    totalScore: Float,
    testNum: Int,
    timeSpentAvg: Float,
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
      let userId = get(context, 'request.auth.credentials.user_id');
      let type = args.type || 'allTime'
      let limit = args.top || 10
      return await examService.getLeaderBoard(type, limit, userId);
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
