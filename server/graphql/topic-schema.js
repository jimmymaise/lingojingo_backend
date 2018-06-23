const deckService = require('../services/deck.service');

// The GraphQL schema in string form
const typeDefs = `
  extend type Query { topic(id: ID!): Topic }
  type Topic {
    _id: String,
    topic: String,
    img: String,
    tag: String,
    deck: String,
    cards: [String],
    cardDetails: [Card]
  }
`;

// The resolvers
const resolvers = {
  Query: {
    topic: async (parent, args) => {
      return await deckService.getOneTopic(args.id);
    }
  },
  Topic: {
    cardDetails: async (parent, args, context) => {
      return await deckService.getListCardDetail(context.auth.credentials.uid, parent.cards);
    }
  }
};

module.exports = {
  typeDefs,
  resolvers
}
