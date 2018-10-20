const quizService = require('../services/quiz.service');
const articleService = require('../services/article.service');
const UserInfo = require('../models/user-info');

// The GraphQL schema in string form
const typeDefs = `
  input ArticleSearchInput {
    articleName: String,
    }
  type ArticlePagination {
    data: [Article],
    pages: PageInfo,
    items: PageItemInfo
  }
  type EsArticleList {
  offset: Int,
  start: Int,
  data:[Article]
  
  }
  type ArticleSummary {
    _id: String,
    title: String,
    author: String,
    isOwned: Boolean,
    id: Int,
    publicationYear: String,
    grade: String,
    genre: String,
    permissionsLine: String,
    image: String,
    description: String,
    language: String,
  
  }
  
  type Article {
    _id: String,
    title: String,
    author: String,
    id: Int,
    isOwned: Boolean,
    publicationYear: String,
    grade: String,
    genre: String,
    permissionsLine: String,
    image: String,
    description: String,
    language: String,
    content: JSON,
    checkForUnderstandingQuestions: [JSON],
    discussionQuestions: [JSON],
    textDependentQuestions: [JSON],
  }
  extend type Query {
    articles(pagination: PaginationInput): ArticlePagination
    userStoreArticles(pagination: PaginationInput): ArticlePagination,
    userOwnerArticles(pagination: PaginationInput): ArticlePagination,
    articleSearch(search: ArticleSearchInput, pagination: PaginationInput): ArticlePagination,
    article(id: ID!): Article
  }
`;

// The resolvers
const resolvers = {
  Query: {
    articles: async (parent, args) => {
      const {limit, page} = args.pagination || {};

      return await articleService.getArticlePaginate(limit, page);
    },
    userStoreArticles: async (parent, args, context) => {
      const {limit, page} = args.pagination || {};

      return await articleService.getArticlePaginateMapWithUserInfo(context.request.auth.credentials.uid, limit, page);
    },
    userOwnerArticles: async (parent, args, context) => {
      const {limit, page} = args.pagination || {};

      return await articleService.getUserOwnerArticlePaginate(context.request.auth.credentials.uid, limit, page);
    },
    article: async (parent, args, context) => {
      return await articleService.getArticle(context.request.auth.credentials.uid, args.id);
    },
    articleSearch: async (parent, args, context) => {
      context['userInfo'] = await UserInfo.findOne({
        firebaseUserId: context.request.auth.credentials.uid
      });
      return await articleService.searchArticle(args);

    },
  },
  Article: {

    isOwned: async (parent, args, context) => {
      let userInfo = context.userInfo

      let firebaseUId = context.request.auth.credentials.uid
      if (!userInfo || firebaseUId !== userInfo.firebaseUserId) {
        userInfo = await UserInfo.findOne({
          firebaseUserId: firebaseUId
        });
      }

      return await articleService.isOwned(userInfo, parent._id);
    },

  }
};

module.exports = {
  typeDefs,
  resolvers
}
