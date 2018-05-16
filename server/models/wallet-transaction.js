'use strict';

const Joi = require('joi');
const ObjectID = require('mongodb').ObjectID;
const MongoModels = require('mongo-models');

class WalletTransaction extends MongoModels {
  static create(firebase_uid, data, callback) {
    const document = {
      firebaseUserId: firebase_uid,
      description: data.description,
      categoryId: data.categoryId,
      transactionDate: data.transactionDate,
      amount: data.amount,
      timeUpdated: new Date(),
      timeCreated: new Date()
    };

    this.insertOne(document, callback);
  }

  static deleteByCategory(firebase_uid, categoryId, callback) {
    this.deleteMany({
      firebaseUserId: firebase_uid,
      categoryId: ObjectID(categoryId)
    }, callback);
  }

  static deleteOne(firebase_uid, id, callback) {
    this.findOneAndDelete({
      _id: ObjectID(id),
      firebaseUserId: firebase_uid
    }, callback);
  }
};

WalletTransaction.collectionName = 'wallet_transactions';

WalletTransaction.schema = Joi.object().keys({
  firebaseUserId: Joi.string().required(),
  description: Joi.string().required(),
  categoryId: Joi.object(),
  transactionDate: Joi.date().required(),
  amount: Joi.number().required().default(0),
  timeUpdated: Joi.date().required().default(new Date()),
  timeCreated: Joi.date().required().default(new Date())
});

WalletTransaction.indexes = [
    { key: { _id: 1 } }
];

module.exports = WalletTransaction;
