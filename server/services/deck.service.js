'use strict';

const Async = require('async');

const UserInfo = require('../models/user-info');
const Deck = require('../models/deck');

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

exports.register = function (server, options) {

  server.expose('buyDeck', internals.buyDeck);

  return;
};

exports.buyDeck = internals.buyDeck;

exports.name = 'deck-service';
