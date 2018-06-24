const quizService = require('../services/quiz.service');
const GraphQLJSON = require('graphql-type-json');

// The GraphQL schema in string form
const typeDefs = `
  scalar JSON
 
  extend type Query { userTopic(id: ID!): UserTopic }
  extend type Mutation { userTopic(userId:String,deckId:String,topicId:String,filterKnownCard:JSON,exams:[String],highestResult:JSON): UserTopic }
  type UserTopic {
    _id: String,
    userId: String,
    deckId: String,
    topicId:String,
    exams: [String],
    filterKnownCard:JSON,
    highestResult:JSON
    }
    type HighestResult {
    examId: String,
    result: Int,
    }

`;

// The resolvers
const resolvers = {
    JSON: GraphQLJSON,
    Query: {
        userTopic: async (parent, args) => {
            return await quizService.getOneUserTopic(args.id);
        }
    },
    Mutation: {
        userTopic: async (parent, args) => {
            return await quizService.addOneUserTopic(args.userId, args.topicId, args.deckId, args.filterKnownCard,
                args.exams, args.highestResult
            );
        }
    }

};

module.exports = {
    typeDefs,
    resolvers
}
