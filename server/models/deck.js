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
  cardChoices: Joi.object(),//Todo: should we move it to the topic??
  total_topic_exam_questions: Joi.number(),//Zero mean 100%
  total_review_exam_questions: Joi.number(), //<1 mean % ex: 0.5 ==>50% question in the topic,>1 mean number of question in the exam
  total_final_exam_questions: Joi.number(),
  passScore: Joi.number()// pass score to evaluate exam passed or failed,eg:80 mean exam score must be >=80 to pass
}).options({stripUnknown: true});

Deck.indexes = [];

module.exports = Deck;

