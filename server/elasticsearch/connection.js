const elasticsearch = require('elasticsearch')
let bodybuilder = require('bodybuilder')


// Core ES variables for this project
const port = 9200
const host = process.env.ES_HOST || 'localhost'
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

  await es.indices.create({index})
  await putMapping(mappingSchema)
}


/** Add book section schema mapping to ES */
async function putMapping(mappingSchema) {
  // const schema = {
  //   title: { type: 'keyword' },
  //   author: { type: 'keyword' },
  //   location: { type: 'integer' },
  //   text: { type: 'text' }
  // }

  return es.indices.putMapping({index, type, body: {properties: mappingSchema}})
}

checkConnection()


module.exports = {
  es, checkConnection, resetIndex
}