'use strict';

const Joi = require('joi');
const MongoModels = require('mongo-models');

/**
 * Chỉ lưu lịch sử làm bài thi của topic
 */
class UserExam extends MongoModels {
};

UserExam.collectionName = 'user_exams';

UserExam.schema = Joi.object().keys({
  _id: Joi.object(),
  userId: Joi.string(),
  deckId: Joi.string(),
  topicId: Joi.string(), // Link den Table Topics, de biet exam nay cua topic nao
  knownAnswer: Joi.object(), // The wrong answers of the exam
  totalQuestions: Joi.number(), // Tong question
  timeCreated: Joi.date().required().default(new Date()), // date of exam
  score: Joi.number(), // score of exam
  timeSpent: Joi.number(), // time spent to complete the exam (using to calculate score and ranking) - In Milisecond
  result: Joi.number(), // 0 - Failed | 1 - Passed,
}).options({stripUnknown: true});

UserExam.indexes = [];

module.exports = UserExam;
