'use strict';


const UserItem = require('../models/user-item');
const _ = require('lodash');
const internals = {};


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
  let userInfo = await UserInfo.findById(args.userInfo);
  if (!userInfo.items || !(args.itemId in userInfo.items)) {
    throw new Error(`User must own the item ${args.itemId} to learn it`);
  }
  let result = await UserItem.insertOne(args);
  return result[0]

}

internals.deleteOneUserItem = async (id) => {
  let result = await UserItem.findByIdAndDelete(id);
  if (result === undefined) result = {"_id": null}
  return result
}

internals.updateOneUserItem = async (args) => {
  let id = args.id
  let updateObj = _.cloneDeep(args)
  delete updateObj['id']
  let result = await UserItem.findByIdAndUpdate(
    id, {$set: updateObj});
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


};


exports.getOneMyUserItemByItemId = internals.getOneMyUserItemByItemId;
exports.getOneUserItem = internals.getOneUserItem;
exports.addOneUserItem = internals.addOneUserItem;
exports.updateOneUserItem = internals.updateOneUserItem;
exports.deleteOneUserItem = internals.deleteOneUserItem;
exports.createOrUpdateUserTopic = internals.createOrUpdateUserTopic;
exports.searchUserItem = internals.searchUserItem;


exports.name = 'user-item-service';
