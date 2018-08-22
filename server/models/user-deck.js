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
  completedTopics: Joi.object().optional().allow(null),// List completed topics with property is the id of topic and value is the id of userTopic
  latestStudy: Joi.object().keys({ // Store lan hoc gan day nhat
    latestStudyDate: Joi.date().optional().allow(null),
    latestUserTopic: Joi.string().optional().allow(null), // Join qua table user-topic
    latestTopic: Joi.string().optional().allow(null), // Chi de backup topicId gan nhat
    latestStudyMode: Joi.string().optional().allow(null), // mode hoc tap
  }).optional().allow(null),
  createdAt: Joi.date().optional(),//Thời gian tạo deck
  expiredAt: Joi.date().optional(),//Thời gian hết hạn
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

