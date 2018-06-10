'use strict';

const Joi = require('joi');
const MongoModels = require('mongo-models');

class Deck extends MongoModels {
};

Deck.collectionName = 'decks';

Deck.schema = Joi.object().keys({
  _id: Joi.object(),
  deck: Joi.string(),
  images: Joi.array(),
  cards: Joi.array(),
  tags: Joi.array(),
  deckName: Joi.string(),
  topics: Joi.array()
});

Deck.indexes = [];

module.exports = Deck;

