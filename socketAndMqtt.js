const mqtt = require("mqtt");

const client = mqtt.connect("mqtt://91.121.93.94");
module.exports = client;
