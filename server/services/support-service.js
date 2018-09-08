'use strict';

const Async = require('async');
const jiraHandler = require('../intergration/jira/handler')


const internals = {};

internals.addTicket = async (content,file) => {
  let ticketId = await jiraHandler.createJiraTicket(content)
  if(ticketId){

    let resp = await jiraHandler.uploadImageToJiraTicket(ticketId,file)
    return resp
  }



}


exports.register = function (server, options) {

  server.expose('addTicket', internals.addTicket);


  return;
};

exports.addTicket = internals.addTicket;


exports.name = 'support-service';
