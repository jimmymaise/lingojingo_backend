'use strict';

const Joi = require('joi');
const MongoModels = require('mongo-models');
const esSchema = require('../elasticsearch/mapping/user-topic').userTopic

class Topic extends MongoModels {
};

Topic.collectionName = 'topics';
Topic.esSchema = esSchema;

Topic.schema = Joi.object().keys({
  _id: Joi.object(),
  description: [Joi.string().optional(), Joi.allow(null)],
  topic: Joi.string().required(),
  img: [Joi.string().optional(), Joi.allow(null)],
  deck: Joi.string(),
  cards: Joi.array(),
  tag: [Joi.string().optional(), Joi.allow(null)],
  // Loại: là topic bình thương hay là 1 bài exam đặc biệt exam: 0 - Topic, 1 - Review, 2 - Final;
  type: Joi.number(),
}).options({stripUnknown: true});

Topic.indexes = [];

module.exports = Topic;

