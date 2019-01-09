// Imports the Google Cloud client library
const {BigQuery} = require('@google-cloud/bigquery');
const FIRE_BASE_CONFIG = require('../../data/firebase_config')
const KEY_FILE = FIRE_BASE_CONFIG.service[process.env.NODE_ENV]
const PROJECT_ID = KEY_FILE.project_id;


// Creates a client
const bigquery = new BigQuery({
  projectId: PROJECT_ID,
  credentials: KEY_FILE
});

// Inserts data into a table
async function insertRowsAsStream(datasetId, tableId, rows) {
  return await bigquery
    .dataset(datasetId)
    .table(tableId)
    .insert(rows);

}


// Runs the query
async function queryBigQueryData(options) {
  let data = await bigquery.query(options);
  return data[0]

}

module.exports.insertRowsAsStream = insertRowsAsStream;
module.exports.queryBigQueryData = queryBigQueryData;

