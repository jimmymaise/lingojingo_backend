'use strict';

const Async = require('async');

const internals = {};
let WalletCategory;
let WalletTransaction;

internals.init = function (server, next) {
  const mongoModels = server.plugins['hapi-mongo-models'];
  WalletCategory = mongoModels.WalletCategory;
  WalletTransaction = mongoModels.WalletTransaction;

  next();
};

internals.getAllCategory = (firebase_uid, callback) => {
  WalletCategory.find({
    firebaseUserId: firebase_uid
  }, {
    firebaseUserId: 0,
    timeUpdated: 0,
    timeCreated: 0
  }, callback);
}

internals.getTransactionPaginate = (firebase_uid, fromDate, toDate, limit, page, callback) => {
  WalletTransaction.pagedFind({
    $and: [
      {
        firebaseUserId: firebase_uid
      },
      { 
        transactionDate: { $gte: fromDate }
      },
      { 
        transactionDate: { $lte: toDate }
      }
  ]}, {
    firebaseUserId: 0,
    timeUpdated: 0,
    timeCreated: 0
  }, 'transactionDate', limit, page, (err, result) => {
    if (err) {
      callback(err, result);
    } else {
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
      callback(err, result);
    }
  });
}

internals.createCategory = (firebase_uid, name, color, callback) => {
  WalletCategory.create(firebase_uid, name, color, callback);
}

internals.createTransaction = (firebase_uid, data, callback) => {
  WalletTransaction.create(firebase_uid, data, callback);
}

internals.deleteCategory = (firebase_uid, categoryId, callback) => {
  Async.parallel([
    function(asyncCallback) {
      WalletCategory.deleteOne(firebase_uid, categoryId, asyncCallback);
    },
    function(asyncCallback) {
      WalletTransaction.deleteByCategory(firebase_uid, categoryId, asyncCallback);
    }
  ], callback);
}

internals.deleteTransaction = (firebase_uid, transaction_id, callback) => {
  WalletTransaction.deleteOne(firebase_uid, transaction_id, callback);
}

internals.totalAmount = (firebase_uid, fromDate, toDate, callback) => {
  let match = {};
  if (fromDate && toDate) {
    match = {
      $and: [
          {
            firebaseUserId: firebase_uid
          },
          { 
            transactionDate: { $gte: fromDate }
          },
          { 
            transactionDate: { $lte: toDate }
          }
      ]
    };
  } else {
    match = {
      firebaseUserId: firebase_uid
    };
  }
  WalletTransaction.aggregate([
    {
      $match: match
    },
    {
      $group: {
        _id: "$firebaseUserId",
        totalAmount: { $sum: '$amount' }
      }
    }
  ], {
    explain: false,
    allowDiskUse: true
  }, callback);
}

exports.register = function (server, options, next) {
  server.dependency(['hapi-mongo-models'], internals.init);

  server.expose('createCategory', internals.createCategory);
  server.expose('createTransaction', internals.createTransaction);
  server.expose('deleteCategory', internals.deleteCategory);
  server.expose('getAllCategory', internals.getAllCategory);
  server.expose('getTransactionPaginate', internals.getTransactionPaginate);
  server.expose('totalAmount', internals.totalAmount);
  server.expose('deleteCategory', internals.deleteCategory);
  server.expose('deleteTransaction', internals.deleteTransaction);

  next();
};

exports.createCategory = internals.createCategory;
exports.createTransaction = internals.createTransaction;
exports.deleteCategory = internals.deleteCategory;
exports.getAllCategory = internals.getAllCategory;
exports.getTransactionPaginate = internals.getTransactionPaginate;
exports.totalAmount = internals.totalAmount;
exports.deleteCategory = internals.deleteCategory;
exports.deleteTransaction = internals.deleteTransaction;

exports.register.attributes = {
  name: 'wallet-service'
};
