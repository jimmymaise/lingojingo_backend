'use strict';

const Joi = require('joi');
const ESMongoModels = require('./es-mongo-model');
const GrammarGroup = require('../models/grammar-group');
const esSchema = require('../elasticsearch/mapping/grammar-unit').grammarUnit


class GrammarUnit extends ESMongoModels {

  static async upsertES(_id) {
    let indexData = await this.findOne({_id: _id})
    //Add more fields from other table
    //Remove some fields not need to put ES
    let grammarGroupInfo = await GrammarGroup.findOne({_id: indexData.groupId});
    indexData['groupInfo'] = {
      name: grammarGroupInfo['name'],
      _id: grammarGroupInfo['_id'],
    }
    await super.upsertES(_id, indexData)
  }


}


GrammarUnit.collectionName = 'grammar_units';
GrammarUnit.esSchema = esSchema;

GrammarUnit.schema = Joi.object().keys({
  _id: Joi.number(),
  name: [Joi.string().optional(), Joi.allow(null)],
  img: [Joi.string().optional(), Joi.allow(null)],
  groupId: [Joi.number().optional(), Joi.allow(null)],
  order: [Joi.number().optional(), Joi.allow(null)],
  sections: [Joi.array().optional(), Joi.allow(null)],
  relatedUnits: [Joi.array().optional(), Joi.allow(null)],
  type: [Joi.string().optional(), Joi.allow(null)],
}).options({stripUnknown: true});

GrammarUnit.indexes = [];

module.exports = GrammarUnit;

