'use strict';

const ObjectID = require('mongodb').ObjectID;
const Quote= require('../models/quote');

const _ = require('lodash');
const internals = {};

//Query
internals.getRandomQuote = async (size) => {
  if (size >100){
    throw Error('Size cannot be larger than 100');

  }
  return await Quote.aggregate([{ $sample: { size: size } }]);

}


exports.register = function (server, options) {
  server.expose('getRandomQuote', internals.getRandomQuote);
};


exports.getRandomQuote = internals.getRandomQuote;



exports.name = 'quote-service';
