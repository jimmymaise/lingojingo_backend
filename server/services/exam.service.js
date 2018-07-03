'use strict';
const _ = require('lodash');
const internals = {};

const Async = require('async');
const forEach = require('lodash/forEach');
const ObjectID = require('mongodb').ObjectID;

const Exam = require('../models/exam');
const UserTopic = require('../models/user-topic');
const UserDeck = require('../models/user-deck');
const utils = require('../utils/general');

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
  if (result === undefined) result = {"_id": null}
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
    await update_other_data_when_completing_exam(data)
  }
  return result

}


async function update_other_data_when_completing_exam(args) {


  await UserDeck.findByIdAndUpdate(args.userDeckId, {
    $addToSet: {exams: args.examId}
  })

  //update userTopic
  if (args.type === 'TopicExam') {
    //update userDeck
    if (args.result === "pass") {
      let userDeckData = await UserDeck.findById(args.userDeckId)
      if (userDeckData.completedTopics === undefined) {
        userDeckData.completedTopics = {}
      }
      if (userDeckData.completedTopics[args.topicId] === undefined) {
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


  }
  else if (args.type === 'FinalExam') {
    let userDeckData = await UserDeck.findById(args.userDeckId)
    if (userDeckData.finalExam === undefined) {
      userDeckData.finalExam = {}
    }
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

  }
  else if (args.type === 'ReviewExam') {
    let userDeckData = await UserDeck.findById(args.userDeckId)
    let reviewExams = userDeckData.reviewExams || {};
    let currentHighestResult = {
      examId: args._id.toString(),
      score: args.score,
      result: args.result,
    };

    if (reviewExams[args.userTopicId] !== undefined) {
      if (reviewExams[args.userTopicId].highestResult.score < args.score) {
        reviewExams[args.userTopicId].highestResult = currentHighestResult
      }

      reviewExams[args.userTopicId].exams.push(args._id.toString())
      reviewExams[args.userTopicId].exams = reviewExams[args.userTopicId].exams.filter(utils.onlyUnique)


    }
    else {
      reviewExams[args.userTopicId] = {};
      reviewExams[args.userTopicId].highestResult = currentHighestResult
      reviewExams[args.userTopicId].exams = _.uniq(reviewExams[args.userTopicId].exams, 'id');
      reviewExams[args.userTopicId].reviewTopics = args.reviewTopics
    }

    if (reviewExams[args.userTopicId].highestResult.result === "pass") {
      userDeckData.waitingReviewExamTopics = []
    }
    await UserDeck.findByIdAndUpdate(args.userDeckId, {
      $set: {
        reviewExams: reviewExams,
        waitingReviewExamTopics: userDeckData.waitingReviewExamTopics,
      }

    });

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
