'use strict';

const Async = require('async');

const UserInfo = require('../models/user-info');

const internals = {};

internals.createOrUpdate = async (firebaseUId, data) => {
  const currentInfo = await internals.findByFirebaseUId(firebaseUId);

  // Update Current
  return await UserInfo.findOneAndUpdate({
    firebaseUserId: firebaseUId
  }, {
    $set: {
      firebaseUserId: firebaseUId,
      ...currentInfo,
      ...data,
      ...{
        timeUpdated: new Date(),
        timeCreated: new Date()
      }
    }
  }, {
    upsert: true,
    setDefaultsOnInsert: true
  });
}

internals.createOrUpdateForClient = async (firebaseUId, data) => {
  return UserInfo.transformToClientResponseData(await internals.createOrUpdate(firebaseUId, data));
}

internals.findByFirebaseUId = async (firebaseUId) => {
  return await UserInfo.findOne({
    firebaseUserId: firebaseUId
  });
}

internals.getOne = async (firebaseUId) => {
  const data = await UserInfo.findOne({
    firebaseUserId: firebaseUId
  });
  let responseData = data;

  if (!data) {
    responseData = {
      firebaseUserId: firebaseUId,
      fullName: '',
      email: '',
      phone: '',
      avatarUrl: '',
      aboutContent: '',
      isLearnMailNotify: true,
      isNewBlogMailNotify: true,
      isGeneralMailNotify: true
    }
  }

  return responseData;
}

internals.getOneById = async (id) => {
  const data = await UserInfo.findById({
    _id: id
  });
  let responseData = data;

  if (!data) {
    responseData = {
      firebaseUserId: firebaseUId,
      fullName: '',
      email: '',
      phone: '',
      avatarUrl: '',
      aboutContent: '',
      isLearnMailNotify: true,
      isNewBlogMailNotify: true,
      isGeneralMailNotify: true
    }
  }

  return responseData;
}


internals.getOneForClient = async (firebaseUId) => {
  return UserInfo.transformToClientResponseData(await internals.getOne(firebaseUId));
}

exports.register = function (server, options) {

  server.expose('createOrUpdate', internals.createOrUpdate);
  server.expose('createOrUpdateForClient', internals.createOrUpdateForClient);
  server.expose('findByFirebaseUId', internals.findByFirebaseUId);
  server.expose('getOne', internals.getOne);
  server.expose('getOneById', internals.getOneById);

  server.expose('getOneForClient', internals.getOneForClient);

  return;
};

exports.createOrUpdate = internals.createOrUpdate;
exports.createOrUpdateForClient = internals.createOrUpdateForClient;
exports.findByFirebaseUId = internals.findByFirebaseUId;
exports.getOne = internals.getOne;
exports.getOneById = internals.getOneById;

exports.getOneForClient = internals.getOneForClient;

exports.name = 'user-info-service';
