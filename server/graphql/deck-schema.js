const quizService = require('../services/quiz.service');
const deckService = require('../services/deck.service');
const userStatisticsService = require('../services/user-statistics.service');

// The GraphQL schema in string form
const typeDefs = `
  input DeckSearchInput {
    deckSearchName: String,
    categoryId: Int
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
    level: Int,
    tags: [String],
    topics: [JSON],
    deckName: String,
    isOwned: Boolean,
    img: String,
    topicDetails: [Topic],
    cardDetails: [Card],
    wordStatistics:WordStatistics,
    category:DeckCategory,
    topicExamQuestions: String,
    reviewExamQuestions: String,
    finalExamQuestions: String,
    passScore: String
  }
  extend type Query {
    decks(pagination: PaginationInput): DeckPagination
    userStoreDecks(pagination: PaginationInput): DeckPagination,
    userOwnerDecks(pagination: PaginationInput): DeckPagination,
    deckSearch(search: DeckSearchInput): DeckPagination,
    deck(id: ID!): Deck
  }
`;

// The resolvers
const resolvers = {
  Query: {
    decks: async (parent, args) => {
      const {limit, page} = args.pagination || {};

      return await quizService.getDeckPaginate(limit, page);
    },
    userStoreDecks: async (parent, args, context) => {
      const {limit, page} = args.pagination || {};

      return await quizService.getDeckPaginateMapWithUserInfo(context.auth.credentials.uid, limit, page);
    },
    userOwnerDecks: async (parent, args, context) => {
      const {limit, page} = args.pagination || {};

      return await quizService.getUserOwnerDeckPaginate(context.auth.credentials.uid, limit, page);
    },
    deck: async (parent, args, context) => {
      return await deckService.getDeck(context.auth.credentials.uid, args.id);
    },
    deckSearch: async (parent, args, context) => {
      return await deckService.searchDeck(args);
    },
  },
  Deck: {
    topicDetails: async (parent, args, context) => {
      return await deckService.getListTopicDetail(context.auth.credentials.uid, parent.topics);
    },
    wordStatistics: async (parent, args, context) => {
      let queryData = {}
      queryData.deckId = parent._id
      queryData.userId = context.auth.credentials.uid

      data = await userStatisticsService.getWordStatics(queryData);
      return data[0]
      // return await deckService.getListTopicDetail(context.auth.credentials.uid, parent.topics);
    },
    category: async (parent, args, context) => {
      data = await deckService.getDeckCategory(parent._id);
      return data
    },
    cardDetails: async (parent, args, context) => {
      return await deckService.getListCardDetail(context.auth.credentials.uid, parent.cards);
    }
  }
};

module.exports = {
  typeDefs,
  resolvers
}
