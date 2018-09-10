'use strict';

const Async = require('async');
const jiraHandler = require('../intergration/jira/handler')


const internals = {};

internals.addTicket = async (content, file) => {
  let ticketId = await jiraHandler.createJiraTicket(content)
  if (ticketId) {
    if (!file) {
      return {
        ticketId: ticketId,
      }
    }
    let resp = await jiraHandler.uploadImageToJiraTicket(ticketId, file)
    if (resp.statusCode === 200) {
      return {
        ticketId: ticketId,
        uploadFileSuccess: true
      }
    }
    return {
      ticketId: ticketId,
      uploadFileSuccess: false
    }
  }
  return {
    ticketId: false,
    uploadSFileSuccess: false
  }

}


exports.register = function (server, options) {

  server.expose('addTicket', internals.addTicket);


  return;
};

exports.addTicket = internals.addTicket;


exports.name = 'support-service';
