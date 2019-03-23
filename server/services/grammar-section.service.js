'use strict';

const ObjectID = require('mongodb').ObjectID;
const GrammarExercise = require('../models/grammar-excercise');
const GrammarSection = require('../models/grammar-section');

const _ = require('lodash');
const internals = {};

//Query
internals.getOneGrammarSection = async (id) => {

  return await GrammarSection.findById(id);
}
internals.getListExerciseDetail = async (firebaseUId, exerciseIds) => {
  const ids = exerciseIds.map((id) => ObjectID(id));
  return await GrammarExercise.find({_id: {$in: ids}});
}


exports.register = function (server, options) {
  server.expose('getOneGrammarSection', internals.getOneGrammarSection);
  server.expose('getListExerciseDetail', internals.getListExerciseDetail);

};


exports.getOneGrammarSection = internals.getOneGrammarSection;
exports.getListExerciseDetail = internals.getListExerciseDetail;




exports.name = 'grammar-section-service';
