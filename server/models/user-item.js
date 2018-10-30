'use strict';

const Joi = require('joi');
const ESMongoModels = require('./es-mongo-model');
const esSchema = require('../elasticsearch/mapping/user-item').userItem
const userStatisticsService = require('../services/user-statistics.service');
let keyRemoveDeckArray = ['topics','tags']
let keyRemoveSongArray = ['listLyric', 'cards']
let keyRemoveArticleArray = ['checkForUnderstandingQuestions', 'discussionQuestions', 'textDependentQuestions', 'reference']
let keyRemoveArray = keyRemoveDeckArray.concat(keyRemoveSongArray, keyRemoveArticleArray);


class UserItem extends ESMongoModels {
  static async upsertES(_id) {
    let indexData = await this.findById(_id)
    const Item = require(`../models/${indexData.itemType}`);
    //Add more fields from other table
    indexData['itemInfo'] = await Item.findById(indexData.itemId);
    indexData['name'] = indexData['itemInfo']['name']
    keyRemoveArray.forEach(e => delete indexData['itemInfo'][e]);
    if (indexData.itemType === 'deck') {
      indexData['wordStatistics'] = (await userStatisticsService.getWordStatics({deckId: indexData.itemId}))[0];
    }
    await super.upsertES(_id, indexData)
  }
};

UserItem.collectionName = 'user_item';
UserItem.esSchema = esSchema;

UserItem.schema = Joi.object().keys({
  _id: Joi.object(),
  userId: Joi.string(),
  itemId: Joi.string(),
  favorite: Joi.number(),
  itemType: Joi.string(),
  completedTopics: Joi.object().optional().allow(null),// List completed topics with property is the id of topic and value is the id of userTopic
  createdAt: Joi.date().optional(),//Thời gian tạo item
  expiredAt: Joi.date().optional(),//Thời gian hết hạn
})
  .options({stripUnknown: true});

UserItem['buider'] = require('bodybuilder')

UserItem.indexes = [
  {
    key: {
      userId: 1,
      itemId: 1
    }
  }
];

module.exports = UserItem;

