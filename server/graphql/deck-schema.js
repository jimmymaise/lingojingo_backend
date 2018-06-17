const quizService = require('../services/quiz.service');

// The GraphQL schema in string form
const typeDefs = `
  type DeckPagination {
    data: [Deck],
    pages: PageInfo,
    items: PageItemInfo
  }
  extend type Query {
    decks(pagination: PaginationInput): DeckPagination
    userStoreDecks(pagination: PaginationInput): DeckPagination
  }
  type Deck {
    _id: String,
    deck: String,
    topics: [String],
    cards: [String],
    tags: [String],
    deckName: String,
    isOwned: Boolean
  }
`;

// The resolvers
const resolvers = {
  Query: { 
    decks: async (parent, args) => {
      const { limit, page } = args.pagination || {};

      return await quizService.getDeckPaginate(limit, page);
    },
    userStoreDecks: async (parent, args, context) => {
      const { limit, page } = args.pagination || {};

      return await quizService.getDeckPaginateMapWithUserInfo(context.auth.credentials.uid, limit, page);
    }
  },
};

module.exports = {
  typeDefs,
  resolvers
}
