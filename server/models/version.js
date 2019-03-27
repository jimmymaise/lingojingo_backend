'use strict';

const Joi = require('joi');
const MongoModels = require('mongo-models');

class Version extends MongoModels {
};

Version.collectionName = 'version';

Version.schema = Joi.object().keys({
  _id: Joi.object(),
  type: Joi.string().required(),
  version: Joi.string().required(),
  description: [Joi.string().optional(), Joi.allow(null)],


}).options({stripUnknown: true});

Version.indexes = [];

module.exports = Version;

