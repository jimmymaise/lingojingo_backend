'use strict';

const ObjectID = require('mongodb').ObjectID;
const Topic = require('../models/topic');
const _ = require('lodash');
const internals = {};

//Query
internals.getOneTopic = async (id) => {
  return await Topic.findById(id);
}

//Mutation for administrator
internals.createOneTopic = async (topicData) => {
  let result = await Topic.insertOne(topicData);
  return result[0]
}


internals.updateOneTopic = async (_id, topicData) => {
  let result = await Topic.findOneAndUpdate({
    _id: ObjectID(_id),
  }, {
    $set: topicData

  });
  if (!result) {
    throw Error('Cannot update! Perhaps Topic Not Found');
  }
  return result
}

internals.deleteOneTopic = async (_id) => {
  let result = await Topic.findOneAndDelete({_id: ObjectID(_id)});
  if (!result) {
    throw Error('Cannot delete! Perhaps Topic Not Found');
  }
  return result
}


exports.register = function (server, options) {
  server.expose('getOneTopic', internals.getOneTopic);

  server.expose('updateOneTopic', internals.updateOneTopic);
  server.expose('createOneTopic', internals.createOneTopic);
  server.expose('deleteOneTopic', internals.deleteOneTopic);


};


exports.getOneTopic = internals.getOneTopic;

exports.updateOneTopic = internals.updateOneTopic;
exports.createOneTopic = internals.createOneTopic;
exports.deleteOneTopic = internals.deleteOneTopic;


exports.name = 'topic-service';
