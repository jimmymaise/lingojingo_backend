const GrammarGroupService = require('../services/grammar-group.service');


// The GraphQL schema in string form
const typeDefs = `
  extend type Query { grammarGroup(id: ID!): GrammarGroup }
  type GrammarGroup {
    _id: String,
    name: String,
    img: String,
    order: Int,
    units:[Int],
    unitDetails: [GrammarUnit]
  }
  

`;

// The resolvers
const resolvers = {
  Query: {
    grammarGroup: async (parent, args) => {
      return await GrammarGroupService.getOneGrammarGroup(args.id);
    }
  },
  // Mutation for administrator

  GrammarGroup: {
    unitDetails: async (parent, args, context) => {
      return await GrammarGroupService.getListUnitDetail(context.request.auth.credentials.uid, parent.units);
    }
  }
};

module.exports = {
  typeDefs,
  resolvers
}
