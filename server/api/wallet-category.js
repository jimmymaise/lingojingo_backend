'use strict';

const Boom = require('boom');
const Joi = require('joi');
const Async = require('async');

const internals = {};

internals.applyRoutes = function (server, next) {
  const WalletService = server.plugins['wallet-service'];

  // POST: new wallet category
  server.route({
    method: 'POST',
    path: '/category',
    config: {
      auth: 'firebase',
      description: 'Post Category',
      notes: 'Returns a todo item by the id passed in the path',
      tags: ['api'],
      validate: {
        payload: {
          name: Joi.string().required(),
          color: Joi.string().required()
        }
      }
    },
    handler: async (request) => {
      try {
        const result = await WalletService.createCategory(request.auth.credentials.uid, request.payload.name, request.payload.color);
        return {
          success: true,
          message: 'successfully',
          data: result[0]
        };
      } catch (err) {
        console.log('eee', err);
        return Boom.internal('create new category error');
      }
    }
  });

  // GET all category
  server.route({
    method: 'GET',
    path: '/category',
    config: {
      description: 'Get Category',
      notes: 'Returns a todo item by the id passed in the path',
      tags: ['api'],
      auth: 'firebase'
    },
    handler: async (request) => {
      try {
        const result = await WalletService.getAllCategory(request.auth.credentials.uid);
        return result;
      } catch (err) {
        return Boom.internal('Get list category error', err);
      }
    }
  });

  server.route({
    method: 'DELETE',
    path: '/category/{id}',
    config: {
      description: 'Get Category',
      notes: 'Returns a todo item by the id passed in the path',
      tags: ['api'],
      auth: 'firebase'
    },
    handler: function (request) {
      return {
        success: true,
        data: {}
      };
    }
  });

  return;
};

exports.register = function (server, options) {
  server.dependency(['auth', 'wallet-service'], internals.applyRoutes);

  return;
};

exports.name = 'wallet-category';
