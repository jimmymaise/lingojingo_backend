'use strict';

const Joi = require('joi');
const MongoModels = require('mongo-models');

class Deck extends MongoModels {
};

Deck.collectionName = 'decks';

Deck.schema = Joi.object().keys({
  _id: Joi.object(),
  images: Joi.array(),
  total: Joi.number(),
  tags: Joi.array(),
  deckName: Joi.string(),
  topics: Joi.array(),
  img: [Joi.string().optional(), Joi.allow(null)],
  topicExamQuestions: Joi.number(),//Zero mean 100%
  reviewExamQuestions: Joi.number(), //<1 mean % ex: 0.5 ==>50% question in the topic,>1 mean number of question in the exam
  finalExamQuestions: Joi.number(),
  passScore: Joi.number()// pass score to evaluate exam passed or failed,eg:80 mean exam score must be >=80 to pass
}).options({stripUnknown: true});

Deck.indexes = [];

module.exports = Deck;

