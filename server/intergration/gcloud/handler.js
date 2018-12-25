var glob = require("glob");
var fs = require("fs");
const FIRE_BASE_CONFIG = require('../../data/firebase_config')
const KEY_FILE = FIRE_BASE_CONFIG.service[process.env.NODE_ENV]

const {Storage} = require('@google-cloud/storage');

const PROJECT_ID = KEY_FILE.project_id;

let storage = new Storage({
  projectId: PROJECT_ID,
  credentials: KEY_FILE
})
let bucket = storage.bucket(`${PROJECT_ID}.appspot.com`)

var _inArray = function (needle, haystack) {

  for (var k in haystack) {
    if (haystack[k] === needle) {
      return true;
    }
  }
  return false;
}

async function uploadBucket(file, path) {
  destination = '/' + Math.floor(Date.now() / 1000) + '_' + file.filename
  destination = path ? path + destination : destination

  let result = await bucket.upload(file.path, {
    destination,
    metadata:
      {
        cacheControl: 'public, max-age=14400',
        contentType: file.headers['content-type']
      }
  })
  return destination

}

async function batchUpload(files, path) {
  result = {}
  for (let i = 0; i < files.length; i++) {
    try {
      destination = await uploadBucket(files[i], path);
      result[files[i]['filename']] = {uploaded: true, path: destination}
    } catch (err) {
      result[files[i]['filename']] = {uploaded: false, error: err}
    }

  }
  return result
}

async function uploadFile(files, path) {
  if (!Array.isArray(files)) {
    files = [files]
  }

  return await batchUpload(files, path)

}

module.exports.uploadFile = uploadFile;
