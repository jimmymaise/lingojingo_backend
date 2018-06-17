'use strict';

const Joi = require('joi');
const MongoModels = require('mongo-models');

class Topic extends MongoModels {
};

Topic.collectionName = 'topics';

Topic.schema = Joi.object().keys({
  _id: Joi.object(),
  topic: Joi.string(),
  img: [Joi.string().optional(), Joi.allow(null)],
  deck: Joi.string(),
  cards: Joi.array(),
  tag: [Joi.string().optional(), Joi.allow(null)]
});

Topic.indexes = [];

module.exports = Topic;

