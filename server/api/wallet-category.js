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
    handler: function (request, reply) {
      WalletService.createCategory(request.auth.credentials.uid, request.payload.name, request.payload.color, (err, result) => {
        if (err) {
          return reply(Boom.internal('create new category error'));
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

  // GET all category
  server.route({
    method: 'GET',
    path: '/category',
    config: {
      auth: 'firebase'
    },
    handler: function (request, reply) {
      WalletService.getAllCategory(
        request.auth.credentials.uid,
        (err, result) => {
          if (err) {
            return reply(Boom.internal('Get list category error', err));
          } else {
            return reply(result);
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
    handler: function (request, reply) {
      WalletService.deleteCategory(request.auth.credentials.uid, request.params.id, (err, deletedCategory) => {
        if (err) {
          reply(err);
        } else {
          reply({
            success: true,
            data: deletedCategory
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
  name: 'wallet-category'
};
