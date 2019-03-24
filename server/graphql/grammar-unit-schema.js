const grammarUnitService = require('../services/grammar-unit.service');


// The GraphQL schema in string form
const typeDefs = `
  extend type Query { 
    grammarUnit(id: Int!): GrammarUnit 
     grammarUnitSearch(search: GrammarUnitSearchInput, pagination: PaginationInput): GrammarUnitPagination,
  }
  input GrammarUnitSearchInput {
    name: String,
    }
  type GrammarUnitPagination {
    data: [GrammarUnit],
    pages: PageInfo,
    items: PageItemInfo
  }
  type EsGrammarUnitList {
  offset: Int,
  start: Int,
  data:[GrammarUnit]
  }
  type GrammarUnit {
    _id: String,
    name: String,
    img: String,
    sections: [String],
    groupId: Int,
    type: String,
    order: Int,
    relatedUnits: [String],
    sectionDetails: [GrammarSection],
 
  }
    type GrammarUnitSummary {
    _id: String,
    name: String,
    img: String,
    groupId: Int,
    type: String,
    order: Int,
 
  }
  
  

`;

// The resolvers
const resolvers = {
  Query: {
    grammarUnit: async (parent, args) => {
      return await grammarUnitService.getGrammarUnit(args.id);

    },
    grammarUnitSearch: async (parent, args, context) => {
      return await grammarUnitService.searchGrammarUnit(args);

    },
  },
  // Mutation for administrator

  GrammarUnit: {
    sectionDetails: async (parent, args, context) => {
      return await grammarUnitService.getListSectionDetail(context.request.auth.credentials.uid, parent.sections);
    },
    
  }
};

module.exports = {
  typeDefs,
  resolvers
}
