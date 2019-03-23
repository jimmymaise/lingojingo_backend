const grammarUnitService = require('../services/grammar-unit.service');


// The GraphQL schema in string form
const typeDefs = `
  extend type Query { grammarUnit(id: ID!): GrammarUnit }
  type GrammarUnit {
    _id: String,
    name: String,
    img: String,
    sections: [String],
    groupId: Int,
    type: String,
    order: Int,
    sectionDetails: [GrammarSection],
 
  }
  

`;

// The resolvers
const resolvers = {
  Query: {
    grammarUnit: async (parent, args) => {
      return await grammarUnitService.getGrammarUnit(args.id);
    }
  },
  // Mutation for administrator

  GrammarUnit: {
    sectionDetails: async (parent, args, context) => {
      return await grammarUnitService.getListSectionDetail(context.request.auth.credentials.uid, parent.sections);
    }
  }
};

module.exports = {
  typeDefs,
  resolvers
}
