const PushNotifications = require("@pusher/push-notifications-server");
const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler')




let beamsClient = new PushNotifications({
    instanceId: "YOUR_INSTANCE_ID_HERE",
    secretKey: "YOUR_SECRET_KEY_HERE",
});

async (key, title, body) => {
    // Define the message payload

    const message = {
        apns: {
            aps: {
                alert: {
                    title: title,
                    body: body,
                    key: key,

                },
            },
        },
    };

    // Define the interests to send the message to
    const interests = [key];

    // Publish the message
    beamsClient.publishToInterests(interests, message)
        .then((response) => {
            console.log('Message published:', response);
        })
        .catch((error) => {
            console.error('Error publishing message:', error);
        });
}


const fireNotification = asyncHandler(async (req, res, next) => {
    const { title, body, key } = req.body;
    res.status(200).json({ title: title }, { body: body }, { key: key })
})


module.exports = PushNotifications;
module.exports.fireNotification = fireNotification;