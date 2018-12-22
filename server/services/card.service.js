'use strict';

const ObjectID = require('mongodb').ObjectID;
const Card = require('../models/card');
const _ = require('lodash');
const internals = {};

internals.getOneCard = async (id) => {

    return await Card.findById(id);
}


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


exports.register = function (server, options) {
    server.expose('getOneCard', internals.getOneCard);
    server.expose('updateOneCard', internals.updateOneCard);
    server.expose('createOneCard', internals.createOneCard);

};


exports.getOneCard = internals.getOneCard;
exports.updateOneCard = internals.updateOneCard;
exports.createOneCard = internals.createOneCard;


exports.name = 'card-service';
