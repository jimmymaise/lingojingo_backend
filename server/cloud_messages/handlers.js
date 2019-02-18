let admin = require('../../server').firebaseAdmin

function sendNotification(title, body, ) {
  let payload = {
    notification: {
      title: title,
      body: body
    }
  };
  let options = {
    priority: priority,
    timeToLive: timeToLive
  };

  admin.messaging().sendToDevice(registrationToken, payload, options)
    .then(function (response) {
      console.log("Successfully sent message:", response);
    })
    .catch(function (error) {
      console.log("Error sending message:", error);
    });
}
