'use strict';

const Async = require('async');
const ObjectID = require('mongodb').ObjectID;
const sortBy = require('lodash/sortBy');
const map = require('lodash/map');
const reduce = require('lodash/reduce');
const UserArticle = require('../models/user-article');
const _ = require('lodash')

const UserInfo = require('../models/user-info');

const Article = require('../models/article');
// const ArticleCategory = require('../models/article-category');
const UserTopic = require('../models/user-topic');
// Article.syncDataES()
// UserTopic.syncDataES()


const Topic = require('../models/topic');
const Card = require('../models/card');

const internals = {};

internals.buyArticle = async (firebaseUId, articleId) => {
  const articleFound = await Article.findById(articleId);

  if (articleFound) {
    const currentInfo = await UserInfo.findOne({
      firebaseUserId: firebaseUId
    });

    if (!currentInfo) {
      throw Error('Not Found');
    }

    delete currentInfo['_id'];
    if (!currentInfo.articles) {
      currentInfo.articles = [];
    }

    if (currentInfo.articles.indexOf(articleId) < 0) {
      currentInfo.articles.push(articleId);
    } else {
      return currentInfo;
    }
    let addUserArticleResult = await UserArticle.insertOne({"userId": firebaseUId, "articleId": articleId});

    if (!addUserArticleResult) {
      throw Error('Cannot Add UserArticle');
    }

    return await UserInfo.findOneAndUpdate({
      firebaseUserId: firebaseUId
    }, { $set: {
        firebaseUserId: firebaseUId,
        ...currentInfo,

        timeUpdated: new Date()
      }}, {
      upsert: true,
      setDefaultsOnInsert: true
    });
  }

  throw Error('Not Found');
}

internals.getArticle = async (firebaseUId, articleId) => {
  return await Article.findById(articleId);
}

internals.searchArticle = async (args) => {

  let body = await Article.bodyBuilder()
  let search = args.search || {}
  let page = _.get(args, 'pagination.page') || 2
  let limit =_.get(args, 'pagination.limit') || 10
  if (limit >50) {
    throw Error('Limit should be lower than 50')
  }
  // let from = size* (page - 1)
  body.page(page)
  body.limit(limit)

  if (search.articleName) {
    // First query the almost match, will have boost score
    // Second query the words but not follow order
    body.orQuery('match_phrase', 'articleName', {query: search.articleName, analyzer: 'articleNameIndexAnalyzer', 'boost': '5'})
    body.orQuery('match', 'articleName', {query: search.articleName, operator: 'and'})
    body.queryMinimumShouldMatch(1)
  }
  // if (search.categoryId) {
  //   body.query('match', 'category.id', search.categoryId)
  // }

  let data = await Article.searchWithBodyBuilder()

  return data



}

internals.isOwned = async (userInfo, articleId) => {

  return userInfo && userInfo.articles && userInfo.articles.indexOf(articleId.toString()) >= 0

}



// TODO: please protect user don't have permission in this article
internals.getListCardDetail = async (firebaseUId, cardIds) => {
  const ids = cardIds.map((id) => ObjectID(id));
  return await Card.find({_id: {$in: ids}});
}

//ArticlePaginate

internals.getArticlePaginate = async (limit, page) => {
  let _limit = limit || 5;
  let _page = page || 1;
  return await Article.pagedFind({}, _page, _limit, {});
}

internals.getArticlePaginateMapWithUserInfo = async (firebaseUId, limit, page) => {
  let _limit = limit || 5;
  let _page = page || 1;

  const paginateData = await Article.pagedFind({}, _page, _limit, {});
  const userInfo = await UserInfo.findOne({
    firebaseUserId: firebaseUId
  });

  forEach(paginateData.data, (articleItem) => {
    if (userInfo && userInfo.articles && userInfo.articles.indexOf(articleItem._id.toString()) >= 0) {
      articleItem.isOwned = true;
    } else {
      articleItem.isOwned = false;
    }
  })

  return paginateData;
}

internals.getUserOwnerArticlePaginate = async (firebaseUId, limit, page) => {
  let _limit = limit || 5;
  let _page = page || 1;

  const userInfo = await UserInfo.findOne({
    firebaseUserId: firebaseUId
  });

  const ids = userInfo && userInfo.articles ? userInfo.articles.map((id) => ObjectID(id)) : [];
  return await Article.pagedFind({_id: {$in: ids}}, _page, _limit, {});
}



// internals.getArticleCategory = async (id) => {
//   if (typeof id === 'string' || id instanceof String) {
//
//     id =  ObjectID(id)
//   }
//
//   let data = await ArticleCategory.find({articles: {$elemMatch: {id: id}}});return data[0]
// }


exports.register = function (server, options) {

  server.expose('buyArticle', internals.buyArticle);
  server.expose('getArticle', internals.getArticle);
  server.expose('searchArticle', internals.searchArticle);

  server.expose('getListCardDetail', internals.getListCardDetail);
  // server.expose('getArticleCategory', internals.getArticleCategory);
  server.expose('isOwned', internals.isOwned);

  server.expose('getArticlePaginate', internals.getArticlePaginate);
  server.expose('getArticlePaginateMapWithUserInfo', internals.getArticlePaginateMapWithUserInfo);
  server.expose('getUserOwnerArticlePaginate', internals.getUserOwnerArticlePaginate);



  return;
};

exports.getListTopicDetail = internals.getListTopicDetail;
exports.buyArticle = internals.buyArticle;
exports.getArticle = internals.getArticle;
exports.getListCardDetail = internals.getListCardDetail;
exports.getOneTopic = internals.getOneTopic;
// exports.getArticleCategory = internals.getArticleCategory;
exports.searchArticle = internals.searchArticle;
exports.isOwned = internals.isOwned;

exports.getArticlePaginate = internals.getArticlePaginate;
exports.getArticlePaginateMapWithUserInfo = internals.getArticlePaginateMapWithUserInfo;
exports.getUserOwnerArticlePaginate = internals.getUserOwnerArticlePaginate;





exports.name = 'article-service';
