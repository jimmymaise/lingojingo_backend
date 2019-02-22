const FIRE_BASE_CONFIG = require('../data/firebase_config')
const firebaseAdmin = require('firebase-admin');
const serviceAccount = FIRE_BASE_CONFIG.service[process.env.NODE_ENV];




module.exports = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  databaseURL: FIRE_BASE_CONFIG.databaseURL[process.env.NODE_ENV]
});;