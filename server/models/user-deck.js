'use strict';

const Joi = require('joi');
const MongoModels = require('mongo-models');

class UserDeck extends MongoModels {
};

UserDeck.collectionName = 'user_deck';

UserDeck.schema = Joi.object().keys({
  _id: Joi.object(),
  userId: Joi.string(),
  deckId: Joi.string(),
  waitingReviewExamTopics: Joi.array().optional(),//List of the topic will using for the next review exam. After finish review exam (passed), this list will reset
  reviewExams: Joi.object().optional(), //Review exam with the property is the id of the topic having review exam
  finalExam: Joi.object(), //Final exam info with two properties: exams (array) and highest result (object)
  completedTopics: Joi.object().optional().allow(null),// List completed topics with property is the id of topic and value is the id of userTopic
  latestStudy: Joi.object().keys({ // Store lan hoc gan day nhat
    latestStudyDate: Joi.date().optional().allow(null),
    latestUserTopic: Joi.string().optional().allow(null), // Join qua table user-topic
    latestTopic: Joi.string().optional().allow(null), // Chi de backup topicId gan nhat
    latestStudyMode: Joi.string().optional().allow(null), // mode hoc tap
    completeFinalExam: Joi.bool() // Hoan thanh bai kiem tra cua topic
  }).optional().allow(null),
})
  .options({stripUnknown: true});

UserDeck.indexes = [
  {
    key: {
      userId: 1,
      deckId: 1
    }
  }
];

module.exports = UserDeck;

