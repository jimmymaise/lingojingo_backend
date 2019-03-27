const gitlabConfig = require('./setting').GITLAB_CONFIG
const Mustache = require('mustache')
const sentry = require('../../utils/logger').logger;

const fs = require('fs')
Mustache.escape = function (value) {
  return value;
};
let request = require('request-promise');


let baseRequest = request.defaults({
  headers: {'PRIVATE-TOKEN': gitlabConfig.token, 'Content-Type': 'application/json'},
})


async function getTagDetail(type, tagName) {
  let pid
  switch (type) {
    case 'backend':
      pid = gitlabConfig.BEprojectId
      break;
    case 'frontend':
      pid = gitlabConfig.FEprojectId
      break;
    default:
      throw Error('wrong Type' + type)
  }

  let options = {
    method: 'GET',
    json: true,
    simple: false,
    resolveWithFullResponse: true,
    url: `${gitlabConfig.baseURL}/${pid}/repository/tags/${tagName}`,
  };
  let resp = await baseRequest(options);
  if(!resp.body) {
    throw Error(`Cannot find the tag ${tagName} of ${type} in project ${pid} `)
  }
  return {
    release: resp.body.release,
    version: resp.body.name,
    message: resp.body.message,
    type:type
  }

}


module.exports.getTagDetail = getTagDetail;

