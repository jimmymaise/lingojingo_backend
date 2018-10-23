const jiraConfig = require('./setting').JIRA_CONFIG
const bodyTemplate = require('./templates').bodyData
const Mustache = require('mustache')
const sentry = require('../../utils/logger').logger;

const fs = require('fs')
Mustache.escape = function (value) {
  return value;
};
let request = require('request-promise');
let b64string = jiraConfig.username + ':' + jiraConfig.password
AUTH_TOKEN = Buffer.from(b64string).toString('base64');

// request.defaults.baseURL = jiraConfig.url;
// request.defaults.headers.common['Authorization'] = 'Basic ' + AUTH_TOKEN;
// request.defaults.headers.post['Content-Type'] = 'application/json';
// request.defaults.headers.post['Accept'] = 'application/json';
// request.defaults.validateStatus = undefined


let baseRequest = request.defaults({
  headers: {'Authorization': 'Basic ' + AUTH_TOKEN, 'Content-Type': 'application/json'},
  baseURL: jiraConfig.url,

})

function convertFileUpload(files) {
  if (!Array.isArray(files)) {
    files = [files]
  }
  let convertedFiles = []
  for (let i = 0; i < files.length; i++) {
    let convertedFile = {
      value: fs.createReadStream(files[i].path),
      options: {
        filename: files[i].filename,
        contentType: files[i]['headers']['content-type']
      }
    }
    convertedFiles.push(convertedFile)

  }
  return convertedFiles
}

async function createJiraTicket(body) {
  body['projectKey'] = jiraConfig.projectKey


  let bodyData = Mustache.render(bodyTemplate, body);
  bodyData = JSON.parse(bodyData)
  let options = {
    method: 'POST',
    json: true,
    simple: false,
    resolveWithFullResponse: true,
    url: jiraConfig.url + '/issue',
    body: bodyData,
  };

  let resp = await baseRequest(options);

  sentry.error(bodyData, resp )


  return resp.body.key

}

async function uploadImageToJiraTicket(issueIdOrKey, files) {

  files = convertFileUpload(files)
  let formData = {
    file: files
  };

  let options = {
    method: 'POST',
    json: true,
    simple: false,
    resolveWithFullResponse: true,
    url: jiraConfig.url + '/issue/' + issueIdOrKey + '/attachments',
    formData: formData,
    headers: {
      'X-Atlassian-Token': 'no-check',
      'Content-Type': 'multipart/form-data'
    }
  }
  let resp = await baseRequest(options);
  return resp


};


module.exports.createJiraTicket = createJiraTicket;
module.exports.uploadImageToJiraTicket = uploadImageToJiraTicket;

