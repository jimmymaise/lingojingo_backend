'use strict';

const Joi = require('joi');
const MongoModels = require('mongo-models');

class UserTopic extends MongoModels {
};

UserTopic.collectionName = 'user_topic';

UserTopic.schema = Joi.object().keys({
  _id: Joi.object(),
  userId: Joi.string(),
  topicId: Joi.string(),
  deckId: Joi.string(),
  exams: [Joi.string().optional(), Joi.allow(null)], // ids of all exams
  highestResult: Joi.object().optional().allow(null), // Highest result of all the topic exams of this topic
  filterKnownCard: Joi.object(), // Luu nhung card id ko thuoc trong qua trinh filter
  notRemembers: Joi.object(), // the wrong answers of the latest topic exam
  currentStudyMode: Joi.string().optional().allow(null), // type of study mode
  // Vì có thể làm nhiều lần Exam, nên ở đây sẽ lưu kết qua cuối cùng
  // để mình check là nó có dc move qua topic kế tiếp ko
  // Đỡ phải ngồi tra lại table user-exam
  lastExamResult: Joi.number(), // 0 - failed | 1 - Passed
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

