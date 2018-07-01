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
  exams: [Joi.string().optional(), Joi.allow(null)],
  highestResult: Joi.object().optional().allow(null),
  filterKnownCard: Joi.object(),
  notRemembers: Joi.array(),
})

UserTopic.indexes = [];

module.exports = UserTopic;

