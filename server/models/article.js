'use strict';

const Joi = require('joi');
const ESMongoModels = require('./es-mongo-model');
const esSchema = require('../elasticsearch/mapping/article').article

class Article extends ESMongoModels {

  static async upsertES(_id) {
    let indexData = await this.findById(_id)
    //Remove some fields not need to put ES
    delete indexData['content']
    delete indexData['textDependentQuestions']
    delete indexData['discussionQuestions']
    delete indexData['checkForUnderstandingQuestions']
    delete indexData['reference']


    await super.upsertES(_id, indexData)
  }


}

Article.collectionName = 'articles';
Article.esSchema = esSchema;

Article.schema = Joi.object().keys({
  _id: Joi.object(),
  name: Joi.string(),
  author: Joi.string().allow(null).allow(''),
  id: Joi.number(),
  publicationYear: Joi.string().allow(null).allow(''),
  grade: Joi.string(),
  genre: Joi.string().allow(null).allow(''),
  permissionsLine: Joi.string().optional().allow(null).allow(''),
  image: Joi.string().allow(null).allow(''),
  description: Joi.string(),
  language: Joi.string(),
  content: Joi.object(),
  checkForUnderstandingQuestions: Joi.array().allow(null).allow(''),
  discussionQuestions: Joi.array().optional().allow(null).allow(''),
  textDependentQuestions: Joi.array().optional().allow(null).allow(''),
  reference: Joi.array().optional().allow(null).allow(''),


}).options({stripUnknown: true});

Article['buider'] = require('bodybuilder')

Article.indexes = [];

module.exports = Article;

