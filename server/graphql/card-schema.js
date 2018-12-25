const cardService = require('../services/card.service');

// The GraphQL schema in string form
const typeDefs = `
  extend type Query { card(id: ID!): Card }
  
  extend type Mutation { createOneCard(input: CardInput): Card }
  extend type Mutation { updateOneCard(_id: ID!,input: CardInput): Card }
  extend type Mutation { deleteOneCard(_id: ID!): Card }

  input CardInput {
    description: String,
    voca: String,
    transcript: String,
    img: [String],
    ukAudio: String,
    usAudio: String,
    type: String,
    viMeaning: String,
    enMeaning: String,
    sample: [JSON]
  }
  
  type Card {
    _id: String,
    description: String,
    voca: String,
    transcript: String,
    img: [String],
    ukAudio: String,
    usAudio: String,
    type: String,
    viMeaning: String,
    enMeaning: String,
    sample: [CardSample]
  }
  
  type CardSample {
    phrases: String,
    phraseAudio: String,
    sentence: String,
    translate: String,
    img: String,
    ukAudio: String,
    usAudio: String

  }
`;

// The resolvers
const resolvers = {
  Query: {
    card: async (parent, args) => {
      return await cardService.getOneCard(args.id);
    }
  },
  // Mutation for administrator
  Mutation: {
    updateOneCard: async (parent, args) => {
      return await cardService.updateOneCard(args._id, args.input);
    },
    createOneCard: async (parent, args) => {
      return await cardService.createOneCard(args.input);
    },
    deleteOneCard: async (parent, args) => {
      return await cardService.deleteOneCard(args._id);
    },
  },

};

module.exports = {
  typeDefs,
  resolvers
}
