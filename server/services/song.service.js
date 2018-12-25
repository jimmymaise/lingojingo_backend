'use strict';

const Async = require('async');
const ObjectID = require('mongodb').ObjectID;
const sortBy = require('lodash/sortBy');
const map = require('lodash/map');
const reduce = require('lodash/reduce');
const _ = require('lodash')

const UserInfo = require('../models/user-info');

const Song = require('../models/song');
// const SongCategory = require('../models/song-category');
const UserTopic = require('../models/user-topic');
// Song.syncDataES()
// UserTopic.syncDataES()


const Topic = require('../models/topic');
const Card = require('../models/card');

const internals = {};

internals.buySong = async (firebaseUId, songId) => {
  const songFound = await Song.findById(songId);

  if (songFound) {
    const currentInfo = await UserInfo.findOne({
      firebaseUserId: firebaseUId
    });

    if (!currentInfo) {
      throw Error('Not Found');
    }

    delete currentInfo['_id'];
    if (!currentInfo.songs) {
      currentInfo.songs = [];
    }

    if (currentInfo.songs.indexOf(songId) < 0) {
      currentInfo.songs.push(songId);
    } else {
      return currentInfo;
    }
    let addUserSongResult = await UserSong.insertOne({"userId": firebaseUId, "songId": songId});

    if (!addUserSongResult) {
      throw Error('Cannot Add UserSong');
    }

    return await UserInfo.findOneAndUpdate({
      firebaseUserId: firebaseUId
    }, {
      $set: {
        firebaseUserId: firebaseUId,
        ...currentInfo,

        timeUpdated: new Date()
      }
    }, {
      upsert: true,
      setDefaultsOnInsert: true
    });
  }

  throw Error('Not Found');
}

internals.getSong = async (firebaseUId, songId) => {
  return await Song.findById(songId);
}

internals.searchSong = async (args) => {

  let body = await Song.bodyBuilder()
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
  if (search.mainLevel) {
    body.query('terms', 'mainLevel', search.mainLevel)
  }
  // if (search.categoryId) {
  //   body.query('match', 'category.id', search.categoryId)
  // }

  let data = await Song.searchWithBodyBuilder()

  return data


}

internals.isOwned = async (userInfo, songId) => {

  return userInfo && userInfo.songs && userInfo.songs.indexOf(songId.toString()) >= 0

}


// TODO: please protect user don't have permission in this song
internals.getListCardDetail = async (firebaseUId, cardIds) => {
  const ids = cardIds.map((id) => ObjectID(id));
  return await Card.find({_id: {$in: ids}});
}

//SongPaginate

internals.getSongPaginate = async (limit, page) => {
  let _limit = limit || 5;
  let _page = page || 1;
  return await Song.pagedFind({}, _page, _limit, {});
}

internals.getSongPaginateMapWithUserInfo = async (firebaseUId, limit, page) => {
  let _limit = limit || 5;
  let _page = page || 1;

  const paginateData = await Song.pagedFind({}, _page, _limit, {});
  const userInfo = await UserInfo.findOne({
    firebaseUserId: firebaseUId
  });

  forEach(paginateData.data, (songItem) => {
    if (userInfo && userInfo.songs && userInfo.songs.indexOf(songItem._id.toString()) >= 0) {
      songItem.isOwned = true;
    } else {
      songItem.isOwned = false;
    }
  })

  return paginateData;
}

internals.getUserOwnerSongPaginate = async (firebaseUId, limit, page) => {
  let _limit = limit || 5;
  let _page = page || 1;

  const userInfo = await UserInfo.findOne({
    firebaseUserId: firebaseUId
  });

  const ids = userInfo && userInfo.songs ? userInfo.songs.map((id) => ObjectID(id)) : [];
  return await Song.pagedFind({_id: {$in: ids}}, _page, _limit, {});
}


// internals.getSongCategory = async (id) => {
//   if (typeof id === 'string' || id instanceof String) {
//
//     id =  ObjectID(id)
//   }
//
//   let data = await SongCategory.find({songs: {$elemMatch: {id: id}}});return data[0]
// }


exports.register = function (server, options) {

  server.expose('buySong', internals.buySong);
  server.expose('getSong', internals.getSong);
  server.expose('searchSong', internals.searchSong);

  server.expose('getListCardDetail', internals.getListCardDetail);
  // server.expose('getSongCategory', internals.getSongCategory);
  server.expose('isOwned', internals.isOwned);

  server.expose('getSongPaginate', internals.getSongPaginate);
  server.expose('getSongPaginateMapWithUserInfo', internals.getSongPaginateMapWithUserInfo);
  server.expose('getUserOwnerSongPaginate', internals.getUserOwnerSongPaginate);


  return;
};

exports.getListTopicDetail = internals.getListTopicDetail;
exports.buySong = internals.buySong;
exports.getSong = internals.getSong;
exports.getListCardDetail = internals.getListCardDetail;
exports.getOneTopic = internals.getOneTopic;
// exports.getSongCategory = internals.getSongCategory;
exports.searchSong = internals.searchSong;
exports.isOwned = internals.isOwned;

exports.getSongPaginate = internals.getSongPaginate;
exports.getSongPaginateMapWithUserInfo = internals.getSongPaginateMapWithUserInfo;
exports.getUserOwnerSongPaginate = internals.getUserOwnerSongPaginate;


exports.name = 'song-service';
