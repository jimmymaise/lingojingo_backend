const rewardService = require('../services/reward.service');
const GraphQLJSON = require('graphql-type-json');

// The GraphQL schema in string form
const typeDefs = `
  input RewardHistoryInput {
    type: String,
    userTopicId: String,
    points:Int,

  }

  extend type Query { getUserPoint(userId: String): UserPoint }
  extend type Query { details(userId: ID!): UserPoint }
  extend type Mutation { addRewardHistory(rewardHistory: RewardHistoryInput!): RewardHistory }



  
  type RewardHistory {
    _id: String,
    userId: String,
    type: String,
    topicId: String,
    timeRewarded: String

  }
  type UserPoint{
  _id: String,
  point: Int,
  details:[
  RewardHistory
  ]
  
  }
`;

// The resolvers
const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    getUserPoint: async (parent, args) => {
      return await rewardService.getUserPoint(args.userId);
    },
  },
  UserPoint:{ details: async (parent, args) => {
    return await rewardService.getDetail(parent._id);
  }},
  Mutation: {
    addRewardHistory: async (parent, args, context) => {
      const rewardHistory = args.rewardHistory;
      rewardHistory.userId = context.auth.credentials.uid;

      return await rewardService.addRewardHistory(rewardHistory.userId,args.rewardHistory);
    },
  }

};

module.exports = {
  typeDefs,
  resolvers
}
