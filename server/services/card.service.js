'use strict';

const ObjectID = require('mongodb').ObjectID;
const Card = require('../models/card');
const _ = require('lodash');
const internals = {};

//Query
internals.getOneCard = async (id) => {

  return await Card.findById(id);
}

//Mutation for administrator
internals.createOneCard = async (cardData) => {
  let result = await Card.insertOne(cardData);
  return result[0]
}


internals.updateOneCard = async (_id, cardData) => {
  let result = await Card.findOneAndUpdate({
    _id: ObjectID(_id),
  }, {
    $set: cardData

  });
  if (!result) {
    throw Error('Cannot update! Perhaps Card Not Found');
  }
  return result
}

internals.deleteOneCard = async (_id) => {
  let result = await Card.findOneAndDelete({_id: ObjectID(_id)});
  if (!result) {
    throw Error('Cannot delete! Perhaps Card Not Found');
  }
  return result
}


exports.register = function (server, options) {
  server.expose('getOneCard', internals.getOneCard);

  server.expose('updateOneCard', internals.updateOneCard);
  server.expose('createOneCard', internals.createOneCard);
  server.expose('deleteOneCard', internals.deleteOneCard);


};


exports.getOneCard = internals.getOneCard;

exports.updateOneCard = internals.updateOneCard;
exports.createOneCard = internals.createOneCard;
exports.deleteOneCard = internals.deleteOneCard;


exports.name = 'card-service';
