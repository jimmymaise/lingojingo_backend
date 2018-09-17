'use strict'
let logger = require('./logger').logger
const myPlugin = {
  name: 'sentry',
  version: '1.0.0',
  register: function (server, options) {
    server.events.on({name: 'request', channels: 'error'}, function (request, event) {
      const baseUrl = request.info.uri ||
        (request.info.host && `${server.info.protocol}://${request.info.host}`) ||
        server.info.uri

      logger.error(event.error, {
        request: {
          method: request.method,
          body: request.query,
          headers: request.headers,
          cookies: request.state,
          url: request.path
        },
        extra: {
          timestamp: request.info.received,
          id: request.id,
          remoteAddress: request.info.remoteAddress,
          userInfo:request.auth
        },
        tags: options.tags
      })
    })
  }
}
module.exports = myPlugin
