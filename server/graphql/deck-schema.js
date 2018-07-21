const quizService = require('../services/quiz.service');
const deckService = require('../services/deck.service');

// The GraphQL schema in string form
const typeDefs = `
  type DeckPagination {
    data: [Deck],
    pages: PageInfo,
    items: PageItemInfo
  }
  type Deck {
    _id: String,
    deck: String,
    topics: [String],
    cards: [String],
    tags: [String],
    deckName: String,
    isOwned: Boolean,
    img: String,
    topicDetails: [Topic],
    cardDetails: [Card],
    topicExamQuestions: String,
    reviewExamQuestions: String,
    finalExamQuestions: String,
    passScore: String
  }
  extend type Query {
    decks(pagination: PaginationInput): DeckPagination
    userStoreDecks(pagination: PaginationInput): DeckPagination,
    userOwnerDecks(pagination: PaginationInput): DeckPagination,
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
    }
  },
  Deck: {
    topicDetails: async (parent, args, context) => {
      return await deckService.getListTopicDetail(context.auth.credentials.uid, parent.topics);
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
