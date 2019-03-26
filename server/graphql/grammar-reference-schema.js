const GrammarReferenceService = require('../services/grammar-reference.service');

// The GraphQL schema in string form
const typeDefs = `
  extend type Query { grammarReference(id: Int!): GrammarReference }
  type GrammarReference {
    _id: Int,
    name: String,
    bodyText: String,
    hideHeading: Int
  }
  

`;
// The resolvers
const resolvers = {
  Query: {
    grammarReference: async (parent, args) => {
      return await GrammarReferenceService.getOneGrammarReference(args.id);
    }
  },
  // Mutation for administrator
};

module.exports = {
  typeDefs,
  resolvers
}
