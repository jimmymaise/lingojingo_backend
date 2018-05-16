'use strict';

const Boom = require('boom');
const Joi = require('joi');
const Async = require('async');

const utils = require('../utils');

const internals = {};

internals.applyRoutes = function (server, next) {
  const WalletService = server.plugins['wallet-service'];

  // POST: new wallet category
  server.route({
    method: 'POST',
    path: '/category',
    config: {
      auth: 'firebase',
      validate: {
        payload: {
          name: Joi.string().required(),
          color: Joi.string().required()
        }
      }
    },
    handler: function (request) {
      WalletService.createCategory(request.auth.credentials.uid, request.payload.name, request.payload.color, (err, result) => {
        if (err) {
          return Boom.internal('create new category error');
        } else {
          return {
            success: true,
            message: 'successfully',
            data: result[0]
          };
        }
      });
    }
  });

  // GET all category
  server.route({
    method: 'GET',
    path: '/category',
    config: {
      auth: 'firebase'
    },
    handler: function (request) {
      WalletService.getAllCategory(
        request.auth.credentials.uid,
        (err, result) => {
          if (err) {
            return Boom.internal('Get list category error', err);
          } else {
            return result;
          }
        }
      )
    }
  });

  server.route({
    method: 'DELETE',
    path: '/category/{id}',
    config: {
      auth: 'firebase'
    },
    handler: function (request) {
      WalletService.deleteCategory(request.auth.credentials.uid, request.params.id, (err, deletedCategory) => {
        if (err) {
          return err;
        } else {
          return {
            success: true,
            data: deletedCategory
          };
        }
      });
    }
  });

  return;
};

exports.register = function (server, options) {
  server.dependency(['auth', 'wallet-service'], internals.applyRoutes);

  return;
};

exports.name = 'wallet-category';
