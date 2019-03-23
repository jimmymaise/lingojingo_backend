'use strict';

const ObjectID = require('mongodb').ObjectID;
const GrammarExercise= require('../models/grammar-excercise');

const _ = require('lodash');
const internals = {};

//Query
internals.getOneGrammarExcercise = async (id) => {

  return await GrammarExercise.findById(id);
}


exports.register = function (server, options) {
  server.expose('getOneGrammarExcercise', internals.getOneGrammarExcercise);
};


exports.getOneGrammarExcercise = internals.getOneGrammarExcercise;



exports.name = 'grammar-exercise-service';
