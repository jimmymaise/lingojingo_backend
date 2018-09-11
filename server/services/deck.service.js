'use strict';

const Async = require('async');
const ObjectID = require('mongodb').ObjectID;
const sortBy = require('lodash/sortBy');
const map = require('lodash/map');
const reduce = require('lodash/reduce');
const UserDeck = require('../models/user-deck');

const UserInfo = require('../models/user-info');

const Deck = require('../models/deck');
const DeckCategory = require('../models/deck-category');

const Topic = require('../models/topic');
const Card = require('../models/card');

const internals = {};

internals.buyDeck = async (firebaseUId, deckId) => {
  const deckFound = await Deck.findById(deckId);

  if (deckFound) {
    const currentInfo = await UserInfo.findOne({
      firebaseUserId: firebaseUId
    });

    if (!currentInfo) {
      throw Error('Not Found');
    }

    delete currentInfo['_id'];
    if (!currentInfo.decks) {
      currentInfo.decks = [];
    }

    if (currentInfo.decks.indexOf(deckId) < 0) {
      currentInfo.decks.push(deckId);
    } else {
      return currentInfo;
    }
    let addUserDeckResult = await UserDeck.insertOne({"userId": firebaseUId, "deckId": deckId});

    if (!addUserDeckResult) {
      throw Error('Cannot Add UserDeck');
    }

    return await UserInfo.findOneAndUpdate({
      firebaseUserId: firebaseUId
    }, {
      firebaseUserId: firebaseUId,
      ...currentInfo,

      timeUpdated: new Date()
    }, {
      upsert: true,
      setDefaultsOnInsert: true
    });
  }

  throw Error('Not Found');
}

internals.getDeck = async (firebaseUId, deckId) => {
  return await Deck.findById(deckId);
}

internals.searchDeck = async (args) => {
  let body = Deck.bodyBuilder()
  if (args.deckName) {
    body.query('match', 'deckName', args.deckName)
  }
  if (args.deckId) {
    body.query('match', 'category', args.category)
  }
  body.build()
  await Deck.search(Deck)
  return await Deck.findById(deckId);
}


// TODO: please protect user don't have permission in this deck
internals.getListTopicDetail = async (firebaseUId, topics) => {
  const topicMapping = reduce(topics, (result, value) => {
    result[value._id] = value;
    return result;
  }, {});

  const ids = map(topics, (topic) => ObjectID(topic._id));

  const results = await Topic.find({_id: {$in: ids}});
  const sortedResult = sortBy(results, (topic) => topicMapping[topic._id] && topicMapping[topic._id].order);

  return sortedResult;
}

// TODO: please protect user don't have permission in this deck
internals.getListCardDetail = async (firebaseUId, cardIds) => {
  const ids = cardIds.map((id) => ObjectID(id));
  return await Card.find({_id: {$in: ids}});
}
internals.getOneTopic = async (id) => {
  return await Topic.findById(id);
}

internals.getDeckCategory = async (id) => {
  let data = await DeckCategory.find({decks: {$elemMatch: {id: id}}});
  return data[0]
}


exports.register = function (server, options) {

  server.expose('getListTopicDetail', internals.getListTopicDetail);
  server.expose('buyDeck', internals.buyDeck);
  server.expose('getDeck', internals.getDeck);
  server.expose('getListCardDetail', internals.getListCardDetail);
  server.expose('getOneTopic', internals.getOneTopic);
  server.expose('getDeckCategory', internals.getDeckCategory);


  return;
};

exports.getListTopicDetail = internals.getListTopicDetail;
exports.buyDeck = internals.buyDeck;
exports.getDeck = internals.getDeck;
exports.getListCardDetail = internals.getListCardDetail;
exports.getOneTopic = internals.getOneTopic;
exports.getDeckCategory = internals.getDeckCategory;


exports.name = 'deck-service';
