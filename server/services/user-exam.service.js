'use strict';
const _ = require('lodash');
const internals = {};
const Constant = require('../utils/constants')
const UserInfo = require('../models/user-info');
const UserExam = require('../models/user-exam');
const UserTopic = require('../models/user-topic');
const UserDeck = require('../models/user-item');
const Deck = require('../models/deck');
const LeaderBoardService = require('../services/leader-board.service')
const RewardService = require('../services/reward.service')
const utils = require('../utils/general');
const EXAM = require('../utils/constants').EXAM;
const UserTopicService = require('../services/user-topic.service');


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

internals.addOneUserExam = async (userExam) => {
  userExam.timeCreated = new Date();
  let deckData = await Deck.findById(userExam.deckId)
  userExam.totalQuestions = Object.keys(userExam.knownAnswer).length
  userExam.totalCorrectAnswers = calculateTotalCorrectAnswer(userExam.knownAnswer, userExam.totalQuestions)
  userExam.score = Math.round((userExam.totalCorrectAnswers / userExam.totalQuestions) * 100)
  userExam.timeSpentAvg = userExam.totalQuestions > 0 ? Math.round(userExam.timeSpent / userExam.totalQuestions) : null
  userExam.result = userExam.score >= deckData.passScore ? EXAM.RESULT.PASSED : EXAM.RESULT.FAILED


// Sau do Update lastExamResult, knownAnswer ben UserTopic

  let result = await UserExam.insertOne(userExam);
  await updateDataWhenCompletingUserExam(userExam)
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
  if (!userTopicData) {
    userTopicData = UserTopicService.addOneUserTopic(userExam.userId, {
      topicId: userExam.topicId,
      deckId: userExam.deckId,
    })
  }
  userTopicData = userTopicData[0]

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
    let userDeckData = await UserDeck.find({
      itemId: userExam.deckId,
      userId: userExam.userId,
      itemType: 'deck'
    })
    userDeckData = userDeckData[0]
    userDeckData.completedTopics = userDeckData.completedTopics || {}

    if (userDeckData.completedTopics[userExam.topicId] !== userTopicData._id) {
      userDeckData.completedTopics[userExam.topicId] = userTopicData._id

      await UserDeck.findByIdAndUpdate(userDeckData._id, {
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
    let result = LeaderBoardService.getGeneralLeaderBoard(queryData)
    let updatedLevel = utils.correctAnswerToLevel(result.totalCorrectAnswers)


    await UserInfo.findByIdAndUpdate(userExam.userId, {
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
      RewardService.addRewardEvent(userExam.userId)

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


};
exports.getOneUserExam = internals.getOneUserExam;
exports.addOneUserExam = internals.addOneUserExam;
exports.updateOneUserExam = internals.updateOneUserExam;
exports.deleteOneUserExam = internals.deleteOneUserExam;
exports.getUserExams = internals.getUserExams;
exports.getRecentlyUserExams = internals.getRecentlyUserExams;

exports.name = 'user-exam-service';
