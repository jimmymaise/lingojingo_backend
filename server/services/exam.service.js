'use strict';
const _ = require('lodash');
const internals = {};


const Exam = require('../models/exam');
const UserTopic = require('../models/user-topic');
const UserDeck = require('../models/user-deck');
const utils = require('../utils/general');
const EXAM = require('../utils/constants').EXAM;

//Exam

internals.getOneExam = async (id) => {
  return await Exam.findById(id);
}

internals.addOneExam = async (args) => {

  let result = await Exam.insertOne(args);
  return result[0]

}

internals.deleteOneExam = async (id) => {
  let result = await Exam.findByIdAndDelete(id);
  if (result === undefined)
    result = {
      "_id": null
    }
  return result
}

internals.updateOneExam = async (args) => {
  let id = args.id
  let updateObj = _.cloneDeep(args)
  delete updateObj['id']
  delete updateObj['isCompleted']
  let result = await Exam.findByIdAndUpdate(
    id, {$set: updateObj});
  if (args.isCompleted) {
    let data = await Exam.findById(id);
    await updateDataWhenCompletingExam(data)
  }
  return result

}


async function updateDataWhenCompletingExam(args) {


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
          userDeckData.waitingReviewExamTopics == userDeckData.waitingReviewExamTopics || []
          userDeckData.waitingReviewExamTopics.push(args.topicId)
          userDeckData.completedTopics[args.topicId] = args.userTopicId
          await UserDeck.findByIdAndUpdate(args.userDeckId, {
            $set: {
              completedTopics: userDeckData.completedTopics,
              waitingReviewExamTopics: userDeckData.waitingReviewExamTopics,

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
          notRemembers: args.wrongAnswers,
          exams: userTopicData.exams
        }
      });
      break


    case EXAM.TYPE.REVIEW:
      userDeckData = await UserDeck.findById(args.userDeckId)
      let reviewExams = userDeckData.reviewExams || {};
      currentHighestResult = {
        examId: args._id.toString(),
        score: args.score,
        result: args.result,
      };
      reviewExams[args.userTopicId] = reviewExams[args.userTopicId] || {}
      reviewExams[args.userTopicId].exams = reviewExams[args.userTopicId].exams || []
      if (reviewExams[args.userTopicId] === undefined || reviewExams[args.userTopicId].highestResult.score < args.score) {
        reviewExams[args.userTopicId].highestResult = currentHighestResult
        if (reviewExams[args.userTopicId].highestResult.result === EXAM.RESULT.PASSED) {
          userDeckData.waitingReviewExamTopics = []
        }
      }
      reviewExams[args.userTopicId].exams.push(args._id.toString())
      reviewExams[args.userTopicId].exams = reviewExams[args.userTopicId].exams.filter(utils.onlyUnique)
      reviewExams[args.userTopicId].reviewTopics = reviewExams[args.userTopicId].reviewTopics || args.reviewTopics


      await UserDeck.findByIdAndUpdate(args.userDeckId, {
        $set: {
          reviewExams: reviewExams,
          waitingReviewExamTopics: userDeckData.waitingReviewExamTopics,
        }

      });
      break

    case EXAM.TYPE.FINAL:
      let userDeckData = await UserDeck.findById(args.userDeckId)

      userDeckData.finalExam = userDeckData.finalExam || {}

      if (userDeckData.finalExam.highestResult === undefined || userDeckData.finalExam.highestResult.score < args.score) {
        userDeckData.finalExam.highestResult = {
          examId: args._id.toString(),
          score: args.score,
          result: args.result,

        }

      }
      userDeckData.finalExam.exams = userDeckData.finalExam.exams || []
      userDeckData.finalExam.exams.push(args._id.toString())
      userDeckData.finalExam.exams = userDeckData.finalExam.exams.filter(utils.onlyUnique)

      await UserDeck.findByIdAndUpdate(args.userDeckId, {
        $set: {
          finalExam: userDeckData.finalExam
        }

      });
      break


  }


}


exports.register = function (server, options) {

  server.expose('getOneExam', internals.getOneExam);
  server.expose('addOneExam', internals.addOneExam);
  server.expose('updateOneExam', internals.updateOneExam);
  server.expose('deleteOneExam', internals.deleteOneExam);


};
exports.getOneExam = internals.getOneExam;
exports.addOneExam = internals.addOneExam;
exports.updateOneExam = internals.updateOneExam;
exports.deleteOneExam = internals.deleteOneExam;


exports.name = 'exam-service';
