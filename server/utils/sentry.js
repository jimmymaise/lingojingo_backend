'use strict'
let logger = require('./logger').logger
const myPlugin = {
  name: 'sentry',
  version: '1.0.0',
  register: function (server, options) {
    server.events.on({name: 'request', channels: 'error'}, function (request, event) {
      logger.error(event.error, logger.requestToSentryLog(request))
    })
  }
}
module.exports = myPlugin
