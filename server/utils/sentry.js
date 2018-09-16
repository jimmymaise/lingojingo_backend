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
          query_string: request.query,
          headers: request.headers,
          cookies: request.state,
          url: baseUrl + request.path
        },
        extra: {
          timestamp: request.info.received,
          id: request.id,
          remoteAddress: request.info.remoteAddress
        },
        tags: options.tags
      })
    })
  }
}
module.exports = myPlugin
