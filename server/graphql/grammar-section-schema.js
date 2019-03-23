const grammarSectionService = require('../services/grammar-section.service');


// The GraphQL schema in string form
const typeDefs = `
  extend type Query { grammarSection(id: ID!): GrammarSection }
  type GrammarSection {
    _id: Int,
    name: String,
    img: String,
    section: String,
    type: String,
    exercise: [String]
    exerciseDetail: [GrammarExercise]
 
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
    exerciseDetail: async (parent, args, context) => {
      return await grammarSectionService.getListExerciseDetail(context.request.auth.credentials.uid, parent.exercises);
    }
  }
};

module.exports = {
  typeDefs,
  resolvers
}
