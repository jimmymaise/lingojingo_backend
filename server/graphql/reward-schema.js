const rewardService = require('../services/reward.service');
const GraphQLJSON = require('graphql-type-json');

// The GraphQL schema in string form
const typeDefs = `
  input RewardEventInput {
    type: String,
    userTopicId: String,
    points:Int,

  }

  extend type Query { getUserPoint(userId: String): UserPoint }
  extend type Query { details(userId: ID!): UserPoint }
  extend type Mutation { addRewardEvent(rewardEvent: RewardEventInput!): RewardEvent }



  
  type RewardEvent {
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
  RewardEvent
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
    addRewardEvent: async (parent, args, context) => {
      const rewardEvent = args.rewardEvent;
      rewardEvent.userId = context.auth.credentials.uid;
      rewardEvent.timeRewarded = new Date();


      return await rewardService.addRewardEvent(rewardEvent.userId,args.rewardEvent);
    },
  }

};

module.exports = {
  typeDefs,
  resolvers
}
