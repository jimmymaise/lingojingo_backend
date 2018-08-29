'use strict';

const Joi = require('joi');
const MongoModels = require('mongo-models');

class DeckCategory extends MongoModels {
};

DeckCategory.collectionName = 'deck_categories';

let deckObj = Joi.object().keys({
  order: Joi.number(),
  id: Joi.object(),
})

DeckCategory.schema = Joi.object().keys({
  _id: Joi.object(),
  name: Joi.string(),
  decks: Joi.array().items(deckObj),
}).options({stripUnknown: true});

DeckCategory.indexes = [];

module.exports = DeckCategory;

