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
  completedTopics: Joi.object(),
  latestStudy: Joi.object(),
})
// .options({stripUnknown: true});
UserDeck.indexes = [];

module.exports = UserDeck;

