const quizService = require('../services/quiz.service');
const deckService = require('../services/deck.service');
const userStatisticsService = require('../services/user-statistics.service');
const UserInfo = require('../models/user-info');
const UserItem = require('../models/user-item');


// The GraphQL schema in string form
const typeDefs = `
  input DeckSearchInput {
    name: String,
    categoryId: [Int],
    mainLevel: [Int],
    }
  type DeckPagination {
    data: [Deck],
    pages: PageInfo,
    items: PageItemInfo
  }
  type EsDeckList {
  offset: Int,
  start: Int,
  data:[Deck]
  
  }
  type Deck {
    _id: String,
    total: Int,
    mainLevel: Int,
    tags: [String],
    topics: [JSON],
    name: String,
    isOwned: Boolean,
    img: String,
    topicDetails: [Topic],
    cardDetails: [Card],
    wordStatistics:WordStatistics,
    category: DeckCategory,
    passScore: String
  }
  extend type Query {
    decks(pagination: PaginationInput): DeckPagination
    userStoreDecks(pagination: PaginationInput): DeckPagination,
    userOwnerDecks(pagination: PaginationInput): DeckPagination,
    deckSearch(search: DeckSearchInput, pagination: PaginationInput): DeckPagination,
    deck(id: ID!): Deck
  }
`;

// The resolvers
const resolvers = {
  Query: {
    decks: async (parent, args) => {
      const {limit, page} = args.pagination || {};

      return await deckService.getDeckPaginate(limit, page);
    },

    deck: async (parent, args, context) => {
      return await deckService.getDeck(context.request.auth.credentials.uid, args.id);
    },
    deckSearch: async (parent, args, context) => {
      context['userInfo'] = await UserInfo.findOne({
        firebaseUserId: context.request.auth.credentials.uid
      });
      return await deckService.searchDeck(args);

    },
  },
  Deck: {
    topicDetails: async (parent, args, context) => {
      return await deckService.getListTopicDetail(context.request.auth.credentials.uid, parent.topics);
    },
    wordStatistics: async (parent, args, context) => {
      let queryData = {}
      queryData.deckId = parent._id
      queryData.userId = context.request.auth.credentials.uid

      data = await userStatisticsService.getWordStatics(queryData);
      return data[0]
      // return await deckService.getListTopicDetail(context.request.auth.credentials.uid, parent.topics);
    },

    category: async (parent, args, context) => {
      if (parent.category) {
        return parent.category
      }
      data = await deckService.getDeckCategory(parent._id);
      return data
    },
    isOwned: async (parent, args, context) => {
      let userItem = await UserItem.findOne({
        userId: context.request.auth.credentials.uid,
        itemType: 'deck',
        itemId: parent._id
      });

      return !!userItem;
    },
    cardDetails: async (parent, args, context) => {
      return await deckService.getListCardDetail(context.request.auth.credentials.uid, parent.cards);
    }
  }
};

module.exports = {
  typeDefs,
  resolvers
}
