'use strict';

const Async = require('async');

const WalletCategory = require('../models/wallet-category');
const WalletTransaction = require('../models/wallet-transaction');

const internals = {};

internals.getAllCategory = async (firebase_uid) => {
  return await WalletCategory.find({
    firebaseUserId: firebase_uid
  }, {
    firebaseUserId: 0,
    timeUpdated: 0,
    timeCreated: 0
  });
}

internals.getTransactionPaginate = async (firebase_uid, fromDate, toDate, limit, page) => {
  const result = await WalletTransaction.pagedFind({
    $and: [
      {
        firebaseUserId: firebase_uid
      },
      {
        transactionDate: {$gte: fromDate}
      },
      {
        transactionDate: {$lte: toDate}
      }
    ]
  }, {
    firebaseUserId: 0,
    timeUpdated: 0,
    timeCreated: 0
  }, 'transactionDate', limit, page);

  const newData = [];

  if (result.data && result.data.length) {
    for (let i = 0; i < result.data.length; i++) {
      newData.push({
        _id: result.data[i]._id,
        description: result.data[i].description,
        categoryId: result.data[i].categoryId,
        transactionDate: result.data[i].transactionDate.getTime(),
        amount: result.data[i].amount
      })
    }
  }

  result.data = newData;

  return result;
}

internals.createCategory = async (firebase_uid, name, color) => {
  return await WalletCategory.create(firebase_uid, name, color);
}

internals.createTransaction = async (firebase_uid, data) => {
  return await WalletTransaction.create(firebase_uid, data);
}

exports.register = function (server, options) {

  server.expose('createCategory', internals.createCategory);
  server.expose('createTransaction', internals.createTransaction);
  server.expose('getAllCategory', internals.getAllCategory);
  server.expose('getTransactionPaginate', internals.getTransactionPaginate);

  return;
};

exports.createCategory = internals.createCategory;
exports.createTransaction = internals.createTransaction;
exports.getAllCategory = internals.getAllCategory;
exports.getTransactionPaginate = internals.getTransactionPaginate;

exports.name = 'wallet-service';
