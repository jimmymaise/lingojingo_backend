const GrammarExerciseService = require('../services/grammar-exercise.service');

// The GraphQL schema in string form
const typeDefs = `
  extend type Query { grammarExercise(id: Int!): GrammarExercise }
  type GrammarExercise {
    _id: Int,
    coreAnswers: [JSON],
    rubric: String,
    referenceExercise: String,
    engine: String,
    name: String,
    carouselOneOptions: [JSON],
    carouselTwoOptions: [JSON],
    carouselThreeOptions: [JSON],
    questions: [JSON],
    gridReference: String,
    leftLabel: String,
    rightLabel: String

  }
  

`;
// The resolvers
const resolvers = {
  Query: {
    grammarExercise: async (parent, args) => {
      return await GrammarExerciseService.getOneGrammarExcercise(args.id);
    }
  },
  // Mutation for administrator
};

module.exports = {
  typeDefs,
  resolvers
}
