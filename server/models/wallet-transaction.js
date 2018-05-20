'use strict';

const Joi = require('joi');
const ObjectID = require('mongodb').ObjectID;
const MongoModels = require('mongo-models');

class WalletTransaction extends MongoModels {
  static async create(firebase_uid, data) {
    const document = {
      firebaseUserId: firebase_uid,
      description: data.description,
      categoryId: data.categoryId,
      transactionDate: data.transactionDate,
      amount: data.amount,
      timeUpdated: new Date(),
      timeCreated: new Date()
    };

    return await this.insertOne(document);
  }

  static async deleteByCategory(firebase_uid, categoryId) {
    return await this.deleteMany({
      firebaseUserId: firebase_uid,
      categoryId: ObjectID(categoryId)
    });
  }

  static async deleteOne(firebase_uid, id) {
    return await this.findOneAndDelete({
      _id: ObjectID(id),
      firebaseUserId: firebase_uid
    });
  }
};

WalletTransaction.collectionName = 'wallet_transactions';

WalletTransaction.schema = Joi.object().keys({
  _id: Joi.object(),
  firebaseUserId: Joi.string().required(),
  description: Joi.string().required(),
  categoryId: Joi.object(),
  transactionDate: Joi.date().required(),
  amount: Joi.number().required().default(0),
  timeUpdated: Joi.date().required().default(new Date()),
  timeCreated: Joi.date().required().default(new Date())
});

module.exports = WalletTransaction;
