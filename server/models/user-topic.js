'use strict';
const es = require('../elasticsearch/connection').es
const Joi = require('joi');
const MongoModels = require('mongo-models');
const userTopicSchema = require('../elasticsearch/mapping/user-topic').userTopic

class UserTopic extends MongoModels {


  //Override these function to inject update ES

  static async findByIdAndUpdate() {

    let data = await super.findByIdAndUpdate.apply(this, arguments)
    await this.upsertES(arguments[0])

    return data
  }

  static async findByIdAndDelete() {

    let data = await super.findByIdAndDelete.apply(this, arguments)
    await this.deleteES(arguments[0])
    return data
  }

  static async insertOne() {

    let data = await super.insertOne().apply(this, arguments)
    await this.upsertES(data['_id'])

    return data
  }

  static async upsertES(_id) {
    await es.resetIndex(this.collectionName, userTopicSchema)
    let data = await this.findById(_id)
    delete data['_id'];



    es.update({
      index: this.collectionName, type: '_doc', id: _id.toString(), body: {doc: data}, doc_as_upsert: true
    })
  }

  static async deleteES(_id) {
    await es.initIndex(this.collectionName, userTopicSchema)
    es.delete({
      index: this.collectionName, type: '_doc', id: _id.toString()
    })
  }

  static async search(body) {
    await es.search({
      index: this.collectionName,
      body: body
    });


  }


};

UserTopic['buider'] = es.builder
UserTopic.collectionName = 'user_topic';


UserTopic.schema = Joi.object().keys({
  _id: Joi.object(),
  userId: Joi.string(),
  topicId: Joi.string(),
  topicType: Joi.string(),
  deckId: Joi.string(),
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
  // Vì có thể làm nhiều lần Exam, nên ở đây sẽ lưu kết qua cuối cùng
  // để mình check là nó có dc move qua topic kế tiếp ko
  // Đỡ phải ngồi tra lại table user-exam
  //lastExamResult: Joi.number(), // 0 - failed | 1 - Passed ==>Chi can check o highestResult la du
})

UserTopic.indexes = [
  {
    key: {
      userId: 1,
      topicId: 1,
      deckId: 1
    }
  }
];
module.exports = UserTopic;

