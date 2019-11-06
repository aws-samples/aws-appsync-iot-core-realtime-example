const awsIot = require('aws-iot-device-sdk');

//load the settings file that contains the location of the device certificates and the clientId of the sensor
var settings = require('./settings.json');

//constants used in the application
const VALUE_TOPIC = "dt/sensor-view/[id]/sensor-value"; //topic to which sensor values will be published
const CREATE_TOPIC =  "cmd/sensor-view/[id]/sensor-create"; //topic to which the create sensor request will be published
const VALUE_RATE = 2000; //rate in milliseconds new temperature values will be published to the Cloud

//initialize the IOT device
var device = awsIot.device(settings);

//create a placeholder for the message
var msg = {
    sensorType: 'Temperature',
    value: 0,
    timestamp: new Date().getTime()
}

device.on('connect', function() {
    
    console.log('connected to IoT Hub');

    //publish a message to the create topic - this will trigger the sensor to be created by the app API
    var topic = CREATE_TOPIC.replace('[id]', settings.clientId);

    device.publish(topic, JSON.stringify(msg)); 

    console.log('published to topic ' + topic + ' ' + JSON.stringify(msg));

    //publish new temperature readings very 2 seconds
    setInterval(sendSensorState, VALUE_RATE);
});

device.on('error', function(error) {
    console.log('Error: ', error);
});

function sendSensorState() {

    msg.value = 75 + Math.floor((Math.random() * (10 - 1) + 1));
    msg.timestamp = new Date().getTime();

    var topic = VALUE_TOPIC.replace('[id]', settings.clientId);

    device.publish(topic, JSON.stringify(msg)); 

    console.log('published to topic ' + topic + ' ' + JSON.stringify(msg));
}
  
  

