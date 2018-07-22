'use strict';

const Joi = require('joi');
const MongoModels = require('mongo-models');

class UserInfo extends MongoModels {
  static transformToClientResponseData(userInfo) {
    const {
      firebaseUserId,
      fullName,
      email,
      phone,
      avatarUrl,
      aboutContent,
      isLearnMailNotify,
      isNewBlogMailNotify,
      isGeneralMailNotify
    } = userInfo;

    return {
      userId: firebaseUserId,
      fullName,
      email,
      phone,
      avatarUrl,
      aboutContent,
      isLearnMailNotify,
      isNewBlogMailNotify,
      isGeneralMailNotify
    };
  }
};

UserInfo.collectionName = 'user_infos';

UserInfo.schema = Joi.object().keys({
  _id: Joi.object(),
  firebaseUserId: Joi.string().required(),
  fullName: Joi.string().optional().allow(null),
  email: Joi.string(),
  phone: Joi.string().optional().allow(null),
  avatarUrl: Joi.string().optional().allow(null),
  aboutContent: Joi.string().optional().allow(null),
  isLearnMailNotify: Joi.boolean().default(true),
  isNewBlogMailNotify: Joi.boolean().default(true),
  isGeneralMailNotify: Joi.boolean().default(true),
  decks: Joi.array(),
  points: Joi.number(),
  level:Joi.number(),
  timeUpdated: Joi.date().required().default(new Date()),
  timeCreated: Joi.date().required().default(new Date())
}).options({stripUnknown: true});

UserInfo.indexes = [
  {key: {firebaseUserId: 1}}
];

module.exports = UserInfo;
