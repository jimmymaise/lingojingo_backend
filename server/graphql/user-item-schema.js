const userItemService = require('../services/user-item.service');
const userStatisticsService = require('../services/user-statistics.service');

const GraphQLJSON = require('graphql-type-json');

// The GraphQL schema in string form
const typeDefs = `

  input UserItemSearchInput {
    name: String,
    itemType: String,
    userId: String,
    favorite: Int
  }

  input MyUserItemSearchInput {
    name: String,
    itemType: String,
  }

  type UserItemPagination {
    data: [UserItemSummary],
    pages: PageInfo,
    items: PageItemInfo
  }
 
  extend type Query {
    getMyUserItemByItemId(itemId: ID!, itemType: String!): UserItem,
    myUserItemSearch(search: UserItemSearchInput, pagination: PaginationInput): UserItemPagination,
    getUserItemDetail(id: ID!): UserItem,
  }

  extend type Mutation { createMyUserItem(itemId: String!, itemType: String!, latestStudy: JSON): UserItem }

  extend type Mutation { updateMyUserItem(id: ID!, favorite: Int, studyTopics: JSON, exams: JSON, latestStudy: JSON): UserItem }
  
  extend type Mutation { deleteMyUserItem(_id: ID!): UserItem}

  type UserItem {
    _id: String,
    userId: String,
    itemId: String,
    favorite: Int,
    itemInfo: JSON,
    studyTopics: JSON,
    createdAt:String,
    expiredAt:String
  }

  type UserItemSummary {
    _id: String,
    userId: String,
    itemId: String,
    itemType: String,
    favorite: Int,
    createdAt: String,
    expiredAt: String,
    itemInfo: JSON
  }
`;

// The resolvers
const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    getUserItemDetail: async (parent, args) => {
      return await userItemService.getOneUserItem(args.id);
    },
    getMyUserItemByItemId: async (parent, args, context) => {
      return await userItemService.getOneMyUserItemByItemId(context.request.auth.credentials.uid, args.itemId, args.itemType);
    },
    // userItemSearch: async (parent, args, context) => {
    //   return await userItemService.searchUserItem(args);
    // },
    myUserItemSearch: async (parent, args, context) => {
      args['search']['userId'] = context.request.auth.credentials.uid;
      return await userItemService.searchUserItem(args);
    }
  },
  Mutation: {
    createMyUserItem: async (parent, args, context) => {
      args.userId = context.request.auth.credentials.uid;
      return await userItemService.addOneUserItem(args
      );
    },
    updateMyUserItem: async (parent, args, context) => {
      args.userId = context.request.auth.credentials.uid;
      return await userItemService.updateOneUserItem(args
      );
    },
    deleteMyUserItem: async (parent, args, context) => {
      args.userId = context.request.auth.credentials.uid;
      return await userItemService.deleteOneUserItem(args.id
      );
    },
  },
};

module.exports = {
  typeDefs,
  resolvers
}
