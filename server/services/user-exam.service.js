'use strict';
const _ = require('lodash');
const Constant = require('../utils/constants')
const UserInfo = require('../models/user-info');
const UserExam = require('../models/user-exam');
const UserTopic = require('../models/user-topic');
const UserItem = require('../models/user-item');
const Deck = require('../models/deck');
const LeaderBoardService = require('../services/leader-board.service')
const RewardService = require('../services/reward.service')
const utils = require('../utils/general');
const EXAM = require('../utils/constants').EXAM;
const UserTopicService = require('../services/user-topic.service');
const UserItemService = require('../services/user-item.service');
const bigqueryHandler = require('../intergration/bigquery/handler')
let datasetId = 'user'
let tableId = 'exam'

const internals = {};

function calculateTotalCorrectAnswer(knownAnswer, totalQuestions) {
  let numCorrect = 0;
  for (let ans in knownAnswer) {
    if (knownAnswer[ans] === true) {
      numCorrect++
    }
  }
  return numCorrect

}


//UserExam

internals.getOneUserExam = async (id) => {
  return await UserExam.findById(id);
}

internals.getUserExams = async (args) => {
  return await UserExam.find({args});
}

internals.getRecentlyUserExams = async (userId, topicId, limit) => {
  return await UserExam.find({
    userId,
    topicId
  }, {
    limit,
    sort: [['createdTime', 1]]
  });
}

internals.getLeaderBoard = async (type='allTime', limit=30, userId) => {
  let leaderTable

  switch (type) {
    case 'weekly':
      leaderTable = 'weekly_leader_board'
      break;
    case 'monthly':
      leaderTable = 'monthly_leader_board'
      break;
    case 'allTime':
      leaderTable = 'all_time_leader_board'
      break;
  }

  const query = `
    SELECT *
    FROM \`${datasetId}.${leaderTable}\`
    WHERE rank <= ${limit}
    OR userId = '${userId}'
    ORDER BY rank
    `
  const options = {
    query: query,
// Location must match that of the dataset(s) referenced in the query.
// location: 'US',
  };
  let data = {}
  data['leaderBoard'] = await bigqueryHandler.queryBigQueryData(options)
  data['currentUser'] = data['leaderBoard'].find(function (obj) {
    return obj.userId.toString() === userId.toString();
  }) || {
    userId: serId.toString()
  };
  return data

}


internals.addOneUserExam = async (userExam) => {
  userExam.timeCreated = new Date();
  let deckData = await Deck.findById(userExam.deckId)
  userExam.totalQuestions = Object.keys(userExam.knownAnswer).length
  userExam.totalCorrectAnswers = calculateTotalCorrectAnswer(userExam.knownAnswer, userExam.totalQuestions)
  userExam.score = Math.round((userExam.totalCorrectAnswers / userExam.totalQuestions) * 100)
  userExam.timeSpentAvg = userExam.totalQuestions > 0 ? Math.round(userExam.timeSpent / userExam.totalQuestions) : null
  userExam.result = userExam.score >= deckData.passScore ? EXAM.RESULT.PASSED : EXAM.RESULT.FAILED


  let result = await UserExam.insertOne(userExam);
  await updateDataWhenCompletingUserExam(userExam)
  delete userExam['knownAnswer']
  await bigqueryHandler.insertRowsAsStream(datasetId, tableId, [userExam])
  return result[0]

}

internals.deleteOneUserExam = async (id) => {
  let result = await UserExam.findByIdAndDelete(id);
  if (result === undefined)
    result = {
      "_id": null
    }
  return result
}

internals.updateOneUserExam = async (args) => {
  let id = args.id
  let updateObj = _.cloneDeep(args)
  delete updateObj['id']
  delete updateObj['isCompleted']
  let result = await UserExam.findByIdAndUpdate(
    id, {$set: updateObj});
  if (args.isCompleted) {
    let data = await UserExam.findById(id);
    await updateDataWhenCompletingUserExam(data)
  }
  return result

}


