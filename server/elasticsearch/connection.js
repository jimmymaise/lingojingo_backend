const elasticsearch = require('elasticsearch')
let bodybuilder = require('bodybuilder')


// Core ES variables for this project

let port = 9200
let host = process.env.ES_HOST
if (process.env.NODE_ENV === 'dev'){
   host='https://stag-api.vomemo.com/proxyES'
   port = 443
}
const es = new elasticsearch.Client({host: {host, port}})
es['builder'] = bodybuilder

/** Check the ES connection status */
async function checkConnection() {
  let isConnected = false
  while (!isConnected) {
    console.log('Connecting to ES')
    try {
      const health = await es.cluster.health({})
      console.log(health)
      isConnected = true
    } catch (err) {
      console.log('Connection Failed, Retrying...', err)
    }
  }
}

/** Clear the index, recreate it, and add mappings */
async function resetIndex(index, mappingSchema) {
  if (await es.indices.exists({index})) {
    await es.indices.delete({index})
  }

  await es.indices.create({index: index, body: mappingSchema})
}

/** Clear the index, recreate it, and add mappings */
async function initIndex(index, mappingSchema) {
  if (!await es.indices.exists({index})) {
    await es.indices.create({index: index, body: mappingSchema})
  }

}

/** Add book section schema mapping to ES */
async function putMapping(index, mappingSchema) {
  type = '_doc'
  return es.indices.putMapping({index, type, body: {properties: mappingSchema}})
}

es['initIndex'] = async function (index, mappingSchema) {
  await initIndex(index, mappingSchema)
}
es['checkConnection'] = async function () {
  await checkConnection()
}
es['putMapping'] = async function (index, mappingSchema) {
  await putMapping(index, mappingSchema)
}
es['resetIndex'] = async function (index, mappingSchema) {
  await resetIndex(index, mappingSchema)
}

module.exports = {
  es
}