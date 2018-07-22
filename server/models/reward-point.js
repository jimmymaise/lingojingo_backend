'use strict';

const Joi = require('joi');
const MongoModels = require('mongo-models');

/**
 * Reward Point dùng để quy định mỗi type reward user nhận được bao nhiêu điểm */
class RewardPoint extends MongoModels {
};

RewardPoint.collectionName = 'reward-point';
RewardPoint.schema = Joi.object().keys({
  _id: Joi.object(),
  type: Joi.string(),//Type của reward:NEW_REGISTER: Mới đăng ký,REFERAL Giới thiệu người vào học, GOOD_RESULT_TOPIC_EXAM: Làm đúng 100% và có time trung bìng <=5s, với REVIEW là 4s, với FINAL là 3s
  point: Joi.number(), // số point của type reward
}).options({stripUnknown: true});


module.exports = RewardPoint;