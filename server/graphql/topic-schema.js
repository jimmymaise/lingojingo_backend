const deckService = require('../services/deck.service');
const topicService = require('../services/topic.service');
const redis = require('../redis/connection').client;


// The GraphQL schema in string form
const typeDefs = `
  extend type Query { topic(id: ID!): Topic }
  type Topic {
    _id: String,
    topic: String,
    description: String,
    tags: [String],
    img: String,
    tag: String,
    deck: String,
    cards: [String],
    cardDetails: [Card]
  }
  
  extend type Mutation { createOneTopic(input: TopicInput): Topic }
  extend type Mutation { updateOneTopic(_id: ID!,input: TopicInput): Topic }
  extend type Mutation { deleteOneTopic(_id: ID!): Topic }

  input TopicInput {
    topic: String,
    description: String,
    tags: [String],
    img: String,
    tag: String,
    deck: String,
    cards: [String],
    cardDetails: [JSON]
  }
`;

// The resolvers
const resolvers = {
  Query: {
    topic: async (parent, args) => {
      return await topicService.getOneTopic(args.id);
    }
  },
  // Mutation for administrator
  Mutation: {
    updateOneTopic: async (parent, args) => {
      return await topicService.updateOneTopic(args._id, args.input);
    },
    createOneTopic: async (parent, args) => {
      return await topicService.createOneTopic(args.input);
    },
    deleteOneTopic: async (parent, args) => {
      return await topicService.deleteOneTopic(args._id);
    },
  },
  Topic: {
    cardDetails: async (parent, args, context) => {
      let cardDetails = JSON.parse(await redis.hget('TOPIC_TO_CARDS', parent._id.toString()))
      if (cardDetails) {
        console.log("query from db for topic " + parent._id.toString())
        return cardDetails
      }

      cardDetails = await deckService.getListCardDetail(context.request.auth.credentials.uid, parent.cards);
      await redis.hset('TOPIC_TO_CARDS', parent._id.toString(), JSON.stringify(cardDetails))
      return cardDetails

    }
  }
};

module.exports = {
  typeDefs,
  resolvers
}
