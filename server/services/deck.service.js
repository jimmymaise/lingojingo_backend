'use strict';

const Async = require('async');
const ObjectID = require('mongodb').ObjectID;
const sortBy = require('lodash/sortBy');
const map = require('lodash/map');
const reduce = require('lodash/reduce');

const UserInfo = require('../models/user-info');
const Deck = require('../models/deck');
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

// TODO: please protect user don't have permission in this deck
internals.getListTopicDetail = async (firebaseUId, topics) => {
  const topicMapping = reduce(topics, (result, value) => {
    result[value._id] = value;
    return result;
  }, {});

  const ids = map(topics, (topic) => ObjectID(topic._id));

  const results = await Topic.find({_id: {$in: ids}});
  const sortedResult =  sortBy(results, (topic) => topicMapping[topic._id] && topicMapping[topic._id].order);

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

exports.register = function (server, options) {

  server.expose('getListTopicDetail', internals.getListTopicDetail);
  server.expose('buyDeck', internals.buyDeck);
  server.expose('getDeck', internals.getDeck);
  server.expose('getListCardDetail', internals.getListCardDetail);
  server.expose('getOneTopic', internals.getOneTopic);

  return;
};

exports.getListTopicDetail = internals.getListTopicDetail;
exports.buyDeck = internals.buyDeck;
exports.getDeck = internals.getDeck;
exports.getListCardDetail = internals.getListCardDetail;
exports.getOneTopic = internals.getOneTopic;

exports.name = 'deck-service';
