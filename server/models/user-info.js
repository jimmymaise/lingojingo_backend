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
  groups: Joi.array(),
  fullName: Joi.string().optional().allow(null),
  email: Joi.string().optional().allow(null).allow(''),
  phone: Joi.string().optional().allow(null).allow(''),
  avatarUrl: Joi.string().optional().allow(null),
  aboutContent: Joi.string().optional().allow(null).allow(''),
  isLearnMailNotify: Joi.boolean().default(true),
  isNewBlogMailNotify: Joi.boolean().default(true),
  isGeneralMailNotify: Joi.boolean().default(true),
  decks: Joi.array(),
  points: Joi.number(),
  totalCorrectAnswers: Joi.number(),
  totalExams: Joi.number(),
  timeSpent: Joi.number(),
  score: Joi.number(),
  level: Joi.string(),
  timeUpdated: Joi.date().required().default(new Date()),
  timeCreated: Joi.date().required().default(new Date())
}).options({stripUnknown: true});

UserInfo.indexes = [
  {key: {firebaseUserId: 1}}
];

module.exports = UserInfo;
