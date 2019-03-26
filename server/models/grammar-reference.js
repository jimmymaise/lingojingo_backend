'use strict';

const Joi = require('joi');
const MongoModels = require('mongo-models');

class GrammarReference extends MongoModels {
};

GrammarReference.collectionName = 'grammar_references';

GrammarReference.schema = Joi.object().keys({
  _id: Joi.number(),
  name: [Joi.string().optional(), Joi.allow(null)],
  bodyText: [Joi.string().optional(), Joi.allow(null)],


}).options({stripUnknown: true});

GrammarReference.indexes = [];

module.exports = GrammarReference;

