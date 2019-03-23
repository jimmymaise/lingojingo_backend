'use strict';

const ObjectID = require('mongodb').ObjectID;
const GrammarUnit = require('../models/grammar-unit');
const GrammarGroup = require('../models/grammar-group');

const _ = require('lodash');
const internals = {};

//Query
internals.getOneGrammarGroup = async (id) => {

  return await GrammarGroup.findOne({_id: id});
}
internals.getListUnitDetail = async (firebaseUId, unitIds) => {
  // const ids = unitIds.map((id) => ObjectID(id));
  // return await GrammarUnit.find({_id: {$in: ids}});
  return  await GrammarUnit.find({_id: {$in: unitIds}});

}


exports.register = function (server, options) {
  server.expose('getOneGrammarGroup', internals.getOneGrammarGroup);
  server.expose('getListUnitDetail', internals.getListUnitDetail);

};


exports.getOneGrammarGroup = internals.getOneGrammarGroup;
exports.getListUnitDetail = internals.getListUnitDetail;




exports.name = 'grammar-group-service';
