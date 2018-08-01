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
  }).sort({
      "highestResult.totalCorrectAnswers": -1,
      "highestResult.timeSpent": 1,
      "totalExams": 1
    }
  ).limit(args.top || 10).toArray()
  let leaderBoard = []
  data.forEach(item => {
    leaderBoard.push({
      userId: item.userId,
      topicId: item.topicId,
      deckId: item.deckId,
      examId: item.highestResult.examId,
      score: item.highestResult.score,
      totalQuestions: item.highestResult.totalQuestions,
      timeSpent: item.timeSpent,
      timeSpentAvg: item.highestResult.timeSpentAvg,
      totalCorrectAnswers: item.highestResult.totalCorrectAnswers,
      totalExams: item.totalExams
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
          {
            "highestResult": {$exists: true},
            "type": 0,
          },
      },
      {
        $group: {
          _id: "$userId",
          totalCorrectAnswers: {$sum: "$highestResult.totalCorrectAnswers"},
          timeSpent: {$sum: "$highestResult.timeSpent"},
          totalExams: {$sum: "$totalExams"},
        }
      },
      {
        $sort: {
          totalCorrectAnswers: -1,
          timeSpent: 1,
          totalExams: 1
        }

      },
      {
        $limit: 1

      }

    ]
  )

  return data

}
exports.getLeaderBoard = internals.getLeaderBoard;

exports.name = 'leader-board-service';