async function updateDataWhenCompletingUserExam(userExam) {

  //update userTopic

  let userTopicData = await UserTopic.find({
    topicId: userExam.topicId,
    userId: userExam.userId,
  })
  userTopicData = userTopicData[0]
  if (!userTopicData) {
    userTopicData = await UserTopicService.addOneUserTopic(userExam.userId, {
      topicId: userExam.topicId,
      deckId: userExam.deckId,
    })
  }

  let currentHighestResult = userTopicData.highestResult || {}
  let isCalculateTotalWord = false
  if (currentHighestResult.score || 0 < userExam.score) {
    currentHighestResult = {
      examId: userExam._id.toString(),
      score: userExam.score,
      result: userExam.result,
      timeSpentAvg: userExam.timeSpentAvg,
      timeSpent: userExam.timeSpent,
      totalQuestions: userExam.totalQuestions,
      knownAnswer: userExam.knownAnswer,
      totalCorrectAnswers: userExam.totalCorrectAnswers
    }
    if (userTopicData.topicType === Constant.TOPIC.TYPE.TOPIC) {
      isCalculateTotalWord = true

    }
  }

  userTopicData.exams = userTopicData.exams || []
  userTopicData.exams.push(userExam._id.toString())
  userTopicData.exams = userTopicData.exams.filter(utils.onlyUnique)
  await UserTopic.findByIdAndUpdate(userTopicData._id, {
    $set: {
      highestResult: currentHighestResult,
      knownAnswer: userExam.knownAnswer,
      exams: userTopicData.exams,
      totalExams: userTopicData.exams.length,
    }
  });

  //update userDeck
  if (userExam.result === EXAM.RESULT.PASSED) {
    let userDeckData = await UserItem.find({
      itemId: userExam.deckId,
      userId: userExam.userId,
      itemType: 'deck'
    })
    userDeckData = userDeckData[0]
    if (!userDeckData) {
      userDeckData = await UserItemService.addOneUserItem({
        topicId: userExam.topicId,
        itemId: userExam.deckId,
        userId: userExam.userId,
        itemType: 'deck'
      })
    }
    userDeckData.completedTopics = userDeckData.completedTopics || {}

    if (userDeckData.completedTopics[userExam.topicId] !== userTopicData._id) {
      userDeckData.completedTopics[userExam.topicId] = userTopicData._id

      await UserItem.findByIdAndUpdate(userDeckData._id, {
        $set: {
          completedTopics: userDeckData.completedTopics,
        }

      })


    }
  }

//  Update user info
  if (isCalculateTotalWord === true) {
    let queryData = {}
    queryData.userId = userExam.userId
    queryData.topicType = Constant.TOPIC.TYPE.TOPIC
    let result = (await LeaderBoardService.getGeneralLeaderBoard(queryData))['currentUser']
    let updatedLevel = utils.correctAnswerToLevel(result.totalCorrectAnswers)


    await UserInfo.findOneAndUpdate({
      firebaseUserId: userExam.userId
    }, {
      $set: {
        totalCorrectAnswers: result.totalCorrectAnswers,
        totalExams: result.totalExams,
        timeSpent: result.timeSpent,
        score: result.score,
        level: updatedLevel
      }

    })
    if (updatedLevel !== result.level) {
      let rewardEvent = {}
      rewardEvent.userId = userExam.userId;
      rewardEvent.timeRewarded = new Date()
      rewardEvent.type = Constant.REWARD_TYPE_NAME.UPDATE_LEVEL;
      rewardEvent.topicId = userExam.topicId;
      await RewardService.addRewardEvent(userExam.userId, rewardEvent)

    }
  }


}


exports.register = function (server, options) {

  server.expose('getOneUserExam', internals.getOneUserExam);
  server.expose('addOneUserExam', internals.addOneUserExam);
  server.expose('updateOneUserExam', internals.updateOneUserExam);
  server.expose('deleteOneUserExam', internals.deleteOneUserExam);
  server.expose('getUserExams', internals.getUserExams);
  server.expose('getRecentlyUserExams', internals.getRecentlyUserExams);
  server.expose('getLeaderBoard', internals.getLeaderBoard)


};
exports.getOneUserExam = internals.getOneUserExam;
exports.addOneUserExam = internals.addOneUserExam;
exports.updateOneUserExam = internals.updateOneUserExam;
exports.deleteOneUserExam = internals.deleteOneUserExam;
exports.getUserExams = internals.getUserExams;
exports.getRecentlyUserExams = internals.getRecentlyUserExams;
exports.getLeaderBoard = internals.getLeaderBoard;


exports.name = 'user-exam-service';
