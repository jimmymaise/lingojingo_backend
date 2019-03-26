const grammarSectionService = require('../services/grammar-section.service');


// The GraphQL schema in string form
const typeDefs = `
  extend type Query { grammarSection(id: Int!): GrammarSection }
  type GrammarSection {
    _id: Int,
    name: String,
    description: String,
    heading: String,
    references: [String],
    exercises: [String]
    exerciseDetails: [GrammarExercise]
    explanation: String,
    unitId: Int,
  }
  

`;

// The resolvers
const resolvers = {
  Query: {
    grammarSection: async (parent, args) => {
      return await grammarSectionService.getOneGrammarSection(args.id);
    }
  },
  // Mutation for administrator

  GrammarSection: {
    exerciseDetails: async (parent, args, context) => {
      return await grammarSectionService.getListExerciseDetail(context.request.auth.credentials.uid, parent.exercises);
    }
  }
};

module.exports = {
  typeDefs,
  resolvers
}
