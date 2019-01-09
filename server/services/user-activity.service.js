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

  if (!dateTimeEnd) {
    dateTimeEnd = new Date().toISOString()
  }
  if (!dateTimeStart) {
    dateTimeStart = moment(dateTimeEnd).subtract(7, 'day');
  }

  let timestampStart = (/^\d+$/.test(dateTimeEnd)) ?
    new Date(parseInt(dateTimeStart)).toISOString() : moment(dateTimeStart).toISOString()

  let timestampEnd = (/^\d+$/.test(dateTimeStart)) ?
    new Date(parseInt(dateTimeEnd)).toISOString() : moment(dateTimeEnd).toISOString()

  const query = `
    SELECT *
    FROM \`${datasetId}.${tableId}\`
    WHERE dateTime >= TIMESTAMP('${timestampStart}')
    AND dateTime <= TIMESTAMP('${timestampEnd}')
    AND userId = '${userId}'
    ORDER BY dateTime DESC
    LIMIT ${limit}
    `
  // console.log(query)
  const options = {
    query: query,
// Location must match that of the dataset(s) referenced in the query.
// location: 'US',
  };
  let data = await bigqueryHandler.queryBigQueryData(options)
  // console.log(JSON.stringify(data))
  return data

}

exports.register = function (server, options) {

  server.expose('addUserLogActivity', internals.addUserLogActivity);
  server.expose('getUserLogActivity', internals.getUserLogActivity);


  return;
}


exports.name = 'user-activity-service';
