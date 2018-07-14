'use strict';
const _ = require('lodash');
const internals = {};

const UserExam = require('../models/user-exam');
const UserTopic = require('../models/user-topic');
const UserDeck = require('../models/user-deck');
const utils = require('../utils/general');
const EXAM = require('../utils/constants').EXAM;

//UserExam

internals.getOneUserExam = async (id) => {
  return await UserExam.findById(id);
}

internals.addOneUserExam = async (userExam) => {
  userExam.timeCreated = new Date();
  // Todo: tính thêm các field dưới trước khi insert
  // totalQuestions - get deckIds length based on topic
  // score
  // result

  // Sau do Update lastExamResult, knownAnswer ben UserTopic

  let result = await UserExam.insertOne(userExam);
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


async function updateDataWhenCompletingUserExam(args) {


  await UserDeck.findByIdAndUpdate(args.userDeckId, {
    $addToSet: {exams: args.examId}
  })

  //update userTopic
  switch (args.type) {
    case EXAM.TYPE.TOPIC:
      //update userDeck
      if (args.result === EXAM.RESULT.PASSED) {
        let userDeckData = await UserDeck.findById(args.userDeckId)
        userDeckData.completedTopics = userDeckData.completedTopics || {}
        if (userDeckData.completedTopics[args.topicId] === undefined) {
          userDeckData.waitingReviewUserExamTopics == userDeckData.waitingReviewUserExamTopics || []
          userDeckData.waitingReviewUserExamTopics.push(args.topicId)
          userDeckData.completedTopics[args.topicId] = args.userTopicId
          await UserDeck.findByIdAndUpdate(args.userDeckId, {
            $set: {
              completedTopics: userDeckData.completedTopics,
              waitingReviewUserExamTopics: userDeckData.waitingReviewUserExamTopics,

            }
          })
        }

      }

      //update userTopic
      let userTopicData = await UserTopic.findById(args.userTopicId)
      let currentHighestResult = userTopicData.highestResult
      if (currentHighestResult.score < args.score) {
        currentHighestResult = {
          examId: args._id.toString(),
          score: args.score,
          result: args.result,
        }
      }
      userTopicData.exams.push(args._id.toString())
      userTopicData.exams = userTopicData.exams.filter(utils.onlyUnique)
      await UserTopic.findByIdAndUpdate(args.userTopicId, {
        $set: {
          highestResult: currentHighestResult,
          knownAnswer: args.knownAnswer,
          exams: userTopicData.exams
        }
      });
      break


    case EXAM.TYPE.REVIEW:
      userDeckData = await UserDeck.findById(args.userDeckId)
      let reviewUserExams = userDeckData.reviewUserExams || {};
      currentHighestResult = {
        examId: args._id.toString(),
        score: args.score,
        result: args.result,
      };
      reviewUserExams[args.userTopicId] = reviewUserExams[args.userTopicId] || {}
      reviewUserExams[args.userTopicId].exams = reviewUserExams[args.userTopicId].exams || []
      if (reviewUserExams[args.userTopicId] === undefined || reviewUserExams[args.userTopicId].highestResult.score < args.score) {
        reviewUserExams[args.userTopicId].highestResult = currentHighestResult
        if (reviewUserExams[args.userTopicId].highestResult.result === EXAM.RESULT.PASSED) {
          userDeckData.waitingReviewUserExamTopics = []
        }
      }
      reviewUserExams[args.userTopicId].exams.push(args._id.toString())
      reviewUserExams[args.userTopicId].exams = reviewUserExams[args.userTopicId].exams.filter(utils.onlyUnique)
      reviewUserExams[args.userTopicId].reviewTopics = reviewUserExams[args.userTopicId].reviewTopics || args.reviewTopics


      await UserDeck.findByIdAndUpdate(args.userDeckId, {
        $set: {
          reviewUserExams: reviewUserExams,
          waitingReviewUserExamTopics: userDeckData.waitingReviewUserExamTopics,
        }

      });
      break

    case EXAM.TYPE.FINAL:
      let userDeckData = await UserDeck.findById(args.userDeckId)

      userDeckData.finalUserExam = userDeckData.finalUserExam || {}

      if (userDeckData.finalUserExam.highestResult === undefined || userDeckData.finalUserExam.highestResult.score < args.score) {
        userDeckData.finalUserExam.highestResult = {
          examId: args._id.toString(),
          score: args.score,
          result: args.result,

        }

      }
      userDeckData.finalUserExam.exams = userDeckData.finalUserExam.exams || []
      userDeckData.finalUserExam.exams.push(args._id.toString())
      userDeckData.finalUserExam.exams = userDeckData.finalUserExam.exams.filter(utils.onlyUnique)

      await UserDeck.findByIdAndUpdate(args.userDeckId, {
        $set: {
          finalUserExam: userDeckData.finalUserExam
        }

      });
      break


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
