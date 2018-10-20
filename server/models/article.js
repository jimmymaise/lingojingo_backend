'use strict';

const Joi = require('joi');
const ESMongoModels = require('./es-mongo-model');
const esSchema = require('../elasticsearch/mapping/article').article

class Article extends ESMongoModels {

  static async upsertES(_id) {
    let indexData = await this.findById(_id)
    //Remove some fields not need to put ES
    delete indexData['content']
    delete indexData['content']
    delete indexData['textDependentQuestions']
    delete indexData['discussionQuestions']
    delete indexData['checkForUnderstandingQuestions']

    await super.upsertES(_id, indexData)
  }


}

Article.collectionName = 'articles';
Article.esSchema = esSchema;

Article.schema = Joi.object().keys({
  _id: Joi.object(),
  title: Joi.string(),
  author: Joi.string(),
  id: Joi.number(),
  publicationYear: Joi.string(),
  grade: Joi.string(),
  genre: Joi.string(),
  permissionsLine: Joi.string(),
  image: Joi.string(),
  description: Joi.string(),
  language: Joi.string(),
  content: Joi.object(),
  checkForUnderstandingQuestions: Joi.array(),
  discussionQuestions: Joi.array(),
  textDependentQuestions: Joi.array(),

}).options({stripUnknown: true});

Article['buider'] = require('bodybuilder')

Article.indexes = [];

module.exports = Article;

