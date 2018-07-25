'use strict';
const _ = require('lodash');
const internals = {};

const UserTopic = require('../models/user-topic');

//UserPoint

internals.getLeaderBoard = async (args) => {

  let data = UserTopic.find({
    deckId: args.deckId,
    topicId: args.topicId,
    highestResult: {$exists: true}
  }).sort({"highestResult.score": -1}).limit(args.top || 10).toArray()
  let leaderBoard = []
  data.forEach(item => {
    leaderBoard.push({
      userId: item.userId,
      topicId: item.topicId,
      deckId: item.deckId,
      examId: item.highestResult.examId,
      score: item.highestResult.score,
      totalQuestions: item.highestResult.totalQuestions,
      timeSpentAvg: item.highestResult.timeSpentAvg,

    })
  });
  return leaderBoard
}

//implementing not yet finish
internals.getGeneralLeaderBoard = async (args) => {

  let data = UserTopic.aggregate(
    [

      {
        $match:
          {'highestResult': {$exists: true}},
      },
      {
        $group: {
          _id: "$userId",
          score: {$avg: "$highestResult.score"}

        }
      },
      {
        $sort: {score: -1}

      },
      {
        $limit: 1

      }

    ]
  )

}
exports.getLeaderBoard = internals.getLeaderBoard;

exports.name = 'leader-board-service';
