const songService = require('../services/song.service');
const userStatisticsService = require('../services/user-statistics.service');
const UserInfo = require('../models/user-info');

// The GraphQL schema in string form
const typeDefs = `
  input SongSearchInput {
    name: String,
    mainLevel: [Int],
    }
  type SongPagination {
    data: [Song],
    pages: PageInfo,
    items: PageItemInfo
  }
  type Lyric {
   number: Int
   timeStart: Int
   timeEnd: Int
   strLyricEn: String
   strLyricVi: String
  }
  type EsSongList {
  offset: Int,
  start: Int,
  data:[Song]
  
  }
  type Song {
    _id: String,
    description: String,
    total: Int,
    mainLevel: Int,
    tags: [String],
    topics: [JSON],
    name: String,
    bandSingerId: Int,
    isOwned: Boolean,
    cardTotal: Int,
    duration: Int,
    cards: [String],
    listLyric: [Lyric],
    link: String,
    youtubeId: String,
    bandSingerInfo: JSON,
    img: String,
    cardDetails: [Card],
    passScore: String
  }
  extend type Query {
    songs(pagination: PaginationInput): SongPagination
    userStoreSongs(pagination: PaginationInput): SongPagination,
    userOwnerSongs(pagination: PaginationInput): SongPagination,
    songSearch(search: SongSearchInput, pagination: PaginationInput): SongPagination,
    song(id: ID!): Song
  }
`;

// The resolvers
const resolvers = {
  Query: {
    songs: async (parent, args) => {
      const {limit, page} = args.pagination || {};

      return await songService.getSongPaginate(limit, page);
    },
    song: async (parent, args, context) => {
      return await songService.getSong(context.request.auth.credentials.uid, args.id);
    },
    songSearch: async (parent, args, context) => {
      context['userInfo'] = await UserInfo.findOne({
        firebaseUserId: context.request.auth.credentials.uid
      });
      return await songService.searchSong(args);

    },
  },
  Song: {

    isOwned: async (parent, args, context) => {
      let userInfo = context.userInfo

      let firebaseUId = context.request.auth.credentials.uid
      if (!userInfo || firebaseUId !== userInfo.firebaseUserId) {
        userInfo = await UserInfo.findOne({
          firebaseUserId: firebaseUId
        });
      }

      return await songService.isOwned(userInfo, parent._id);
    },
    cardDetails: async (parent, args, context) => {
      return await songService.getListCardDetail(context.request.auth.credentials.uid, parent.cards);
    }
  }
};

module.exports = {
  typeDefs,
  resolvers
}
