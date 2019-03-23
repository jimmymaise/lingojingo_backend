'use strict';

const Joi = require('joi');
const MongoModels = require('mongo-models');

class GrammarGroup extends MongoModels {
};

GrammarGroup.collectionName = 'grammar_groups';

GrammarGroup.schema = Joi.object().keys({
  _id: Joi.number(),
  name: [Joi.string().optional(), Joi.allow(null)],
  img: [Joi.string().optional(), Joi.allow(null)],
  units: Joi.array(),
  order: Joi.number(),
}).options({stripUnknown: true});

GrammarGroup.indexes = [];

module.exports = GrammarGroup;

