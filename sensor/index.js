const awsIot = require('aws-iot-device-sdk');

//load the settings file that contains the location of the device certificates and the clientId of the sensor
var settings = require('./settings.json');

//constants used in the application
const SHADOW_TOPIC = "$aws/things/[thingName]/shadow/update";
const VALUE_TOPIC = "dt/sensor-view/SF/[thingName]/sensor-value"; //topic to which sensor values will be published
const VALUE_RATE = 2000; //rate in milliseconds new temperature values will be published to the Cloud

//initialize the IOT device
var device = awsIot.device(settings);

//shadow document to be transmitted at statup
var shadowDocument = {
    state: {
        reported: {
            sensorType: "Temperature",
        }
    }
}

//create a placeholder for the message
var msg = {
    value: 0,
    timestamp: new Date().getTime()
}

device.on('connect', function() {
    
    console.log('connected to IoT Hub');

    //publish the shadow document for the sensor
    var topic = SHADOW_TOPIC.replace('[thingName]', settings.clientId);

    device.publish(topic, JSON.stringify(shadowDocument)); 

    console.log('published to shadow topic ' + topic + ' ' + JSON.stringify(shadowDocument));

    //publish new value readings based on value_rate
    setInterval(function(){

        msg.value = 75 + Math.floor((Math.random() * (10 - 1) + 1));
        msg.timestamp = new Date().getTime();
    
        var topic = VALUE_TOPIC.replace('[thingName]', settings.clientId);
    
        device.publish(topic, JSON.stringify(msg)); 
    
        console.log('published to topic ' + topic + ' ' + JSON.stringify(msg));


    }, VALUE_RATE);
});

device.on('error', function(error) {
    console.log('Error: ', error);
});

  
  

