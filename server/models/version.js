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
  message: [Joi.string().optional(), Joi.allow(null)],
  release: [Joi.object().optional(), Joi.allow(null)],



}).options({stripUnknown: true});

Version.indexes = [];

module.exports = Version;

