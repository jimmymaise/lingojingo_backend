'use strict';

const Joi = require('joi');
const ESMongoModels = require('./es-mongo-model');
const esSchema = require('../elasticsearch/mapping/song').song

class Song extends ESMongoModels {

}

Song.collectionName = 'songs';
Song.esSchema = esSchema;
let lyricObj = Joi.object().keys({
  number: Joi.number(),
  timeStart: Joi.number(),
  timeEnd: Joi.number(),
  strLyricEn: Joi.string(),
  strLyricVi: Joi.string(),
})
Song.schema = Joi.object().keys({
  _id: Joi.object(),
  img: Joi.string(),
  bandSingerId: Joi.number(),
  songLevel: Joi.number(),
  cardTotal: Joi.number(),
  listLyric: Joi.array().items(lyricObj),
  link: Joi.string(),
  youtubeId: Joi.string(),
  songName: Joi.string(),
  topics: Joi.array(),
  passScore: Joi.number()// pass score to evaluate exam passed or failed,eg:80 mean exam score must be >=80 to pass
}).options({stripUnknown: true});

Song['buider'] = require('bodybuilder')

Song.indexes = [];

module.exports = Song;

