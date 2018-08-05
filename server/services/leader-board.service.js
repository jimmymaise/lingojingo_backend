'use strict';
const _ = require('lodash');
const internals = {};
const UserTopic = require('../models/user-topic');

//UserPoint

// internals.getTopicLeaderBoard = async (args) => {
//
//   let data = UserTopic.find({
//     deckId: args.deckId,
//     topicId: args.topicId,
//     highestResult: {$exists: true}
//   }).sort({
//       "highestResult.totalCorrectAnswers": -1,
//       "highestResult.timeSpent": 1,
//       "totalExams": 1
//     }
//   ).limit(args.top || 10).toArray()
//   let leaderBoard = []
//   data.forEach(item => {
//     leaderBoard.push({
//       _id: item.userId,
//       score: item.highestResult.score,
//       timeSpent: item.timeSpent,
//       timeSpentAvg: item.highestResult.timeSpentAvg,
//       totalCorrectAnswers: item.highestResult.totalCorrectAnswers,
//       totalExams: item.totalExams
//     })
//   });
//   return leaderBoard
// }

//implementing not yet finish
internals.getGeneralLeaderBoard = async (args) => {


  let query = [

    {
      $match:
        {
          "highestResult": {$exists: true},
          "topicType": args.topicType,
          "topicId": args.topicId,
          "deckId": args.topicId,
          "userId": args.userId,
        },
    },
    {
      $group: {
        _id: "$userId",
        totalCorrectAnswers: {$sum: "$highestResult.totalCorrectAnswers"},
        timeSpent: {$sum: "$highestResult.timeSpent"},
        totalExams: {$sum: "$totalExams"},
        score: {$avg: "$highestResult.score"},
        timeSpentAvg: {$avg: "$highestResult.timeSpentAvg"}
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
      $limit: args.top || 10

    }

  ]

  if (args.deckId === undefined) {
    delete query[0]['$match']['deckId']

  }
  if (args.topicId === undefined) {
    delete query[0]['$match']['topicId']

  }
  if (args.topicType === undefined) {
    delete query[0]['$match']['topicType']

  }
  if (args.topicType === undefined) {
    delete query[0]['$match']['userId']

  }

  let data = UserTopic.aggregate(
    query
  )

  return data

}
// exports.getTopicLeaderBoard = internals.getTopicLeaderBoard;
exports.getGeneralLeaderBoard = internals.getGeneralLeaderBoard;


exports.name = 'leader-board-service';
