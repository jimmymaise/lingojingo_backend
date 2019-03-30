const QuoteService = require('../services/quote.service');

// The GraphQL schema in string form
const typeDefs = `
  extend type Query { 
       randomQuotes(total:Int): [Quote]

   }
  type Quote {
    _id: String,
    content: String,
    topics: [String],
    vietnamese: String,
    author: String,


  }
  

`;
// The resolvers
const resolvers = {
  Query: {
    randomQuotes: async (parent, args) => {
      return await QuoteService.getRandomQuote(args.total||100);
    }
  },
  // Mutation for administrator
};

module.exports = {
  typeDefs,
  resolvers
}
