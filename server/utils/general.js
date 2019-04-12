const Constant = require('../utils/constants');
const logger = require('../utils/logger.js').logger
const {ApolloError} = require('apollo-server-hapi')
let Hashids = require('hashids');


function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

let SecQueryError = new ApolloError('Some Error Happens', 'SecQueryError');

function checkSecurity(request) {
  if (process.env.XTAG_DISABLE === true || request.headers['debug'] === Constant.BY_PASS_KEY) {
    return request
  }
  let xTag = request.headers['x-tag']
  if (isNaN(xTag)) {
    let hashids = new Hashids('Lingo Jingo@Learning Vocabulary Online');
    xTag = hashids.decode(xTag)[0];

  } else {
    xTag = parseInt(request.headers['x-tag'], 10)
  }

  let beTimeStamp = Math.floor(Date.now() / 1000)
  let feTimeStamp = 0

  let diff
  if (xTag) {
    feTimeStamp = ((xTag + 12345) / 2018) + 98765
    diff = Math.abs(beTimeStamp - feTimeStamp)
    if (diff < parseInt(process.env.XTAG_TIME || Constant.XTAG_TIME_DEFAULT)) {
      return request
    }
  }
  logger.error('Someone query data with invalid x-tag', logger.requestToSentryLog(request, {
    'diff': diff,
    'x-tag': xTag,
    'feTimeStampFromXTag': feTimeStamp,
    'beTimeStamp': beTimeStamp

  }))
  throw SecQueryError


}


async function setClaimToFireBase(user_id) {
  let admin = require('firebase-admin');
  const getUserByFireBaseId = require('../services/user-info.service').getOne;
  const userDBInfo = await getUserByFireBaseId(user_id)
  let claims = {
    groups: userDBInfo['groups'] || []
  }
  try {
    await admin.auth().setCustomUserClaims(user_id,
      {claims}
    );
  } catch (e) {
    throw e

  }
  return claims

}

function correctAnswerToLevel(correctAnswer) {
  let level
  if (correctAnswer <= Constant.LEVEL_SCORE.LV1) {
    level = Constant.LEVEL_NAME.LV1

  } else if (correctAnswer <= Constant.LEVEL_SCORE.LV2) {
    level = Constant.LEVEL_NAME.LV2


  } else if (correctAnswer <= Constant.LEVEL_SCORE.LV3) {
    level = Constant.LEVEL_NAME.LV3


  } else if (correctAnswer <= Constant.LEVEL_SCORE.LV4) {
    level = Constant.LEVEL_NAME.LV4


  } else if (correctAnswer <= Constant.LEVEL_SCORE.LV5) {
    level = Constant.LEVEL_NAME.LV5


  } else if (correctAnswer <= Constant.LEVEL_SCORE.LV6) {
    level = Constant.LEVEL_NAME.LV6


  } else if (correctAnswer <= Constant.LEVEL_SCORE.LV7) {
    level = Constant.LEVEL_NAME.LV7


  } else if (correctAnswer <= Constant.LEVEL_SCORE.LV8) {
    level = Constant.LEVEL_NAME.LV8


  }
  return level


}

function getLocation(href) {
  var match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
  return match && {
    href: href,
    protocol: match[1],
    host: match[2],
    hostname: match[3],
    port: match[4],
    pathname: match[5],
    search: match[6],
    hash: match[7]
  }
}

module.exports.onlyUnique = onlyUnique;
module.exports.setClaimToFireBase = setClaimToFireBase
module.exports.correctAnswerToLevel = correctAnswerToLevel;
module.exports.checkSecurity = checkSecurity;
module.exports.getLocation = getLocation;