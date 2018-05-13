'use strict';

const Joi = require('joi');
const MongoModels = require('mongo-models');

class WalletCategory extends MongoModels {
  static create(firebase_uid, name, color, callback) {
    const document = {
      firebaseUserId: firebase_uid,
      name,
      color,
      timeUpdated: new Date(),
      timeCreated: new Date()
    };

    this.insertOne(document, callback);
  }

  static deleteOne(firebase_uid, categoryId, callback) {
    findOneAndDelete({
      _id: ObjectID(categoryId),
      firebaseUserId: firebase_uid
    }, callback);
  }
};

WalletCategory.collection = 'wallet_categories';

WalletCategory.schema = Joi.object().keys({
  firebaseUserId: Joi.string().required(),
  name: Joi.string().required(),
  color: Joi.string().required(),
  timeUpdated: Joi.date().required().default(new Date()),
  timeCreated: Joi.date().required().default(new Date())
});

WalletCategory.indexes = [
    { key: { _id: 1 } }
];

module.exports = WalletCategory;
