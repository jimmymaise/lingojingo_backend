'use strict';

const Joi = require('joi');
const MongoModels = require('mongo-models');

class BandSinger extends MongoModels {
};

BandSinger.collectionName = 'band_singers';


BandSinger.schema = Joi.object().keys({
  _id: Joi.object(),
  singerId: Joi.number(),
  name: Joi.string(),
  avatar: Joi.string(),
  isBand: Joi.number(),
  bandParent: Joi.number(),
  intro: Joi.string(),
}).options({stripUnknown: true});

BandSinger.indexes = [];

module.exports = BandSinger;

