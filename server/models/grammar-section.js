'use strict';

const Joi = require('joi');
const MongoModels = require('mongo-models');

class GrammarSection extends MongoModels {
};

GrammarSection.collectionName = 'grammar-sections';

GrammarSection.schema = Joi.object().keys({
  _id: Joi.number(),
  description: [Joi.string().optional(), Joi.allow(null)],
  heading: [Joi.string().optional(), Joi.allow(null)],
  exercises: [Joi.array().optional(), Joi.allow(null)],
  references: [Joi.array().optional(), Joi.allow(null)],


}).options({stripUnknown: true});

GrammarSection.indexes = [];

module.exports = GrammarSection;

