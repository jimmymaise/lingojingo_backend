const Constant = require('../utils/constants');

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

async function setClaimToFireBase(user_id) {
    let admin = require('firebase-admin');
    const getUserByFireBaseId = require('../services/user-info.service').getOne;
    const userDBInfo = await getUserByFireBaseId(user_id)
    let claims = {
        groups: userDBInfo['groups']
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

module.exports.onlyUnique = onlyUnique;
module.exports.setClaimToFireBase = setClaimToFireBase
module.exports.correctAnswerToLevel = correctAnswerToLevel;