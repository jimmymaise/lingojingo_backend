const quizService = require('../services/quiz.service');

// The GraphQL schema in string form
const typeDefs = `
  type DeckPagination {
    data: [Deck],
    pages: PageInfo,
    items: PageItemInfo
  }
  extend type Query {
    decks(pagination: PaginationInput!): DeckPagination
  }
  type Deck {
    deck: String,
    images: [String],
    cards: [Int],
    tags: [String],
    deckName: String
  }
`;

// The resolvers
const resolvers = {
  Query: { 
    decks: async (parent, args) => {
      const { limit, page } = args.pagination || {};
      return await quizService.getDeckPaginate(limit, page);
    }
  },
};

module.exports = {
  typeDefs,
  resolvers
}
