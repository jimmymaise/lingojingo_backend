'use strict';

const Joi = require('joi');
const MongoModels = require('mongo-models');

class GrammarExercise extends MongoModels {
};

GrammarExercise.collectionName = 'grammar_exercises';

GrammarExercise.schema = Joi.object().keys({
  _id: Joi.number(),
  coreAnswers: [Joi.array().optional(), Joi.allow(null)],
  rubric: [Joi.string().optional(), Joi.allow(null)],
  referenceExercise: [Joi.string().optional(), Joi.allow(null)],
  engine: [Joi.string().optional(), Joi.allow(null)],
  name: [Joi.string().optional(), Joi.allow(null)],
  carouselOneOptions:  [Joi.array().optional(), Joi.allow(null)],
  carouselTwoOptions:  [Joi.array().optional(), Joi.allow(null)],
  carouselThreeOptions: [Joi.array().optional(), Joi.allow(null)],
  questions: [Joi.array().optional(), Joi.allow(null)],
  gridReference:  [Joi.string().optional(), Joi.allow(null)],
  leftLabel: [Joi.string().optional(), Joi.allow(null)],
  rightLabel: [Joi.string().optional(), Joi.allow(null)],


}).options({stripUnknown: true});

GrammarExercise.indexes = [];

module.exports = GrammarExercise;

