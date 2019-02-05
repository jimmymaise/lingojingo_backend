'use strict';


const UserItem = require('../models/user-item');
const _ = require('lodash');
const internals = {};
const ObjectID = require('mongodb').ObjectID;


//User Item
internals.getOneMyUserItemByItemId = async (userId, itemId, itemType) => {
  return await UserItem.findOne({
    userId,
    itemId,
    itemType
  });
}

internals.getOneUserItem = async (id) => {
  return await UserItem.findById(id);
}

internals.addOneUserItem = async (args) => {
  let result = await UserItem.findOne({itemId: args.itemId, userId: args.userId, itemType: args.itemType});
  if (result) return result
  result = await UserItem.insertOne(args);
  return result[0]

}

internals.deleteOneUserItem = async (id) => {
  let result = await UserItem.findOneAndDelete({_id: ObjectID(args.id), userId: args.userId});
  if (result === undefined) result = {"_id": null}
  return result
}

internals.updateOneUserItem = async (args) => {
  let updateObj = _.cloneDeep(args)
  delete updateObj['id']
  delete updateObj['userId']

  let result = await UserItem.findOneAndUpdate(
    {_id: ObjectID(args.id), userId: args.userId}, {$set: updateObj});
  return result

}

internals.updateItemFavorite = async (userId, userItemId, status) => {
  let result = await UserItem.findOneAndUpdate(
    {_id: ObjectID(userItemId), userId: userId}, {$set: {favorite: status}});
  return result

}

internals.addTopicStudy = async (userId, userItemId, topicId, data = {}) => {
  let result = await UserItem.findOne({_id: ObjectID(userItemId), userId: userId});
  result['studyTopics'] = result['studyTopics'] || {}
  result['studyTopics'][topicId] = result['studyTopics'][topicId] || data
  result = await UserItem.findOneAndUpdate(
    {_id: ObjectID(userItemId), userId: userId}, {$set: {studyTopics: result['studyTopics']}});
  return result
}


internals.searchUserItem = async (args) => {

  let body = await UserItem.bodyBuilder()
  let search = args.search || {}
  let page = _.get(args, 'pagination.page') || 2
  let limit = _.get(args, 'pagination.limit') || 10
  // let from = size* (page - 1)
  if (limit > 50) {
    throw Error('Limit should be lower than 50')
  }
  body.page(page)
  body.limit(limit)

  if (search.name) {
    // First query the almost match, will have boost score
    // Second query the words but not follow order
    body.orQuery('match_phrase', 'itemInfo.name', {query: search.name, analyzer: 'nameIndexAnalyzer', 'boost': '5'})
    body.orQuery('match', 'itemInfo.name', {query: search.name, operator: 'and'})
    body.queryMinimumShouldMatch(1)
  }
  if (search.itemType) {
    body.query('match', 'itemType', search.itemType)
  }
  if (search.userId) {
    body.query('match', 'userId', search.userId)
  }
  if (search.favorite) {
    body.query('match', 'favorite', search.favorite)
  }

  let data = await UserItem.searchWithBodyBuilder()

  return data


}

exports.register = function (server, options) {


  server.expose('getOneMyUserItemByItemId', internals.getOneMyUserItemByItemId)
  server.expose('getOneUserItem', internals.getOneUserItem);
  server.expose('addOneUserItem', internals.addOneUserItem);
  server.expose('updateOneUserItem', internals.updateOneUserItem);
  server.expose('deleteOneUserItem', internals.deleteOneUserItem);
  server.expose('createOrUpdateUserTopic', internals.createOrUpdateUserTopic);
  server.expose('searchUserItem', internals.searchUserItem);
  server.expose('addTopicStudy', internals.addTopicStudy);
  server.expose('updateItemFavorite', internals.updateItemFavorite);


};


exports.getOneMyUserItemByItemId = internals.getOneMyUserItemByItemId;
exports.getOneUserItem = internals.getOneUserItem;
exports.addOneUserItem = internals.addOneUserItem;
exports.updateOneUserItem = internals.updateOneUserItem;
exports.deleteOneUserItem = internals.deleteOneUserItem;
exports.createOrUpdateUserTopic = internals.createOrUpdateUserTopic;
exports.searchUserItem = internals.searchUserItem;
exports.addTopicStudy = internals.addTopicStudy;
exports.updateItemFavorite = internals.updateItemFavorite;


exports.name = 'user-item-service';
