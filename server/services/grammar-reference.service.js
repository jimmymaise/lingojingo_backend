'use strict';

const ObjectID = require('mongodb').ObjectID;
const GrammarReference= require('../models/grammar-reference');

const _ = require('lodash');
const internals = {};

//Query
internals.getOneGrammarReference = async (id) => {

  return await GrammarReference.findOne({_id: id});

}


exports.register = function (server, options) {
  server.expose('getOneGrammarReference', internals.getOneGrammarReference);
};


exports.getOneGrammarReference = internals.getOneGrammarReference;



exports.name = 'grammar-reference-service';
