'use strict';

const Async = require('async');
const forEach = require('lodash/forEach');
const ObjectID = require('mongodb').ObjectID;

const Card = require('../models/card');
const Deck = require('../models/deck');
const UserInfo = require('../models/user-info');
const UserTopic = require('../models/user-topic');
const Exam = require('../models/exam');
const _ = require('lodash');
const internals = {};

internals.getOneCard = async (id) => {
  return await Card.findById(id);
}

//Topic

internals.getOneUserTopic = async (id) => {
  return await UserTopic.findById(id);
}

internals.addOneUserTopic = async (args) => {

  let result = await UserTopic.insertOne(args);
  return result[0]

}

internals.deleteOneUserTopic = async (id) => {
  let result = await UserTopic.findByIdAndDelete(id);
  if (result === undefined) result = {"_id": null}
  return result
}

internals.updateOneUserTopic = async (args) => {

  let id = args.id
  let updateObj = _.cloneDeep(args)
  delete updateObj['id']
  let result = await UserTopic.findByIdAndUpdate(
    id, {$set: updateObj});
  return result

}

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
  let result = await Exam.findByIdAndUpdate(
    id, {$set: updateObj});
  return result

}

//DeckPaginate

internals.getDeckPaginate = async (limit, page) => {
  let _limit = limit || 5;
  let _page = page || 1;
  return await Deck.pagedFind({}, _page, _limit, {});
}

internals.getDeckPaginateMapWithUserInfo = async (firebaseUId, limit, page) => {
  let _limit = limit || 5;
  let _page = page || 1;

  const paginateData = await Deck.pagedFind({}, _page, _limit, {});
  const userInfo = await UserInfo.findOne({
    firebaseUserId: firebaseUId
  });

  forEach(paginateData.data, (deckItem) => {
    if (userInfo.decks.indexOf(deckItem._id.toString()) >= 0) {
      deckItem.isOwned = true;
    } else {
      deckItem.isOwned = false;
    }
  })

  return paginateData;
}

internals.getUserOwnerDeckPaginate = async (firebaseUId, limit, page) => {
  let _limit = limit || 5;
  let _page = page || 1;

  const userInfo = await UserInfo.findOne({
    firebaseUserId: firebaseUId
  });

  const ids = userInfo.decks.map((id) => ObjectID(id));
  return await Deck.pagedFind({_id: {$in: ids}}, _page, _limit, {});
}

exports.register = function (server, options) {

  server.expose('getOneCard', internals.getOneCard);

  server.expose('getDeckPaginate', internals.getDeckPaginate);
  server.expose('getDeckPaginateMapWithUserInfo', internals.getDeckPaginateMapWithUserInfo);
  server.expose('getUserOwnerDeckPaginate', internals.getUserOwnerDeckPaginate);

  server.expose('getOneUserTopic', internals.getOneUserTopic);
  server.expose('addOneUserTopic', internals.addOneUserTopic);
  server.expose('updateOneUserTopic', internals.updateOneUserTopic);
  server.expose('deleteOneUserTopic', internals.deleteOneUserTopic);

  server.expose('getOneExam', internals.getOneExam);
  server.expose('addOneExam', internals.addOneExam);
  server.expose('updateOneExam', internals.updateOneExam);
  server.expose('deleteOneExam', internals.deleteOneExam);

};


exports.getDeckPaginate = internals.getDeckPaginate;
exports.getDeckPaginateMapWithUserInfo = internals.getDeckPaginateMapWithUserInfo;
exports.getUserOwnerDeckPaginate = internals.getUserOwnerDeckPaginate;

exports.getOneCard = internals.getOneCard;

exports.getOneUserTopic = internals.getOneUserTopic;
exports.addOneUserTopic = internals.addOneUserTopic;
exports.updateOneUserTopic = internals.updateOneUserTopic;
exports.deleteOneUserTopic = internals.deleteOneUserTopic;

exports.getOneExam = internals.getOneExam;
exports.addOneExam = internals.addOneExam;
exports.updateOneExam = internals.updateOneExam;
exports.deleteOneExam = internals.deleteOneExam;


exports.name = 'quiz-service';
