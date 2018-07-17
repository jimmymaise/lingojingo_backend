'use strict';
const _ = require('lodash');
const internals = {};

const UserPoint = require('../models/user-points');
const RewardEvent = require('../models/reward-event');

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
  let data = await RewardEvent.find({"userId": userId});
  return data
}


internals.addRewardEvent = async (userId,rewardEvent) => {
  let result = await RewardEvent.insertOne({
    userId,
    ...rewardEvent
  });

  return result[0]

}


exports.register = function (server, options) {

  server.expose('getUserPoint', internals.getUserPoint);
  server.expose('getDetail', internals.getDetail);
  server.expose('addRewardEvent', internals.addRewardEvent);



};
exports.getUserPoint = internals.getUserPoint;
exports.getDetail = internals.getDetail;
exports.addRewardEvent = internals.addRewardEvent;


exports.name = 'reward-service';
