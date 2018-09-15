'use strict';

const Joi = require('joi');
const ESMongoModels = require('./es-mongo-model');
const esSchema = require('../elasticsearch/mapping/deck').deck
const DeckCategory = require('../models/deck-category');

class Deck extends ESMongoModels {

  static async upsertES(_id) {
    let indexData = await this.findById(_id)
    //Add more fields from other table
    let deckCatInfo = await DeckCategory.findOne({decks: {$elemMatch: {id: _id}}});
    indexData['category'] = {
      name: deckCatInfo['name'],
      _id: deckCatInfo['_id'].toString()
    }
    await super.upsertES(_id, indexData)
  }

};

Deck.collectionName = 'decks';
Deck.esSchema = esSchema;

Deck.schema = Joi.object().keys({
  _id: Joi.object(),
  images: Joi.array(),
  total: Joi.number(),
  tags: Joi.array(),
  deckName: Joi.string(),
  topics: Joi.array(),
  img: [Joi.string().optional(), Joi.allow(null)],
  topicExamQuestions: Joi.number(),//Zero mean 100%
  reviewExamQuestions: Joi.number(), //<1 mean % ex: 0.5 ==>50% question in the topic,>1 mean number of question in the exam
  finalExamQuestions: Joi.number(),
  passScore: Joi.number()// pass score to evaluate exam passed or failed,eg:80 mean exam score must be >=80 to pass
}).options({stripUnknown: true});

Deck['buider'] = require('bodybuilder')

Deck.indexes = [];

module.exports = Deck;

