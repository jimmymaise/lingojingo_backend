'use strict';

const Joi = require('joi');
const MongoModels = require('mongo-models');

/**
 * RewardHistory dùng để lưu các point được nhận của user khi hoàn thành một task nào đó. Dùng để khích lệ user*/
class RewardHistory extends MongoModels {
};

RewardHistory.collectionName = 'reward-history';
RewardHistory.schema = Joi.object().keys({
  _id: Joi.object(),
  userId: Joi.string(),
  timeRewarded: Joi.date().required().default(new Date()),//Thời điểm user được cộng point
  type: Joi.string(), //Type để tính điểm, type sẽ map ra điểm tương ứng ở  quy định ở  reward_point
  topicId: Joi.string(), // Lưu userTopicid để tránh 1 topic cộng điểm nhiều lần khi eventType là topicExam,ReviewExam,FinalExam
  note: Joi.string() // Lưu note để phục vụ kiểm tra lại khi cần
}).options({stripUnknown: true});


module.exports = RewardHistory;
