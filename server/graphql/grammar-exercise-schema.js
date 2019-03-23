const GrammarExerciseService = require('../services/grammar-exercise.service');

// The GraphQL schema in string form
const typeDefs = `
  extend type Query { grammarExercise(id: ID!): GrammarExercise }
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
