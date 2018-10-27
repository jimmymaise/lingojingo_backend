'use strict';

const Joi = require('joi');
const MongoModels = require('mongo-models');
const userStatisticsService = require('../services/user-statistics.service');
let keyRemoveDeckArray = ['topics']
let keyRemoveSongArray = ['listLyric', 'cards']
let keyRemoveArticleArray = ['checkForUnderstandingQuestions', 'discussionQuestions', 'textDependentQuestions', 'reference']
let keyRemoveArray = keyRemoveDeckArray.concat(keyRemoveSongArray, keyRemoveArticleArray);


class UserItem extends MongoModels {
  static async upsertES(_id) {
    let indexData = await this.findById(_id)
    const Item = require(`../models/${indexData.type}`);
    //Add more fields from other table
    indexData['itemInfo'] = await Item.findOne({_id: indexData.itemId});
    indexData['name'] =indexData['itemInfo']['name']
    keyRemoveArray.forEach(e => delete indexData['itemInfo'][e]);
    if (type === 'deck') {
      indexData['WordStatistics'] = await userStatisticsService.getWordStatics({deckId: indexData.itemId});
      }
    await super.upsertES(_id, indexData)
  }
};

UserItem.collectionName = 'user_item';

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

UserItem.indexes = [
  {
    key: {
      userId: 1,
      itemId: 1
    }
  }
];

module.exports = UserItem;

