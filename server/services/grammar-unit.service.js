'use strict';

const ObjectID = require('mongodb').ObjectID;
const _ = require('lodash')
const GrammarUnit = require('../models/grammar-unit');


const GrammarSection = require('../models/grammar-section');

const internals = {};

internals.getGrammarUnit = async (grammarUnitId) => {
  return await GrammarUnit.findOne({_id: grammarUnitId});
}

internals.searchGrammarUnit = async (args) => {

  let body = await GrammarUnit.bodyBuilder()
  let search = args.search || {}
  let page = _.get(args, 'pagination.page') || 2
  let limit = _.get(args, 'pagination.limit') || 10
  if (limit > 50) {
    throw Error('Limit should be lower than 50')
  }
  // let from = size* (page - 1)
  body.page(page)
  body.limit(limit)

  if (search.name) {
    // First query the almost match, will have boost score
    // Second query the words but not follow order
    body.orQuery('match_phrase', 'name', {query: search.name, analyzer: 'nameIndexAnalyzer', 'boost': '5'})
    body.orQuery('match', 'name', {query: search.name, operator: 'and'})
    body.queryMinimumShouldMatch(1)
  }
  // if (search.categoryId) {
  //   body.query('match', 'category.id', search.categoryId)
  // }

  let data = await GrammarUnit.searchWithBodyBuilder()

  return data


}


// TODO: please protect user don't have permission in this grammarUnit
internals.getListSectionDetail = async (firebaseUId, sectionIds) => {
  return await GrammarSection.find({_id: {$in: sectionIds}});
}


exports.register = function (server, options) {

  server.expose('getGrammarUnit', internals.getGrammarUnit);
  server.expose('searchGrammarUnit', internals.searchGrammarUnit);
  server.expose('getListSectionDetail', internals.getListSectionDetail);


  return;
};

exports.getGrammarUnit = internals.getGrammarUnit;
exports.getListSectionDetail = internals.getListSectionDetail;
exports.searchGrammarUnit = internals.searchGrammarUnit;

exports.name = 'grammarUnit-service';
