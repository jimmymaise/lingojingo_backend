'use strict';

const Joi = require('joi');
const MongoModels = require('mongo-models');

class UserSong extends MongoModels {
};

UserSong.collectionName = 'user_song';
let vocaLearning = Joi.object().keys({
  exams: [Joi.string().optional(), Joi.allow(null)], // ids of all exams
  totalExams: Joi.number(),
  highestResult: Joi.object().keys({ // Store diem cao nhat
    examId: Joi.string(),
    score: Joi.number(),
    result: Joi.number(),
    timeSpent: Joi.number(),
    knownAnswer: Joi.object(),
    totalQuestions: Joi.number(),
    timeSpentAvg: Joi.number(),
    totalCorrectAnswers: Joi.number(),

  }).optional().allow(null),
  filterKnownCard: Joi.object(), // Luu nhung card id ko thuoc trong qua trinh filter
  knownAnswer: Joi.object(), // the correct answers of the latest topic exam
  currentStudyMode: Joi.string().optional().allow(null), // type of study mode
  result: Joi.boolean()


})


UserSong.schema = Joi.object().keys({
  _id: Joi.object(),
  userId: Joi.string(),
  songId: Joi.string(),
  vocaLearning: vocaLearning,
  listenLearning: Joi.object().optional(),
  lyricLearning: Joi.object().optional(),
  createdAt: Joi.date().optional(),//Thời gian tạo song
  expiredAt: Joi.date().optional(),//Thời gian hết hạn
}).options({stripUnknown: true});

UserSong.indexes = [
  {
    key: {
      userId: 1,
      songId: 1
    }
  }
];

module.exports = UserSong;

