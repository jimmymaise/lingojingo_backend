'use strict';
const _ = require('lodash');
const internals = {};

const UserExam = require('../models/user-exam');
const UserTopic = require('../models/user-topic');
const UserDeck = require('../models/user-deck');
const Deck = require('../models/deck');

const utils = require('../utils/general');
const EXAM = require('../utils/constants').EXAM;

function calculateScore(knownAnswer, totalQuestion) {
  let numCorrect = 0;
  for (let ans in knownAnswer) {
    if (knownAnswer[ans] === true) {
      numCorrect++
    }
  }
  return Math.round((numCorrect / totalQuestion) * 100)

}


//UserExam

internals.getOneUserExam = async (id) => {
  return await UserExam.findById(id);
}

internals.addOneUserExam = async (userExam) => {
  userExam.timeCreated = new Date();
  let deckData = await Deck.findById(userExam.deckId)
  userExam.totalQuestions = userExam.knownAnswer.keys(obj).length
  userExam.score = calculateScore(userExam.knownAnswer, userExam.totalQuestions)
  userExam['result'] = userExam.score >= deckData.passScore ? EXAM.RESULT.PASSED : EXAM.RESULT.FAILED

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
    userId: userExam.userId
  })
  userTopicData = userTopicData[0]

  let currentHighestResult = userTopicData.highestResult || {}
  if (currentHighestResult.score || 0 < userExam.score) {
    currentHighestResult = {
      examId: userExam._id.toString(),
      score: userExam.score,
      result: userExam.result,
    }
  }

  userTopicData.exams = userTopicData.exams || []
  userTopicData.exams.push(userExam._id.toString())
  userTopicData.exams = userTopicData.exams.filter(utils.onlyUnique)
  await UserTopic.findByIdAndUpdate(userTopicData._id, {
    $set: {
      highestResult: currentHighestResult,
      knownAnswer: userExam.knownAnswer,
      exams: userTopicData.exams
    }
  });

  //update userDeck
  if (userExam.result === EXAM.RESULT.PASSED) {
    let userDeckData = await UserDeck.find({
      deckId: userExam.deckId,
      userId: userExam.userId
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


}


exports.register = function (server, options) {

  server.expose('getOneUserExam', internals.getOneUserExam);
  server.expose('addOneUserExam', internals.addOneUserExam);
  server.expose('updateOneUserExam', internals.updateOneUserExam);
  server.expose('deleteOneUserExam', internals.deleteOneUserExam);


};
exports.getOneUserExam = internals.getOneUserExam;
exports.addOneUserExam = internals.addOneUserExam;
exports.updateOneUserExam = internals.updateOneUserExam;
exports.deleteOneUserExam = internals.deleteOneUserExam;


exports.name = 'user-exam-service';
