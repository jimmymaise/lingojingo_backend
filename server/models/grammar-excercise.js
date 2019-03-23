'use strict';

const Joi = require('joi');
const MongoModels = require('mongo-models');

class GrammarExercise extends MongoModels {
};

GrammarExercise.collectionName = 'grammar-exercises';

GrammarExercise.schema = Joi.object().keys({
  _id: Joi.number(),
  coreAnswers: [Joi.array().optional(), Joi.allow(null)],
  rubric: Joi.string().optional(),
  referenceExercise: [Joi.string().optional(), Joi.allow(null)],
  engine: Joi.string().optional(),
  name: [Joi.string().optional(), Joi.allow(null)],
  carouselOneOptions: Joi.array().optional(),
  carouselTwoOptions: Joi.array().optional(),
  carouselThreeOptions: Joi.array().optional(),

}).options({stripUnknown: true});

GrammarExercise.indexes = [];

module.exports = GrammarExercise;

