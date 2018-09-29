'use strict';


const Card = require('../models/card');
const Deck = require('../models/deck');
const UserInfo = require('../models/user-info');
const UserTopic = require('../models/user-topic');
const UserDeck = require('../models/user-deck');
const _ = require('lodash');
const internals = {};

internals.getOneCard = async (id) => {
  return await Card.findById(id);
}

//Topic

internals.getOneUserTopic = async (id) => {
  return await UserTopic.findById(id);
}

internals.getUserTopicByDeckAndTopic = async (userId, deckId, topicId) => {
  return await UserTopic.findOne({
    userId,
    deckId,
    topicId
  });
}

internals.addOneUserTopic = async (userId, userTopicData) => {
  let topicData = await Deck.findById(userTopicData.topicId)

  userTopicData.topicType = topicData.type

  let result = await UserTopic.insertOne({
    userId,
    ...userTopicData
  });

  return result[0]
}

internals.createOrUpdateUserTopic = async (userId, userTopicData) => {
  const {deckId, topicId, exams, currentStudyMode, filterKnownCard, highestResult, knownAnswer} = userTopicData;

  let result = await UserTopic.findOneAndUpdate({
    userId,
    deckId,
    topicId
  }, {
    $set: {
      userId,
      deckId,
      topicId,
      exams: exams || [],
      currentStudyMode,
      filterKnownCard: filterKnownCard || {},
      highestResult,
      knownAnswer: knownAnswer || {}
    }
  }, {
    upsert: true
  });

  return result;
}

internals.deleteOneUserTopic = async (id) => {
  let result = await UserTopic.findByIdAndDelete(id);

  if (!result) {
    result = {
      _id: null
    };
  }

  return result
}

internals.updateOneUserTopic = async (args) => {

  let id = args.id
  let updateObj = _.cloneDeep(args)
  delete updateObj['id']
  let result = await UserTopic.findByIdAndUpdate(
    id, {$set: updateObj});
  return result

}


//User Deck

internals.getOneMyUserDeckByDeckId = async (userId, deckId) => {
  return await UserDeck.findOne({
    userId,
    deckId
  });
}

internals.getOneUserDeck = async (id) => {
  return await UserDeck.findById(id);
}

internals.addOneUserDeck = async (args) => {
  let userInfo = await UserInfo.findById(args.userInfo);
  if (!userInfo.decks || !(args.deckId in userInfo.decks)) {
    throw new Error(`User must own the deck ${args.deckId} to learn it`);

  }
  let result = await UserDeck.insertOne(args);
  return result[0]

}

internals.deleteOneUserDeck = async (id) => {
  let result = await UserDeck.findByIdAndDelete(id);
  if (result === undefined) result = {"_id": null}
  return result
}

internals.updateOneUserDeck = async (args) => {
  let id = args.id
  let updateObj = _.cloneDeep(args)
  delete updateObj['id']
  let result = await UserDeck.findByIdAndUpdate(
    id, {$set: updateObj});
  return result

}

exports.register = function (server, options) {

  server.expose('getOneCard', internals.getOneCard);


  server.expose('getOneUserTopic', internals.getOneUserTopic);
  server.expose('getUserTopicByDeckAndTopic', internals.getUserTopicByDeckAndTopic);
  server.expose('addOneUserTopic', internals.addOneUserTopic);
  server.expose('updateOneUserTopic', internals.updateOneUserTopic);
  server.expose('deleteOneUserTopic', internals.deleteOneUserTopic);


  server.expose('getOneMyUserDeckByDeckId', internals.getOneMyUserDeckByDeckId)
  server.expose('getOneUserDeck', internals.getOneUserDeck);
  server.expose('addOneUserDeck', internals.addOneUserDeck);
  server.expose('updateOneUserDeck', internals.updateOneUserDeck);
  server.expose('deleteOneUserDeck', internals.deleteOneUserDeck);
  server.expose('createOrUpdateUserTopic', internals.createOrUpdateUserTopic);

};


exports.getOneCard = internals.getOneCard;

exports.getOneUserTopic = internals.getOneUserTopic;
exports.getUserTopicByDeckAndTopic = internals.getUserTopicByDeckAndTopic;
exports.addOneUserTopic = internals.addOneUserTopic;
exports.updateOneUserTopic = internals.updateOneUserTopic;
exports.deleteOneUserTopic = internals.deleteOneUserTopic;


exports.getOneMyUserDeckByDeckId = internals.getOneMyUserDeckByDeckId;
exports.getOneUserDeck = internals.getOneUserDeck;
exports.addOneUserDeck = internals.addOneUserDeck;
exports.updateOneUserDeck = internals.updateOneUserDeck;
exports.deleteOneUserDeck = internals.deleteOneUserDeck;
exports.createOrUpdateUserTopic = internals.createOrUpdateUserTopic;


exports.name = 'quiz-service';
