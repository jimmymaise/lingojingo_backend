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
  if (args.userId === undefined) {
    delete query[0]['$match']['userId']

  }

  let data = UserTopic.aggregate(
    query
  )

  return data

}
// exports.getTopicLeaderBoard = internals.getTopicLeaderBoard;

internals.getGeneralLeaderBoardES = async (args) => {

  let body = UserTopic.bodyBuilder()
  body
    .andQuery('exists', 'field', 'highestResult')
    .size(0)
    .aggregation('terms', "userId", 'by_user_id'
      , agg =>
        agg
          .aggregation('sum', "highestResult.totalCorrectAnswers", 'totalCorrectAnswers')
          .aggregation('sum', 'highestResult.timeSpent', 'timeSpent')
          .aggregation('sum', "totalExams", 'totalExams')
          .aggregation('avg', 'highestResult.score', 'score')
          .aggregation('avg', 'highestResult.timeSpentAvg', 'timeSpentAvg')
          .aggregation('bucket_sort', {
            "sort": [{
              "totalCorrectAnswers": {
                "order": "desc"
              },
              "timeSpent": {
                "order": "asc"

              },
              "totalExams": {
                "order": "asc"

              }
            }],
          }, 'result_bucket_sort'))


  if (args.deckId !== undefined) {
    body.andQuery('match', 'deckId', args.deckId)
  }

  if (args.topicId !== undefined) {
    body.andQuery('match', 'topicId', args.topicId)
  }

  if (args.topicType !== undefined) {
    body.andQuery('match', 'topicType', args.topicType)

  }
  if (args.userId !== undefined) {
    body.andQuery('match', 'userId', args.userId)
  }

  let result = await
    UserTopic.searchWithBodyBuilder()
  let data = transformESResponseToGraphql(_.get(result, 'aggregations.by_user_id.buckets') || [])
  let limit = (data.length > (args.top || 10)) ? (args.top || 10) : data.length;
  let res = {}
  res['currentUser'] = data.find(function (obj) {
    return obj.userId.toString() === args.userId.toString();
  }) || {
    userId: args.userId.toString()
  };


  res['leaderBoard'] = data.slice(0, limit);


  return res;

}


function transformESResponseToGraphql(data) {

  let res = []
  let rank = 1

  data.forEach(function (item) {
    let convertItem = {
      userId: _.get(item, 'key'),
      timeSpent: _.get(item, 'timeSpent.value'),
      totalExams: _.get(item, 'totalExams.value'),
      totalCorrectAnswers: _.get(item, 'totalCorrectAnswers.value'),
      score: _.get(item, 'score.value'),
      timeSpentAvg: _.get(item, 'timeSpentAvg.value'),
      rank: rank


    }
    res.push(convertItem)
    rank++

  });
  return res

}

exports.getGeneralLeaderBoard = internals.getGeneralLeaderBoardES;


exports.name = 'leader-board-service';
