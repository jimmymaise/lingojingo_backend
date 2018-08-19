const quizService = require('../services/quiz.service');

// The GraphQL schema in string form
const typeDefs = `
  extend type Query { card(id: ID!): Card }
  type Card {
    _id: String,
    voca: String,
    transcript: String,
    img: [String],
    ukAudio: String,
    usAudio: String,
    type: String,
    viMeaning: String,
    enMeaning: String,
    sample: [CardSample]
  },
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
      return await quizService.getOneCard(args.id);
    }
  },
};

module.exports = {
  typeDefs,
  resolvers
}
