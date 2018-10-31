const userItemService = require('../services/user-item.service');
const userStatisticsService = require('../services/user-statistics.service');

const GraphQLJSON = require('graphql-type-json');

// The GraphQL schema in string form
const typeDefs = `

  input UserItemSearchInput {
    name: String,
    itemType: String,
    userId: String,
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
    userItemSearch(search: UserItemSearchInput, pagination: PaginationInput): UserItemPagination,
    myUserItemSearch(search: UserItemSearchInput, pagination: PaginationInput): UserItemPagination,
    getUserItemDetail(id: ID!): UserItem,
  }

  extend type Mutation { createUserItem(userId: String, itemId: String, itemId: String, latestStudy: JSON): UserItem }
  extend type Mutation { updateUserItem(id: ID!, completedTopics: JSON, exams: JSON, latestStudy: JSON): UserItem }
  extend type Mutation { deleteUserItem(id: ID!): UserItem}

  type UserItem {
    _id: String,
    userId: String,
    itemId: String,
    favorite: Int,
    itemInfo: JSON,
    completedTopics: JSON,
    wordStatistics: WordStatistics,
    createdAt:String,
    expiredAt:String
  }
    type UserItemSummary {
    _id: String,
    userId: String,
    itemId: String,
    favorite: Int,
    wordStatistics: WordStatistics,
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
    userItemSearch: async (parent, args, context) => {
      return await userItemService.searchUserItem(args);
    },
    myUserItemSearch: async (parent, args, context) => {
      args['search']['userId'] = context.request.auth.credentials.uid;
      return await userItemService.searchUserItem(args);
    }
  },
  UserItem:
    {
      wordStatistics: async (parent, args) => {
        //Thống kê từ đang học, chưa học, đã học cho 1 item cụ thể của user

        let queryData = {}
        queryData.itemId = parent.itemId
        queryData.userId = parent.userId

        let data = await userStatisticsService.getWordStatics(queryData);
        return data[0]
      }
    },
  Mutation: {
    createUserItem: async (parent, args) => {
      return await userItemService.addOneUserItem(args
      );
    },
    updateUserItem: async (parent, args) => {
      return await userItemService.updateOneUserItem(args
      );
    },
    deleteUserItem: async (parent, args) => {
      return await userItemService.deleteOneUserItem(args.id
      );
    },
  },
};

module.exports = {
  typeDefs,
  resolvers
}
