'use strict';

const MongoModels = require('mongo-models');
const es = require('../elasticsearch/connection').es

class ESMongoModels extends MongoModels {
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
    await es.initIndex(this.collectionName, this.esSchema)
    let data = await this.findById(_id)
    delete data['_id'];
    await es.update({
      index: this.collectionName, type: '_doc', id: _id.toString(), body: {doc: data}, doc_as_upsert: true
    })
  }

  static async deleteES(_id) {
    es.delete({
      index: this.collectionName, type: '_doc', id: _id.toString()
    })
  }

  static async search(body) {
    return await es.search({
      index: this.collectionName,
      body: body
    });

  }

  static async syncDataES(query = {}) {
    let page = 1
    while (page) {
      let resp = await this.pagedFind(query, page, 3)
      let data = resp.data
      for (let i = 0; i < data.length; i++) {
        await this.upsertES(data[i]._id)
      }
      console.log(page)
      if (!resp.pages.hasNext) {
        break
      }
      page = resp.pages.next


    }


  }
};

ESMongoModels['buider'] = es.builder
module.exports = ESMongoModels;

