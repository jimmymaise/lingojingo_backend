'use strict';
const _ = require('lodash');
const internals = {};

const UserExam = require('../models/user-exam');

//UserPoint

internals.getLeaderBoard = async (args) => {

  let data = UserExam.find({deckId: args.deckId, topicId: args.topicId}).sort({score: -1}).limit(args.top||10).toArray()
  return data
}

exports.getLeaderBoard = internals.getLeaderBoard;

exports.name = 'leader-board-service';
