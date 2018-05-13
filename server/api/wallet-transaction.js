'use strict';

const Boom = require('boom');
const Joi = require('joi');
const Async = require('async');

const utils = require('../utils');

const internals = {};

internals.applyRoutes = function (server, next) {
  const WalletService = server.plugins['wallet-service'];

  // POST new transaction
  server.route({
    method: 'POST',
    path: '/category/{categoryId}/transaction',
    config: {
      auth: 'firebase',
      validate: {
        payload: {
          description: Joi.string(),
          transactionDate: Joi.number(),
          amount: Joi.number()
        }
      }
    },
    handler: function (request, reply) {
      const { description, transactionDate, amount } = request.payload;
      WalletService.createTransaction(request.auth.credentials.uid, {
        description,
        categoryId: request.params.categoryId,
        transactionDate: new Date(transactionDate),
        amount
      }, (err, result) => {
        if (err) {
          return reply(Boom.internal('create new transaction error'));
        } else {
          return reply({
            success: true,
            message: 'successfully',
            data: result[0]
          });
        }
      });
    }
  });

  // GET paginate transaction
  // TODO: check toDate > fromDate and only in 3 months
  server.route({
    method: 'GET',
    path: '/transaction',
    config: {
      auth: 'firebase',
      validate: {
        query: {
          fromDate: Joi.number().required(),
          toDate: Joi.number().required(),
          limit: Joi.number().default(20),
          page: Joi.number().default(1)
        }
      }
    },
    handler: function (request, reply) {
      const { limit, page, fromDate, toDate } = request.query;
      WalletService.getTransactionPaginate(
        request.auth.credentials.uid,
        new Date(fromDate),
        new Date(toDate),
        limit,
        page, 
        (err, result) => {
          if (err) {
            return reply(Boom.internal('Get transaction error', err));
          } else {
            return reply(result);
          }
        }
      )
    }
  });

  // Total Amount
   server.route({
    method: 'GET',
    path: '/transaction/total',
    config: {
      auth: 'firebase',
      validate: {
        query: {
          fromDate: Joi.number(),
          toDate: Joi.number()
        }
      }
    },
    handler: function (request, reply) {
      if (request.query.fromDate && request.query.toDate) {
        const { fromDate, toDate } = request.query;
        WalletService.totalAmount(
          request.auth.credentials.uid,
          new Date(fromDate),
          new Date(toDate),
          (err, result) => {
            if (err) {
              return reply(Boom.internal('Get transaction total amount error', err));
            } else {
              return reply({
                data: result[0]
              });
            }
          }
        )
      } else {
        WalletService.totalAmount(
          request.auth.credentials.uid,
          null,
          null,
          (err, result) => {
            if (err) {
              return reply(Boom.internal('Get transaction total amount error', err));
            } else {
              return reply({
                data: result[0]
              });
            }
          }
        )
      }
    }
  });

  server.route({
    method: 'DELETE',
    path: '/transaction/{id}',
    config: {
      auth: 'firebase'
    },
    handler: function (request, reply) {
      WalletService.deleteTransaction(request.auth.credentials.uid, request.params.id, (err, deletedTransaction) => {
        if (err) {
          reply(err);
        } else {
          reply({
            success: true,
            data: deletedTransaction
          });
        }
      });
    }
  });

  next();
};

exports.register = function (server, options, next) {
  server.dependency(['auth', 'wallet-service'], internals.applyRoutes);

  next();
};

exports.register.attributes = {
  name: 'wallet-transaction'
};
