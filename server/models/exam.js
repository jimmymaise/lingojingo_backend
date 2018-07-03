'use strict';

const Joi = require('joi');
const MongoModels = require('mongo-models');

class Exam extends MongoModels {
};

Exam.collectionName = 'exam';

Exam.schema = Joi.object().keys({
  _id: Joi.object(),
  type: Joi.string(),
  userId: Joi.string(),
  deckId: Joi.string(),
  userDeckId: Joi.string(),
  userTopicId: Joi.string(),
  topicId: Joi.string(),//Topic id to start exam (topic have property is_next_exam)
  reviewTopics: Joi.array(),// List of the topics using for making test in the exam.
  wrongAnswers: Joi.array(),//The wrong answers of the exam
  totalQuestions: Joi.number(),
  date: Joi.string(),// date of exam
  score: Joi.number(),// score of exam
  result: Joi.string(),// Passed or failed

}).options({stripUnknown: true});

Exam.indexes = [];

module.exports = Exam;
