'use strict';

const Joi = require('joi');
const MongoModels = require('mongo-models');

class Exam extends MongoModels {
};

Exam.collectionName = 'exam';

Exam.schema = Joi.object().keys({
  _id: Joi.object(),
  type: Joi.string(),
  userDeckId: Joi.string(),
  userTopicId: Joi.string(),
  topicId: Joi.string(),
  reviewTopics: Joi.array(),
  userId: Joi.string(),
  deckId: Joi.string(),
  topics: Joi.array(),
  wrongAnswers: Joi.array(),
  totalQuestions: Joi.number(),
  date: Joi.string(),
  score: Joi.number(),
  result: Joi.string(),

}).options({stripUnknown: true});

Exam.indexes = [];

module.exports = Exam;
