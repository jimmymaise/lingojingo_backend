CACHE_CONTROL = 'public, max-age=30672000'
EXAM = {
  TYPE: {
    TOPIC: 'TopicExam',
    REVIEW: 'ReviewExam',
    FINAL: 'FinalEXam'
  },
  RESULT: {
    PASSED: 1,
    FAILED: 0,
  }
}

TOPIC = {
  TYPE: {
    TOPIC: 0,
    REVIEW: 1,
    FINAL: 2
  }

}
LEVEL_SCORE = {
  LV1: 1000,
  LV2: 2000,
  LV3: 3000,
  LV4: 4000,
  LV5: 5000,
  LV6: 6000,
  LV7: 7000,
  LV8: 8000
}
LEVEL_NAME = {
  LV1: 'Beginner',
  LV2: 'High Beginner',
  LV3: 'Low Intermediate',
  LV4: 'Intermediate',
  LV5: 'High Intermediate',
  LV6: 'Low Advanced',
  LV7: 'Advanced',
  LV8: 'Expert'
}

REWARD_TYPE_NAME = {
  GOOD_RESULT_TOPIC_EXAM: "GOOD_RESULT_TOPIC_EXAM",
  UPDATE_LEVEL: "UPDATE_LEVEL"


}
module.exports.EXAM = EXAM;
module.exports.TOPIC = TOPIC;
module.exports.LEVEL_SCORE = LEVEL_SCORE;
module.exports.LEVEL_NAME = LEVEL_NAME;
module.exports.REWARD_TYPE_NAME = REWARD_TYPE_NAME;
module.exports.CACHE_CONTROL = CACHE_CONTROL;