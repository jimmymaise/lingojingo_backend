const winston = require('winston');
const Sentry = require('winston-raven-sentry');
let get = require("lodash.get");

const options = {
  dsn: 'https://d8c9d908c23144068f61a4152a7593ef@sentry.io/1281759',
  level: 'info'
};

const logger = new winston.Logger({
  transports: [
    new Sentry(options)
  ]
});
logger['requestToSentryLog'] = function (request, other_errors) {
  return {
    user: {
      id: get(request, 'auth.credentials.uid', null),
      email: get(request, 'auth.credentials.email', null),
      username: get(request, 'auth.credentials.name', null),
      ip_address: get(request, 'headers.x-forwarded-for', null)
    },
    request: {
      method: request.method,
      headers: request.headers,
      cookies: request.state,
      url: request.path,
      body: get(request, 'payload.query', null),
    },
    extra: {
      timestamp: get(request, 'info.received', null),
      id: request.info.id,
      remoteAddress: get(request, 'info.remoteAddress', null),
      userInfo: request.auth,
      otherErrors: JSON.stringify(other_errors)

    },
  }

}
module.exports.logger = logger;

// const log = new (winston.Logger)({
//   transports: [
//     // info console log
//     new (winston.transports.Console)({
//       level: 'info',
//       name: 'info-console',
//       colorize: true,
//       timestamp: () => moment().format('YYYY-MM-DD HH-mm-ss'),
//       formatter: options => `[${options.timestamp()}]: ${options.message || ''}`
//     }),
//     // info log file
//     new (winston.transports.File)({
//       level: 'info',
//       name: 'info-file',
//       filename: path.resolve(__dirname, '../../..', 'storage/logs', 'development-info.log'),
//       timestamp: () => moment().format('YYYY-MM-DD HH-mm-ss'),
//       formatter: options => `[${options.timestamp()}]: ${options.message || ''}`,
//       json: false
//     }),
//     // errors console log
//     new (winston.transports.Console)({
//       level: 'error',
//       name: 'error-console',
//       colorize: true,
//       timestamp: () => moment().format('YYYY-MM-DD HH-mm-ss'),
//       formatter: options => `[${options.timestamp()}]: ${options.message || ''}`
//     }),
//     // errors exption log
//     new (winston.transports.Console)({
//       level: 'error',
//       name: 'error-console',
//       colorize: true,
//       timestamp: () => moment().format('YYYY-MM-DD HH-mm-ss'),
//       formatter: options => `[${options.timestamp()}]: ${options.message || ''}`
//     }),
//     // errors log file
//     new (winston.transports.File)({
//       level: 'error',
//       name: 'error-file',
//       filename: path.resolve(__dirname, '../../..', 'storage/logs', 'development-errors.log'),
//       timestamp: () => moment().format('YYYY-MM-DD HH-mm-ss'),
//       formatter: options => `[${options.timestamp()}]: ${options.message || ''}`,
//       json: false
//     })
//   ]
// });
//
// export default log;