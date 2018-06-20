'use strict';

const Async = require('async');
const forEach = require('lodash/forEach');
const ObjectID = require('mongodb').ObjectID;

const Card = require('../models/card');
const Deck = require('../models/deck');
const UserInfo = require('../models/user-info');

const internals = {};

internals.getOneCard = async (id) => {
  return await Card.findById(id);
}

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
    if (userInfo.decks.indexOf(deckItem._id.toString()) >= 0) {
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

  const ids = userInfo.decks.map((id) => ObjectID(id));
  return await Deck.pagedFind({_id: {$in: ids}}, _page, _limit, {});
}

exports.register = function (server, options) {

  server.expose('getOneCard', internals.getOneCard);
  server.expose('getDeckPaginate', internals.getDeckPaginate);
  server.expose('getDeckPaginateMapWithUserInfo', internals.getDeckPaginateMapWithUserInfo);
  server.expose('getUserOwnerDeckPaginate', internals.getUserOwnerDeckPaginate);

  return;
};

exports.getOneCard = internals.getOneCard;
exports.getDeckPaginate = internals.getDeckPaginate;
exports.getDeckPaginateMapWithUserInfo = internals.getDeckPaginateMapWithUserInfo;
exports.getUserOwnerDeckPaginate = internals.getUserOwnerDeckPaginate;

exports.name = 'quiz-service';
