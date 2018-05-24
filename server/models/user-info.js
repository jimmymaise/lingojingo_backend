'use strict';

const Joi = require('joi');
const MongoModels = require('mongo-models');
const _ = require('lodash');

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
  fullName: Joi.string(),
  email: Joi.string(),
  phone: Joi.string(),
  avatarUrl: Joi.string(),
  aboutContent: Joi.string(),
  isLearnMailNotify: Joi.boolean().default(true),
  isNewBlogMailNotify: Joi.boolean().default(true),
  isGeneralMailNotify: Joi.boolean().default(true),
  timeUpdated: Joi.date().required().default(new Date()),
  timeCreated: Joi.date().required().default(new Date())
});

UserInfo.indexes = [
  { key: { firebaseUserId: 1 } }
];

module.exports = UserInfo;
