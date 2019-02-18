let admin = require('../../server').firebaseAdmin

function sendMessageToTopic(data, topic) {

// See documentation on defining a message payload.
  let message = {
    data,
    topic
  };

// Send a message to devices subscribed to the provided topic.
  admin.messaging().send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
    })
    .catch((error) => {
      console.log('Error sending message:', error);
    });

}


module.exports = {
  sendMessageToTopic
}
