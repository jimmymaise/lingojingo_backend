'use strict';

const moment = require('moment');
const bigqueryHandler = require('../intergration/bigquery/handler')
let datasetId = 'user'
let tableId = 'log_activity'

const internals = {};


internals.addUserLogActivity = async (logData) => {
  logData['dateTime'] = new Date().toISOString()
  return await bigqueryHandler.insertRowsAsStream(datasetId, tableId, [logData])
}


internals.getUserLogActivity = async (userId, dateTimeStart, dateTimeEnd, limit = 100) => {

  if (!dateTimeEnd){
    dateTimeEnd = new Date().toISOString()
  }
  if (!dateTimeStart){
    dateTimeStart = moment(dateTimeEnd).subtract(7 , 'day');
  }
  let timestampStart = moment(dateTimeStart).format("YYYY-MM-DD HH:mm:ss");
  let timestampEnd = moment(dateTimeEnd).format("YYYY-MM-DD HH:mm:ss");
  const query = `
    SELECT *
    FROM \`${datasetId}.${tableId}\`
    WHERE dateTime >= TIMESTAMP('${timestampStart}')
    AND dateTime <= TIMESTAMP('${timestampEnd}')
    AND userId = '${userId}'
    ORDER BY dateTime DESC
    LIMIT ${limit}
    `
  const options = {
    query: query,
// Location must match that of the dataset(s) referenced in the query.
// location: 'US',
  };
  let data =  await bigqueryHandler.queryBigQueryData(options)
  console.log(JSON.stringify(data))
  return data

}

exports.register = function (server, options) {

  server.expose('addUserLogActivity', internals.addUserLogActivity);
  server.expose('getUserLogActivity', internals.getUserLogActivity);



  return;
}
// internals.addUserLogActivity({
//   'userId': '1234',
//   'event': 'VIEW DECK',
//   'itemName': 'TOEIC',
//   'itemId': '9797',
//   'itemUrl': 'http://abc.com'
// })

exports.name = 'user-activity-service';
