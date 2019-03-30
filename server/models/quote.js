'use strict';

const Joi = require('joi');
const MongoModels = require('mongo-models');

class Quote extends MongoModels {
};

Quote.collectionName = 'english_quotes';

Quote.schema = Joi.object().keys({
  _id: Joi.object(),
  content: [Joi.string().optional()],
  vietnamese: [Joi.string().optional(), Joi.allow(null)],
  topics: [Joi.array().optional(), Joi.allow(null)],
  author: [Joi.string().optional(), Joi.allow(null)],

}).options({stripUnknown: true});

Quote.indexes = [];

module.exports = Quote;

