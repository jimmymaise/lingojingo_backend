'use strict';

const Joi = require('joi');
const MongoModels = require('mongo-models');

class WalletCategory extends MongoModels {
  static async create(firebase_uid, name, color) {
    const document = {
      firebaseUserId: firebase_uid,
      name,
      color,
      timeUpdated: new Date(),
      timeCreated: new Date()
    };

    return await this.insertOne(document);
  }

  static async deleteOne(firebase_uid, categoryId) {
    return await findOneAndDelete({
      _id: ObjectID(categoryId),
      firebaseUserId: firebase_uid
    });
  }
};

WalletCategory.collectionName = 'wallet_categories';

WalletCategory.schema = Joi.object().keys({
  _id: Joi.object(),
  firebaseUserId: Joi.string().required(),
  name: Joi.string().required(),
  color: Joi.string().required(),
  timeUpdated: Joi.date().required().default(new Date()),
  timeCreated: Joi.date().required().default(new Date())
});

module.exports = WalletCategory;
