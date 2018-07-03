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
  topics: Joi.array(),
  img: [Joi.string().optional(), Joi.allow(null)],
  cardChoices: Joi.object(),
  passScore: Joi.number()// pass score to evaluate exam passed or failed,eg:80 mean exam score must be >=80 to pass
}).options({stripUnknown: true});

Deck.indexes = [];

module.exports = Deck;

