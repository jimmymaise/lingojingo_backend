const leaderBoardService = require('../services/leader-board.service');
const GraphQLJSON = require('graphql-type-json');
//db.getCollection("user_exams").find({deckId:'5b1bfc365c44cc013e87280b',topicId:'5b1bf1615c44cc013e872289'}).sort({score:-1}).limit(5).toArray()
// The GraphQL schema in string form
const typeDefs = `
  extend type Query {
    getLeaderBoardTopic(topicId: String!,cardId:String!,top:Int): [LeaderBoard]
  }
  
  type LeaderBoard {
    userId: String,
    topicId: String,
    deckId: String,
    examId: String,
    score: Int,
    correctAns: Int,
    totalQuestion: Int,
    timeSpentAvg: Int,

}
 
`;

// The resolvers
const resolvers = {
  JSON: GraphQLJSON,
  Query: {
    getLeaderBoard: async (parent, args) => {
      return await leaderBoardService.getLeaderBoard(args);
    },
  }
};

module.exports = {
  typeDefs,
  resolvers
}
