'use strict';

const Joi = require('joi');
const MongoModels = require('mongo-models');

class DeckCategory extends MongoModels {
};

DeckCategory.collectionName = 'deck_categories';

DeckCategory.schema = Joi.object().keys({
  _id: Joi.object(),
  name: Joi.string(),
  decks: [Joi.object()],
}).options({stripUnknown: true});

DeckCategory.indexes = [];

module.exports = DeckCategory;

