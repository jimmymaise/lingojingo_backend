const quizService = require('../services/quiz.service');

// The GraphQL schema in string form
const typeDefs = `
  extend type Query { card(id: ID!): Card }
  type Card {
    _id: String,
    cardId: Int,
    voca: String,
    transcript: String,
    img: [String],
    audio: String,
    type: String,
    meaning: String,
    sample: [String],
    enmeaning: String
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
