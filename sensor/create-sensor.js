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
const CERT_FOLDER = './certs/';
const POLICY_FILE = './policy.json';
const ROOT_CA_FILE = 'AmazonRootCA1.pem';

//open sensor definition file
var settings = require(SETTINGS_FILE);
const policyDocument = require(POLICY_FILE);

//use the credentials from the AWS profile
var credentials = new AWS.SharedIniFileCredentials({profile: PROFILE});
AWS.config.credentials = credentials;

AWS.config.update({
    region: REGION
});

async function createSensor(){

  try {

    const uid = new Date().getTime();

    settings.clientId = 'sensor-' + uid;

    var iot = new AWS.Iot();
  
    // get the regional IOT endpoint
    var params = { endpointType: 'iot:Data-ATS'};
    var result = await iot.describeEndpoint(params).promise();
    const host = result.endpointAddress;
    settings.host = host;

    //enable thing fleet indexing to enable searching things
    params = {
      thingIndexingConfiguration: { 
      thingIndexingMode: "REGISTRY_AND_SHADOW"
      }
    }

    result = await iot.updateIndexingConfiguration(params).promise();

    //set the iot core endpoint
    settings.host = host;
    
    //create the IOT policy
    var policyName = 'Policy-' + settings.clientId;
    var policy = { policyName: policyName, policyDocument: JSON.stringify(policyDocument)};
    result = await iot.createPolicy(policy).promise()

    //create the certificates
    result = await iot.createKeysAndCertificate({setAsActive:true}).promise();
    settings.certificateArn = result.certificateArn;
    const certificateArn = result.certificateArn;
    const certificatePem = result.certificatePem;
    const privateKey = result.keyPair.PrivateKey;

    //save the certificate
    var fileName = CERT_FOLDER + settings.clientId + '-certificate.pem.crt';
    settings.certPath = fileName;
    await fs.writeFile(fileName, certificatePem);

    //save the private key
    fileName = CERT_FOLDER + settings.clientId + '-private.pem.key';
    settings.keyPath = fileName;
    await fs.writeFile(fileName, privateKey);

    //save the AWS root certificate
    settings.caPath = CERT_FOLDER + ROOT_CA_FILE;
      
    //create the thing
    params = {
      thingName: settings.clientId,
    };

    await iot.createThing(params).promise();

    //attach policy to certificate
    await iot.attachPolicy({ policyName: policyName, target: certificateArn}).promise();
            
    //attach thing to certificate
    await iot.attachThingPrincipal({thingName: settings.clientId, principal: certificateArn}).promise();

    //save the updated settings file
    let data = JSON.stringify(settings, null, 2);
    await fs.writeFile(SETTINGS_FILE, data);

    //display results
    console.log('IoT Thing Provisioned: ' + settings.clientId);
    console.log('AWS Region: ' + REGION);
    console.log('AWS Profile: ' + PROFILE);

  }
  catch (err) {

    console.log('Error creating sensors');
    console.log(err.message);
  }

}

createSensor();
