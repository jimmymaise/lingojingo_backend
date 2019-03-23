const GrammarGroupService = require('../services/grammar-group.service');


// The GraphQL schema in string form
const typeDefs = `
  extend type Query { 
      grammarGroup(id: Int!): GrammarGroup ,
      grammarGroups(pagination: PaginationInput): GrammarGroupPagination,
  }
  type GrammarGroup {
    _id: Int,
    name: String,
    img: String,
    order: Int,
    units:[Int],
    unitDetails: [GrammarUnitSummary]
  }
   type GrammarGroupPagination {
    data: [GrammarGroup],
    pages: PageInfo,
    items: PageItemInfo
  }
  

`;

// The resolvers
const resolvers = {
  Query: {
    grammarGroup: async (parent, args) => {
      return await GrammarGroupService.getOneGrammarGroup(args.id);
    },
    grammarGroups: async (parent, args) => {
      const {limit, page} = args.pagination || {};

      return await GrammarGroupService.getGrammarGroupPaginate(limit, page);
    },
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
