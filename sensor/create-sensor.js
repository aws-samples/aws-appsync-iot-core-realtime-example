const fs = require('fs').promises;
const {
  IoTClient,
  DescribeEndpointCommand,
  UpdateIndexingConfigurationCommand,
  CreatePolicyCommand,
  CreateKeysAndCertificateCommand,
  CreateThingCommand,
  AttachPolicyCommand,
  AttachThingPrincipalCommand
} = require("@aws-sdk/client-iot");

const { ArgumentParser } = require('argparse');

//constants used in the app - do not change
const SETTINGS_FILE = './settings.json';
const CERT_FOLDER = './certs/';
const POLICY_FILE = './policy.json';
const ROOT_CA_FILE = 'AmazonRootCA1.pem';

//open sensor definition file
var settings = require(SETTINGS_FILE);
const policyDocument = require(POLICY_FILE);

async function createSensor(profile, region){

  try {

    const iotClient = new IoTClient({ profile: profile, region: region });
  
    // get the regional IOT endpoint
    var params = { endpointType: 'iot:Data-ATS'};
    var command = new DescribeEndpointCommand(params);
    const response = await iotClient.send(command);
    const host = response.endpointAddress;

    //enable thing fleet indexing to enable searching things
    params = {
      thingIndexingConfiguration: { 
      thingIndexingMode: "REGISTRY_AND_SHADOW"
      }
    }

    command = new UpdateIndexingConfigurationCommand(params)
    var result = await iotClient.send(command)

    //set the iot core endpoint
    settings.host = host;
    
    //create the IOT policy
    var policyName = 'Policy-' + settings.clientId;
    var policy = { policyName: policyName, policyDocument: JSON.stringify(policyDocument)};
    command = new CreatePolicyCommand(policy)
    result = await iotClient.send(command)

    //create the certificates
    command = new CreateKeysAndCertificateCommand({setAsActive:true});
    result = await iotClient.send(command)
    settings.certificateArn = result.certificateArn;
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

    command = new CreateThingCommand(params)
    await iotClient.send(command)

    //attach policy to certificate
    command = new AttachPolicyCommand({ policyName: policyName, target: settings.certificateArn})
    await iotClient.send(command)
        
    //attach thing to certificate
    command = new AttachThingPrincipalCommand({thingName: settings.clientId, principal: settings.certificateArn})
    await iotClient.send(command)

    //save the updated settings file
    let data = JSON.stringify(settings, null, 2);
    await fs.writeFile(SETTINGS_FILE, data);

    //display results
    console.log('IoT Thing Provisioned: ' + settings.clientId);
    console.log('AWS Profile: ' + profile);
    console.log('AWS Region: ' + region);
  }
  catch (err) {

    console.log('Error creating sensor');
    console.log(err.message);
  }

}

// parse for profile command line arguent
const parser = new ArgumentParser({
  description: 'Creates IoT Thing for sensor defined in settings.json'
});

parser.add_argument('--profile', {default: 'default'});
parser.add_argument('--region', {default: 'us-east-1'});

args = parser.parse_args()

createSensor(args.profile, args.region);
