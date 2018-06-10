'use strict';

const Joi = require('joi');
const MongoModels = require('mongo-models');

class Card extends MongoModels {
};

Card.collectionName = 'cards';

Card.schema = Joi.object().keys({
  _id: Joi.object(),
  cardId: Joi.number(),
  voca: Joi.string(),
  transcript: Joi.string(),
  img: Joi.array(),
  audio: Joi.string(),
  type: [Joi.string().optional(), Joi.allow(null)],
  meaning: Joi.string(),
  sample: Joi.array(),
  enmeaning: [Joi.string().optional(), Joi.allow(null)]
});

Card.indexes = [];

module.exports = Card;

