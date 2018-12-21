'use strict';

const Async = require('async');
const gcloudHandler = require('../intergration/gcloud/handler')



const internals = {};

internals.uploadFile = async (content, file, path='') => {
    return await gcloudHandler.uploadFile(file, path)


}


exports.register = function (server, options) {

    server.expose('uploadFile', internals.uploadFile);


    return;
};

exports.uploadFile = internals.uploadFile;


exports.name = 'upload-file-service';
