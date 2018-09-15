'use strict';

const MongoModels = require('mongo-models');
const es = require('../elasticsearch/connection').es
const bodybuilder = require('bodybuilder')
const _ = require('lodash')


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

  static async upsertES(_id, indexData) {
    await es.initIndex(this.collectionName, this.esSchema)
    if (!indexData) {
      indexData = await this.findById(_id)
    }
    delete indexData['_id'];
    await es.update({
      index: this.collectionName, type: '_doc', id: _id.toString(), body: {doc: indexData}, doc_as_upsert: true
    })
  }

  static async deleteES(_id) {
    es.delete({
      index: this.collectionName, type: '_doc', id: _id.toString()
    })
  }

  static async search(args) {
    let data = await es.search(args)
    let from = args.body.from || 0
    let size = args.body.size || 10
    let totalItem = _.get(data, 'hits.total') || 0
    let totalPage = Math.ceil(totalItem / size)
    let currentPage = from / size + 1
    data['pages'] = {
      current: currentPage,
      prev: currentPage - 1 || null,
      hasPrev: Boolean(currentPage - 1 > 0),
      next: currentPage + 1,
      hasNext: Boolean(totalPage - currentPage > 0),
      total: Math.ceil(totalPage)
    }
    data['items'] = {
      limit: size,
      begin: from + 1,
      end: from + 1 + size,
      total: totalItem
    }
    let hits = _.get(data, 'hits.hits')
    data['data'] = []
    for (let i = 0; i < hits.length; i++) {
      let item = hits[i]._source || {}
      item['_id'] = hits[i]._id
      data['data'].push(item)
    }

    delete data.hits;
    return data


  }

  static async searchWithBodyBuilder() {
    let body = this.body.build()
    if (this.body._page) {
      let from = body.size * (this.body._page - 1)
      this.body.from(from)
      body = this.body.build()
    }
    return await this.search({
      index: this.collectionName,
      body: body
    });

  }


  static bodyBuilder() {
    this.body = bodybuilder()
    let body = this.body
    this.body['page'] = function (page) {
      body['_page'] = page
    }
    this.body['limit'] = function (limit) {
      body.size(limit)
    }

    return this.body

  }

  static async syncDataES(query = {}, resetIndex = false) {
    console.log(`Starting Sync Data from MongoDB to ES for ${this.collectionName}`)
    if (resetIndex) {
      await es.resetIndex(this.collectionName, this.esSchema)
    }
    else {
      await es.initIndex(this.collectionName, this.esSchema)
    }
    let page = 1
    while (page) {
      let resp = await this.pagedFind(query, page, 10)
      let data = resp.data
      for (let i = 0; i < data.length; i++) {
        await this.upsertES(data[i]._id)
      }
      console.log(`page: ${page}`)
      if (!resp.pages.hasNext) {
        break
      }
      page = resp.pages.next


    }
    console.log(`Completed Sync Data from MongoDB to ES for ${this.collectionName}`)

  }
};

module.exports = ESMongoModels;

