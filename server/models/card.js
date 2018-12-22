'use strict';

const Joi = require('joi');
const MongoModels = require('mongo-models');

class Card extends MongoModels {
};

Card.collectionName = 'cards';

Card.schema = Joi.object().keys({
  _id: Joi.object(),
  description: Joi.string(),
  voca: Joi.string().required(),
  transcript: [Joi.string().optional(), Joi.allow(null)],
  img: [Joi.array().optional(), Joi.allow(null)],
  ukAudio: [Joi.string().optional(), Joi.allow(null)],
  usAudio: [Joi.string().optional(), Joi.allow(null)],
  type: [Joi.string().optional(), Joi.allow(null)],
  viMeaning: Joi.string(),
  sample: [Joi.array().optional(), Joi.allow(null)],
  enMeaning: [Joi.string().optional(), Joi.allow(null)],//to do: Replace enmeaning to enMeaning
  tags: [Joi.array().optional(), Joi.allow(null)],

}).options({stripUnknown: true});

Card.indexes = [];

module.exports = Card;

