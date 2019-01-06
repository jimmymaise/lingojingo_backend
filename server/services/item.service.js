'use strict';

const gcloudHandler = require('../intergration/gcloud/handler')
const CardService = require('../services/card.service');


const internals = {};

internals.batchUpdateImage = async (updateArr) => {
  let data = []
  for (let i = 0; i < updateArr.length; i++) {
    let result = {}
    result['itemId'] = updateArr[i].itemId
    result['updated'] = false

    try {
      let imagePath = await gcloudHandler.saveToStorage(updateArr[i].url, '/transload_images')
      result['path'] = imagePath

      if (!updateArr[i].itemType || (updateArr[i].itemType.toLowerCase() === 'card')) {
        await CardService.updateOneCard(updateArr[i].itemId, {'img': [imagePath]});
        result['updated'] = true
      }

    } catch (e) {
      result['error'] = e.toString()
    }
    data.push(result)

  }
  return data


}

internals.batchCropImage = async (updateArr) => {
  let data = []
  for (let i = 0; i < updateArr.length; i++) {
    let result = {}
    result['itemId'] = updateArr[i].itemId
    result['updated'] = false


    try {

      let path = updateArr[i].path
      if (!path) {
        let cardData = await CardService.getOneCard(updateArr[i].itemId);
        path = cardData['img'][0]
      }
      let fileName = path.substring(path.lastIndexOf('/') + 1).replace(/((\?|#).*)?$/, '');

      let dest = 'cr_images/' + fileName
      let imagePath = await gcloudHandler.cropImage(updateArr[i].path, dest)
      result['path'] = imagePath
      if (!updateArr[i].itemType || (updateArr[i].itemType.toLowerCase() === 'card')) {
        await CardService.updateOneCard(updateArr[i].itemId, {'img': [imagePath]});
        result['updated'] = true
      }


    } catch (e) {
      result['error'] = e.toString()
    }
    data.push(result)

  }
  return data


}

exports.register = function (server, options) {

  server.expose('uploadFile', internals.uploadFile);
  server.expose('batchUpdateImage', internals.batchUpdateImage);
  server.expose('batchCropImage', internals.batchCropImage);


  return;
};

exports.uploadFile = internals.uploadFile;
exports.batchUpdateImage = internals.batchUpdateImage;


exports.name = 'item-service';
