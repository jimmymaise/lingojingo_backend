'use strict';

const Joi = require('joi');
const ESMongoModels = require('./es-mongo-model');
const esSchema = require('../elasticsearch/mapping/song').song
const BandSinger = require('../models/band-singer');

class Song extends ESMongoModels {

  static async upsertES(_id) {
    let indexData = await this.findById(_id)
    //Add more fields from other table
    //Remove some fields not need to put ES
    delete indexData['listLyric']

    let bandSingerInfo = await BandSinger.findOne({singerId: indexData.bandSingerId});
    indexData['bandSingerInfo'] = {
      name: bandSingerInfo['name'],
      avatar: bandSingerInfo['avatar'],
      _id: bandSingerInfo['_id'].toString(),
      singerId: bandSingerInfo['singerId']

    }
    await super.upsertES(_id, indexData)
  }


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
  description: [Joi.string().optional(), Joi.allow(null)],
  name: Joi.string(),
  mainLevel: Joi.number(),
  img: Joi.string(),
  bandSingerId: Joi.number(),
  songLevel: Joi.number(),
  cardTotal: Joi.number(),
  listLyric: Joi.array().items(lyricObj),
  cards: Joi.array(),
  link: Joi.string(),
  youtubeId: Joi.string(),
  topics: Joi.array(),
  passScore: Joi.number(),// pass score to evaluate exam passed or failed,eg:80 mean exam score must be >=80 to pass,
  duration: Joi.number()
}).options({stripUnknown: true});

Song['buider'] = require('bodybuilder')

Song.indexes = [];

module.exports = Song;

