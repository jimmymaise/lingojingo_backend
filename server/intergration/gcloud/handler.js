const imageMagick = require("imagemagick-stream");
const request = require("request")
const FIRE_BASE_CONFIG = require('../../data/firebase_config')
const KEY_FILE = FIRE_BASE_CONFIG.service[process.env.NODE_ENV]
const CACHE_CONTROL = require('../../utils/constants').CACHE_CONTROL
const {Storage} = require('@google-cloud/storage');
const logger = require('../../utils/logger.js').logger

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

async function getImageUrl(filePath) {
  const file = bucket.file(filePath)
  let urls = await file.getSignedUrl({
    action: 'read',
    expires: '03-01-2500',
  })
  return urls[0]

}

function cropImage(path, dest) {
  const gcsSrcObject = bucket.file(path);
  const gcsDstObject = bucket.file(dest);
  if (path.split('.').pop() === 'gif') {
    console.log("Image crop should not be gif")
    logger.error("Image crop should not be gif")
    return

  }

  let contentType = dest.endsWith('.png') ? 'image/png' : 'image/jpeg'
  let srcStream = gcsSrcObject.createReadStream({validation: false});
  let dstStream = gcsDstObject.createWriteStream({
    // Tweak the config options as desired.
    gzip: true,
    cacheControl: CACHE_CONTROL,
    metadata: {
      contentType: contentType
    }
  });
  let crop

  crop = imageMagick().crop("0x0+0+72");
  crop.on('error', function (e) {
    console.log(path + "//" + e)
    logger.error("Cannot crop image " + path + "//" + e)
    return

  })


  console.log("Pipe");
  srcStream.pipe(crop).pipe(dstStream);

  return new Promise((resolve, reject) => {
    dstStream
      .on("error", (err) => {
        console.log(`Error: ${err}`);
        reject(err);
      })
      .on("finish", () => {
        console.log(`Success: ${path} → ${dest}`);
        resolve(dest);
      });
  });
}


function saveToStorage(attachmentUrl, path) {
  return new Promise((resolve, reject) => {
    let fileName = attachmentUrl.substring(attachmentUrl.lastIndexOf('/') + 1).replace(/((\?|#).*)?$/, '');
    let content_type
    if (fileName.endsWith('.pict')) {
      fileName = fileName.substr(0, fileName.lastIndexOf(".")) + ".jpg";
      content_type = 'image/jpeg'
    }
    let destination = '/' + Math.floor(Date.now() / 1000) + '_' + fileName
    destination = path ? path + destination : destination
    const req = request(attachmentUrl);
    req.pause();
    req.on('response', res => {
      // Don't set up the pipe to the write stream unless the status is ok.
      if (res.statusCode !== 200) {
        reject();
      }

      const writeStream = bucket.file(destination)
        .createWriteStream({
          // Tweak the config options as desired.
          gzip: true,
          cacheControl: 'public, max-age=14400',
          metadata: {
            contentType: content_type || res.headers['content-type']
          }
        });
      req.pipe(writeStream)
        .on('finish', () => {
          writeStream.end();
          resolve(destination);
        })
        .on('error', err => {
          writeStream.end();
          console.error(err);
          reject()
        });

      // Resume only when the pipe is set up.
      req.resume();
    });
    req.on('error', err => console.error(err));
  })
}

async function uploadBucket(file, path) {
  let destination = '/' + Math.floor(Date.now() / 1000) + '_' + file.filename
  destination = path ? path + destination : destination

  let result = await bucket.upload(file.path, {
    destination,
    metadata:
      {
        gzip: true,
        cacheControl: CACHE_CONTROL,
        contentType: file.headers['content-type']
      }
  })
  return destination

}

async function batchUpload(files, path) {
  let result = {}
  for (let i = 0; i < files.length; i++) {
    try {
      let destination = await uploadBucket(files[i], path);
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

cropImageFromFolder = async (path_folder, dest_folder) => {


  const options = {
    prefix: path_folder,
  };
  const [files] = await bucket.getFiles(options);
  for (let i = 0; i < files.length; i++) {

    let dest = dest_folder + '/' + files[i]['name']
    let file = bucket.file(dest);
    let isFileExist = (await file.exists())[0]
    if (isFileExist) {
      continue
    }
    try {
      let imagePath = await cropImage(files[i]['name'], dest)
      console.log(imagePath)

    } catch (e) {
      console.log(files[i]['name'] + ":" + e.toString())
    }


  }

}

module.exports.uploadFile = uploadFile;
module.exports.saveToStorage = saveToStorage;
module.exports.cropImage = cropImage;
module.exports.cropImageFromFolder = cropImageFromFolder;
module.exports.getImageUrl = getImageUrl;



