'use strict';
const Joi = require('joi');
const ESMongoModels = require('./es-mongo-model');
const esSchema = require('../elasticsearch/mapping/user-topic').userTopic


class UserTopic extends ESMongoModels {

};


UserTopic.collectionName = 'user_topic';
UserTopic.esSchema = esSchema;

UserTopic.schema = Joi.object().keys({
  _id: Joi.object(),
  userId: Joi.string(),
  topicId: Joi.string(),
  topicType: Joi.number(),
  deckId: Joi.string(),
  exams: [Joi.string().optional(), Joi.allow(null)], // ids of all exams
  totalExams: Joi.number(),
  highestResult: Joi.object().keys({ // Store diem cao nhat

    examId: Joi.string(),
    score: Joi.number(),
    result: Joi.number(),
    timeSpent: Joi.number(),
    knownAnswer: Joi.object(),
    totalQuestions: Joi.number(),
    timeSpentAvg: Joi.number(),
    totalCorrectAnswers: Joi.number(),

  }).optional().allow(null),
  filterKnownCard: Joi.object(), // Luu nhung card id ko thuoc trong qua trinh filter
  knownAnswer: Joi.object(), // the correct answers of the latest topic exam
  currentStudyMode: Joi.string().optional().allow(null), // type of study mode
  // Vì có thể làm nhiều lần Exam, nên ở đây sẽ lưu kết qua cuối cùng
  // để mình check là nó có dc move qua topic kế tiếp ko
  // Đỡ phải ngồi tra lại table user-exam
  //lastExamResult: Joi.number(), // 0 - failed | 1 - Passed ==>Chi can check o highestResult la du
})

UserTopic.indexes = [
  {
    key: {
      userId: 1,
      topicId: 1,
      deckId: 1
    }
  }
];
module.exports = UserTopic;

