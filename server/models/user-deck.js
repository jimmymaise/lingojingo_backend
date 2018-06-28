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
  exams: [Joi.string().optional(), Joi.allow(null)],
  highestResult: Joi.object().optional().allow(null),
  completedTopics: Joi.object().optional().allow(null),
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

