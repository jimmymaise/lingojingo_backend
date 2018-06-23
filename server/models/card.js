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
  transcript: [Joi.string().optional(), Joi.allow(null)],
  img: [Joi.array().optional(), Joi.allow(null)],
  audio: [Joi.string().optional(), Joi.allow(null)],
  type: [Joi.string().optional(), Joi.allow(null)],
  meaning: Joi.string(),
  sample: [Joi.array().optional(), Joi.allow(null)],
  enmeaning: [Joi.string().optional(), Joi.allow(null)],
  tags: [Joi.array().optional(), Joi.allow(null)]
}).options({ stripUnknown: true });

Card.indexes = [];

module.exports = Card;

