const rewardService = require('../services/reward.service');
const GraphQLJSON = require('graphql-type-json');

// The GraphQL schema in string form
const typeDefs = `
  input RewardHistoryInput {
    userId: String,
    type: String,
    userTopicId: String,
    points:Int,

  }

  extend type Query { getPoint(id: ID!): Point }
  extend type Query { getUserPoints(userId: ID!): UserTotalPoints }

  extend type Mutation { createPoint(point: PointInput!): Point }
  extend type Mutation { deletePoint(id: ID!): Point}
  
  
  type RewardHistory {
    _id: String,
    userId: String,
    type: String,
    topicId: String,
    point: Int,

  }
  type UserTotalPoints{
  userId: String,
  totalPoints: Int,
  details:[
  RewardHistory
  ]
  
  }
`;

// The resolvers
const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    getUserPointSummary: async (parent, args) => {
      return await rewardService.getUserPointSummary(args.userId);
    }
  },
  Mutation: {
    createPoint: async (parent, args, context) => {
      const point = args.point;
      point.userId = context.auth.credentials.uid;

      return await pointService.addOnePoint(point);
    },
    updatePoint: async (parent, args) => {
      // Tam thời ko cho update point
      return null;
      // return await pointService.updateOnePoint(args);
    },
    deletePoint: async (parent, args) => {
      // Tạm thời ko cho delete point
      return null;
      // return await pointService.deleteOnePoint(args.id);
    },
  }

};

module.exports = {
  typeDefs,
  resolvers
}
