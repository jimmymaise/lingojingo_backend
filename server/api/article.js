'use strict';

const Boom = require('boom');


const internals = {};

internals.applyRoutes = function (server, next) {
  const ArticleService = server.plugins['article-service'];

  server.route({
    method: 'POST',
    path: '/article/buy/{id}',
    config: {
      auth: 'firebase',
      description: 'Buy article for User',
      notes: 'Buy article for User when payment complete',
      tags: ['api']
    },
    handler: async (request) => {

      try {
        const result = await ArticleService.buyArticle(request.auth.credentials.uid, request.params.id);
        return {
          success: true,
          message: 'successfully',
          data: {
            articles: result.articles
          }
        };
      } catch (err) {
        return Boom.internal('Buy Article error!');
      }
    }
  });

  return;
};

exports.register = function (server, options) {
  server.dependency([ 'article-service'], internals.applyRoutes);

  return;
};

exports.name = 'article';
