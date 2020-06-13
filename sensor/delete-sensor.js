process.env.AWS_SDK_LOAD_CONFIG = true;

const AWS = require('aws-sdk');
const fs = require('fs').promises;

//if a region is not specified in your local AWS config, it will default to us-east-1
const REGION = AWS.config.region || 'us-east-1';

//if you wish to use a profile other than default, set an AWS_PROFILE environment variable when you run this app
//for example:
//AWS_PROFILE=my-aws-profile node create-sensor.js
const PROFILE = process.env.AWS_PROFILE || 'default';

//constants used in the app - do not change
const SETTINGS_FILE = './settings.json';

//open sensor definition file
var settings = require(SETTINGS_FILE);

//use the credentials from the AWS profile
var credentials = new AWS.SharedIniFileCredentials({profile: PROFILE});
AWS.config.credentials = credentials;

AWS.config.update({
    region: REGION
});

async function deleteSensor(){

  try {

    var iot = new AWS.Iot();
  
    //remove the iot core endpoint
    settings.host = "";
    
    //attach thing to certificate
    await iot.detachThingPrincipal({thingName: settings.clientId, principal: settings.certificateArn}).promise();

    //delete the thing
    await iot.deleteThing({thingName: settings.clientId}).promise();

    //detach policy from certificate
    var policyName = 'Policy-' + settings.clientId;
    await iot.detachPolicy({ policyName: policyName, target: settings.certificateArn}).promise();

    //delete the IOT policy
    result = await iot.deletePolicy({policyName: policyName}).promise()

    //delete the certificates
    var certificateId = settings.certificateArn.split('/')[1];
    result = await iot.updateCertificate({certificateId:certificateId, newStatus:"INACTIVE"}).promise();
    result = await iot.deleteCertificate({certificateId:certificateId, forceDelete:true}).promise();
    settings.certificateArn = ""

    //delete the certificate files
    await fs.unlink(settings.keyPath);
    settings.keyPath = "";

    await fs.unlink(settings.certPath);
    settings.certPath = "";
    settings.caPath = "";

    //save the updated settings file
    settings.clientId = "";

    let data = JSON.stringify(settings, null, 2);
    await fs.writeFile(SETTINGS_FILE, data);

    //display results
    console.log('IoT Things Removed');
    console.log('AWS Region: ' + REGION);
    console.log('AWS Profile: ' + PROFILE);

  }
  catch (err) {

    console.log('Error deleting sensor');
    console.log(err.message);
  }
}

deleteSensor();
