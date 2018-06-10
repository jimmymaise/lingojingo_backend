'use strict';

const Async = require('async');

const Card = require('../models/card');
const Deck = require('../models/deck');

const internals = {};

internals.getOneCard = async (id) => {
  return await Card.findById(id);
}

internals.getDeckPaginate = async (limit, page) => {
  let _limit = limit || 5;
  let _page = page || 1;
  return await Deck.pagedFind({}, _page, _limit, {});
}

exports.register = function (server, options) {

  server.expose('getOneCard', internals.getOneCard);
  server.expose('getDeckPaginate', internals.getDeckPaginate);

  return;
};

exports.getOneCard = internals.getOneCard;
exports.getDeckPaginate = internals.getDeckPaginate;

exports.name = 'quiz-service';
