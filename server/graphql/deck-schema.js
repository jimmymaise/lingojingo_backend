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
    description: String,
    total: Int,
    mainLevel: Int,
    tags: [String],
    topics: [JSON],
    name: String,
    isOwned: Boolean,
    img: String,
    topicDetails: [Topic],
    cardDetails: [Card],
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
  
  extend type Mutation { createOneDeck(input: DeckInput): Deck }
  extend type Mutation { updateOneDeck(_id: ID!,input: DeckInput): Deck }
  extend type Mutation { deleteOneDeck(_id: ID!): Deck }
  
  input DeckInput {
  description: String,
  total: Int,
  mainLevel: Int,
  tags: [String],
  topics: [JSON],
  name: String,
  isOwned: Boolean,
  img: String,
  topicDetails: [JSON],
  cardDetails: [JSON],
  category: JSON,
  passScore: String
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
      return await deckService.searchDeck(args);

    },
  },
  // Mutation for administrator
  Mutation: {
    updateOneDeck: async (parent, args) => {
      return await deckService.updateOneDeck(args._id, args.input);
    },
    createOneDeck: async (parent, args) => {
      return await deckService.createOneDeck(args.input);
    },
    deleteOneDeck: async (parent, args) => {
      return await deckService.deleteOneDeck(args._id);
    },
  },
  Deck: {
    topicDetails: async (parent, args, context) => {
      return await deckService.getListTopicDetail(context.request.auth.credentials.uid, parent.topics);
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
