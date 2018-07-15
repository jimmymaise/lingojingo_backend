'use strict';
const _ = require('lodash');
const internals = {};

const UserPoint = require('../models/user-points');
const RewardHistory = require('../models/reward-history');

const UserTopic = require('../models/user-topic');
const UserDeck = require('../models/user-deck');
const utils = require('../utils/general');
const EXAM = require('../utils/constants').EXAM;

//UserPoint

internals.getUserPoint = async (userId) => {
  let data = await UserPoint.find({"_id": userId});
  return data[0]
}

internals.getDetail = async (userId) => {
  let data = await RewardHistory.find({"userId": userId});
  return data
}


internals.addRewardHistory = async (userId,rewardHistory) => {
  let result = await RewardHistory.insertOne({
    userId,
    ...rewardHistory
  });

  return result[0]

}


exports.register = function (server, options) {

  server.expose('getUserPoint', internals.getUserPoint);
  server.expose('getDetail', internals.getDetail);
  server.expose('addRewardHistory', internals.addRewardHistory);



};
exports.getUserPoint = internals.getUserPoint;
exports.getDetail = internals.getDetail;
exports.addRewardHistory = internals.addRewardHistory;


exports.name = 'reward-service';
