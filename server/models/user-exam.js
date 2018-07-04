'use strict';

const Joi = require('joi');
const MongoModels = require('mongo-models');

class UserExam extends MongoModels {
};

UserExam.collectionName = 'user_exam';

UserExam.schema = Joi.object().keys({
  _id: Joi.object(),
  type: Joi.string(),//Type of exam: Final, Review, Topic
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
  timeSpent: Joi.number(),// time spent to complete the exam (using to calculate score and ranking)
  result: Joi.string(),// Passed or failed

}).options({stripUnknown: true});

UserExam.indexes = [];

module.exports = UserExam;
