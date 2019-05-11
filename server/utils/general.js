const Constant = require('../utils/constants');
const logger = require('../utils/logger.js').logger
const {ApolloError} = require('apollo-server-hapi')
let Hashids = require('hashids');
const redis = require('../redis/connection').client;

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

let SecQueryError = new ApolloError('Some Error Happens', 'SecQueryError');


async function checkSecurity(request) {
  if (process.env.XTAG_DISABLE === 'true' || request.headers['debug'] === (process.env.XTAG_BY_PASS_KEY || 'dev@')) {
    return request
  }
  let xTag = request.headers['x-tag']
  let isNewXtag = false
  let currentTime = Date.now()

  if (await redis.hlen('X_TAG_KEYS')) {
    let xTagTime = await redis.hget('X_TAG_KEYS', xTag)

    if (xTagTime && Math.abs(currentTime - xTagTime) > 2000) {
      logger.error('Someone query data with REUSED x-tag', logger.requestToSentryLog(request, {
        'x-tag': request.headers['x-tag']

      }))
      throw SecQueryError
    }
  } else {
    await redis.hset('X_TAG_KEYS', 'default', 'true')
    await redis.expire('X_TAG_KEYS', parseInt(process.env.XTAG_TIME) * 5)
  }
  await redis.hset('X_TAG_KEYS', xTag, currentTime)


  if (isNaN(xTag)) {
    let hashids = new Hashids((process.env.XTAG_HASH_KEY || 'Lingo Jingo@Learning Vocabulary Online'));
    if (xTag.startsWith("v2@")) {
      xTag = xTag.split("v2@")[1]
      isNewXtag = true
    }
    xTag = hashids.decode(xTag)[0];
  } else {
    xTag = parseInt(request.headers['x-tag'], 10)
  }

  let beTimeStamp

  let feTimeStamp = 0

  let diff
  if (xTag) {
    feTimeStamp = ((xTag + 12345) / 2018) + 98765
    if (isNewXtag === true) {
      beTimeStamp = Date.now()
      diff = Math.floor((beTimeStamp - feTimeStamp) / 1000)
    } else {
      beTimeStamp = Math.floor(Date.now() / 1000)
      diff = beTimeStamp - feTimeStamp
    }


    if (diff < parseInt(process.env.XTAG_TIME || Constant.XTAG_TIME_DEFAULT)) {
      return request
    }
  }
  logger.error('Someone query data with INVALID x-tag', logger.requestToSentryLog(request, {
    'diff': diff,
    'x-tag-decoded': xTag,
    'feTimeStampFromXTag': feTimeStamp,
    'beTimeStamp': beTimeStamp,
    'x-tag': request.headers['x-tag']

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