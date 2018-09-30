'use strict';

const Async = require('async');
const ObjectID = require('mongodb').ObjectID;
const sortBy = require('lodash/sortBy');
const map = require('lodash/map');
const reduce = require('lodash/reduce');
const UserDeck = require('../models/user-deck');
const _ = require('lodash')

const UserInfo = require('../models/user-info');

const Deck = require('../models/deck');
const DeckCategory = require('../models/deck-category');
const UserTopic = require('../models/user-topic');
// Deck.syncDataES()
// UserTopic.syncDataES()


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
    }, { $set: {
      firebaseUserId: firebaseUId,
      ...currentInfo,

      timeUpdated: new Date()
    }}, {
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

  let body = await Deck.bodyBuilder()
  let search = args.search || {}
  let page = _.get(args, 'pagination.page') || 2
  let limit =_.get(args, 'pagination.limit') || 10
  // let from = size* (page - 1)
  body.page(page)
  body.limit(limit)

  if (search.deckName) {
    // First query the almost match, will have boost score
    // Second query the words but not follow order
    body.orQuery('match_phrase', 'deckName', {query: search.deckName, analyzer: 'deckNameIndexAnalyzer', 'boost': '5'})
    body.orQuery('match', 'deckName', {query: search.deckName, operator: 'and'})
    body.queryMinimumShouldMatch(1)
  }
  if (search.categoryId) {
    body.query('match', 'category.id', search.categoryId)
  }

  let data = await Deck.searchWithBodyBuilder()

  return data



}

internals.isOwned = async (userInfo, deckId) => {

  return userInfo && userInfo.decks && userInfo.decks.indexOf(deckId.toString()) >= 0

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
  if (typeof id === 'string' || id instanceof String) {

   id =  ObjectID(id)
  }

    let data = await DeckCategory.find({decks: {$elemMatch: {id: id}}});return data[0]
}

//DeckPaginate

internals.getDeckPaginate = async (limit, page) => {
  let _limit = limit || 5;
  let _page = page || 1;
  return await Deck.pagedFind({}, _page, _limit, {});
}

internals.getDeckPaginateMapWithUserInfo = async (firebaseUId, limit, page) => {
  let _limit = limit || 5;
  let _page = page || 1;

  const paginateData = await Deck.pagedFind({}, _page, _limit, {});
  const userInfo = await UserInfo.findOne({
    firebaseUserId: firebaseUId
  });

  forEach(paginateData.data, (deckItem) => {
    if (userInfo && userInfo.decks && userInfo.decks.indexOf(deckItem._id.toString()) >= 0) {
      deckItem.isOwned = true;
    } else {
      deckItem.isOwned = false;
    }
  })

  return paginateData;
}

internals.getUserOwnerDeckPaginate = async (firebaseUId, limit, page) => {
  let _limit = limit || 5;
  let _page = page || 1;

  const userInfo = await UserInfo.findOne({
    firebaseUserId: firebaseUId
  });

  const ids = userInfo && userInfo.decks ? userInfo.decks.map((id) => ObjectID(id)) : [];
  return await Deck.pagedFind({_id: {$in: ids}}, _page, _limit, {});
}



exports.register = function (server, options) {

  server.expose('getListTopicDetail', internals.getListTopicDetail);
  server.expose('buyDeck', internals.buyDeck);
  server.expose('getDeck', internals.getDeck);
  server.expose('searchDeck', internals.searchDeck);

  server.expose('getListCardDetail', internals.getListCardDetail);
  server.expose('getOneTopic', internals.getOneTopic);
  server.expose('getDeckCategory', internals.getDeckCategory);
  server.expose('isOwned', internals.isOwned);

  server.expose('getDeckPaginate', internals.getDeckPaginate);
  server.expose('getDeckPaginateMapWithUserInfo', internals.getDeckPaginateMapWithUserInfo);
  server.expose('getUserOwnerDeckPaginate', internals.getUserOwnerDeckPaginate);


  return;
};

exports.getListTopicDetail = internals.getListTopicDetail;
exports.buyDeck = internals.buyDeck;
exports.getDeck = internals.getDeck;
exports.getListCardDetail = internals.getListCardDetail;
exports.getOneTopic = internals.getOneTopic;
exports.getDeckCategory = internals.getDeckCategory;
exports.searchDeck = internals.searchDeck;
exports.isOwned = internals.isOwned;

exports.getDeckPaginate = internals.getDeckPaginate;
exports.getDeckPaginateMapWithUserInfo = internals.getDeckPaginateMapWithUserInfo;
exports.getUserOwnerDeckPaginate = internals.getUserOwnerDeckPaginate;





exports.name = 'deck-service';
