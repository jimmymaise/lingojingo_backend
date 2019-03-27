'use strict';

const Joi = require('joi');
const MongoModels = require('mongo-models');

class GrammarSection extends MongoModels {
};

GrammarSection.collectionName = 'grammar_sections';

GrammarSection.schema = Joi.object().keys({
  _id: Joi.number(),
  name: [Joi.string().optional(), Joi.allow(null)],
  description: [Joi.string().optional(), Joi.allow(null)],
  explanation: [Joi.string().optional(), Joi.allow(null)],
  heading: [Joi.string().optional(), Joi.allow(null)],
  exercises: [Joi.array().optional(), Joi.allow(null)],
  references: [Joi.array().optional(), Joi.allow(null)],
  unitId: [Joi.number().optional(), Joi.allow(null)],


}).options({stripUnknown: true});

GrammarSection.indexes = [];

module.exports = GrammarSection;

