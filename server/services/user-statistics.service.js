'use strict';
const _ = require('lodash');
const internals = {};

const UserTopic = require('../models/user-topic');
const Deck = require('../models/deck');


//UserPoint

internals.getWordStatics = async (queryData) => {
  queryData.deckId = queryData.deckId.toString()

  let query = [

    {
      $match:
        {
          "userId": queryData.userId,
          "topicId": queryData.topicId,
          "deckId": queryData.deckId
        },
    },
    {
      $group: {
        _id: "$deckId",
        learned: {$sum: "$highestResult.totalCorrectAnswers"},
        learning: {$sum: {$subtract:["$highestResult.totalQuestions","$highestResult.totalCorrectAnswers"]}},
}
    }

  ]

  if (queryData.deckId === undefined) {
    delete query[0]['$match']['deckId']

  }
  if (queryData.topicId === undefined) {
    delete query[0]['$match']['topicId']

  }


  let data = await UserTopic.aggregate(
    query
  )
  for (let i=0;i<data.length;i++){
    let deckData = await Deck.findById(queryData.deckId)
    let totalCards = deckData['total']
    data[i]['notLearned'] = totalCards-data[i]['learning']-data[i]['learned']
  }
  return data
}


exports.register = function (server, options) {

  server.expose('getWordStatics', internals.getWordStatics);


};
exports.getWordStatics = internals.getWordStatics;



exports.name = 'user-statistics-service';
