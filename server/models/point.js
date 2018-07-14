'use strict';

const Joi = require('joi');
const MongoModels = require('mongo-models');

/**
 * Point hay còn gọi là reward, dùng để lưu các point được nhận của user khi hoàn thành một task nào đó. Dùng để khích lệ user
 * Ngoài mục đích khích lệ user thì Point có thể sử dụng để mua bán các bộ từ, trao đổi, chuyển nhượng.
 */
class Point extends MongoModels {
};

Point.collectionName = 'point';

Point.schema = Joi.object().keys({
  _id: Joi.object(),

  userId: Joi.string(),
  type: Joi.string(), //Type để tính điểm: Mới đăng ký: 10 điểm, thăng cấp: 5 , topicExam:1 (100%tg trung bình < 5s), ReviewExam:2 (<4s), FinalExam:3(<3s)
  userTopicId: Joi.string(), // Lưu userTopicid để tránh 1 topic cộng điểm nhiều lần khi eventType là topicExam,ReviewExam,FinalExam
  points: Joi.number() // Lưu số điểm nhận
}).options({stripUnknown: true});


module.exports = Point;
