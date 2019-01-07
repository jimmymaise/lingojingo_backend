// Imports the Google Cloud client library
const {BigQuery} = require('@google-cloud/bigquery');
const FIRE_BASE_CONFIG = require('../../data/firebase_config')
let KEY_FILE = FIRE_BASE_CONFIG.service[process.env.NODE_ENV]
// KEY_FILE ={
//   "type": "service_account",
//   "project_id": "prod-vomemo",
//   "private_key_id": "5ffba48d4e53f91b6f6c6c30f1e4adce63166e75",
//   "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDbFThaH2gWNLbH\nOydlkMRBDTRxiGxWSCdeGvdpGITlXxU2jjTToUV9hcOQqnjR4KA8FIrIzIYwJ1y5\nMOqX/bbyK7+w7UDQ9cUaZinF6JO4t3Bnoo358mOVueYH/8wqcqqOcPR7dye5Wdix\nyeVUXUC6IDw/QgGAdCbiA97IEnn9TwF3WN/soLUGlmq7ABv7QBGRPBBgrvY+OZz+\n2TGE7WeboC2xel/3Qyg1zIJWz35dP2+Hg6jTkHp9gWEuFMiDhZI++AwJm7f257kS\new4xGyUon09Lsu4qBU6nwc5TSrxoNiOcp3ntcnNfxXmFYzQ76sV5sOty2YQ0VH/A\nd5jx1yPFAgMBAAECggEADVrWy4+cjbX66lwtw6A2hmyipMUXLY9Kbw8fw9VNzJmm\nNmQmzjvHe6ZazIfHw6t4uRDbgPAOwgK0QUm9EzTRISQPlF5yFArXUAuoQjsyPhFY\nlciv9OuUrHzfi99I99FzmilCjgAueLsEXZocE693kaEDayu/4a+y6xYnT3To4MsC\nOXBA2r6AnnvwD7i4Blb1HjCSJfNBG+5SGKuZ1unk/KdMoTfkISgXGvaZ2G7Lod3x\ntMtgsc6GyOHX4H+Re4wnd8uqziNxBvcf1eEDnkbOUwgQxvlvKiTQ8VPeJULpUV2j\nfWPrOlDj3xlkbEay8ddmrDVXT3vSTrMXofRrKj0gxQKBgQD4Em48KISf8lnXWTvs\n1yIZW8zHa/EeZ74l5F2SEbYgXQYJqgY277+POAU9Q1SMgGLJXVFfJx3oCgnGVFuM\nOxI2A01k9LITWl0TRZ1/yiG39AHWrmbaos2aFXakJobiDD4KjyZPu8tIhKmMYo0f\naPZlxg1e4TmfR71XfW6uaeEq+wKBgQDiFZ5uAMVLa3pgx8vDCMGJZ6EeHfu9ngAL\nk96421z2uY2w6Hg9NiZ48qW0QL5qvUwtAZB0Rmr5BGBLj78hz32cs2x02vfsGUu7\n1/YAxD9teOZHRSxpbC1Rn2DLIsPQ244uxig/AUPUzAiKaO6cIGe/yGZiKLeNnRsD\nSNziq9OwPwKBgESuzaiIS1gBgJBYG3hShBVjTko0f5i8fm/9T07e6n8BYmeQlJHn\nRTFBAGpa1vDjpvY7iQkASo5xIQ2xU3t662ra9TWrbhZfoX9xec7kxvsoas3mkYGd\nK7GqmaOPKy8w1oiT47aVtw3H9S1yJ8J3jCjXceJAF3UbJrgveVJ+7CG7AoGAKT3O\nV7y2QMrLWSo5JkvLmjgYMPlBOda/pV0FDO2fKLayfSn6/ReKrxd8WMRSt//uDGuz\noTJTQzekJUSEljNWc6ZbS3nCLgRzR0He80bZVyvtveSFdHmyTqhnLMcbt1bFugyV\nvOCLMh9CE5WOqVZT9q0k2BUbXq7hBZleCc9UX1sCgYAp2HvhyjzIg+a/So4a14vt\nGS0Iq4+zvCPy6ETez99nUuWzvD3B5R2cNHpJfsG5jWy9Mr6EeDTgtwH51M/zeU+Q\nU4maq+GrlEDtnJQQVbcvFWyOjwkt2/+S+sjqoUzs4tD491UscGot/FAM3N76Xf+H\n4fWOFGC4EdM0gRiBXgWqfQ==\n-----END PRIVATE KEY-----\n",
//   "client_email": "vomemo@prod-vomemo.iam.gserviceaccount.com",
//   "client_id": "118429915566501830622",
//   "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//   "token_uri": "https://oauth2.googleapis.com/token",
//   "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//   "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/vomemo%40prod-vomemo.iam.gserviceaccount.com"
// }

const PROJECT_ID = KEY_FILE.project_id;
const datasetId = "user_activity";
const tableId = "user_activity";
const rows = [{name: "Tom", age: 30}, {name: "Jane", age: 32}];

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

// insertRowsAsStream(datasetId, tableId, rows)
//
//
// const sqlQuery = `SELECT * FROM \`voca-memo.user_activity.user_activity\` LIMIT 1000`;
//
// const options = {
//   query: sqlQuery,
//   // Location must match that of the dataset(s) referenced in the query.
//   // location: 'US',
// };
// getData()

// Runs the query
async function queryBigQueryData(options) {
  return await bigquery.query(options);

}

module.exports.insertRowsAsStream = insertRowsAsStream;
module.exports.queryBigQueryData = queryBigQueryData;

