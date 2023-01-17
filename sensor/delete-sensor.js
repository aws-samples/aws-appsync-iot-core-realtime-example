const fs = require('fs').promises;
const {
  IoTClient,
  DetachThingPrincipalCommand,
  DeleteThingCommand,
  DetachPolicyCommand,
  DeletePolicyCommand,
  UpdateCertificateCommand,
  DeleteCertificateCommand
} = require("@aws-sdk/client-iot");

const { ArgumentParser } = require('argparse');

//constants used in the app - do not change
const SETTINGS_FILE = './settings.json';

//open sensor definition file
var settings = require(SETTINGS_FILE);

async function deleteSensor(profile, region){

  try {

    const iotClient = new IoTClient({ profile: profile, region: region });
  
    //remove the iot core endpoint
    settings.host = "";
    
    //attach thing to certificate
    var command = new DetachThingPrincipalCommand({thingName: settings.clientId, principal: settings.certificateArn})
    await iotClient.send(command)

    //delete the thing
    command = new DeleteThingCommand({thingName: settings.clientId})
    await iotClient.send(command)

    //detach policy from certificate
    var policyName = 'Policy-' + settings.clientId;
    command = new DetachPolicyCommand({ policyName: policyName, target: settings.certificateArn})
    await iotClient.send(command)

    //delete the IOT policy
    command = new DeletePolicyCommand({policyName: policyName})
    await iotClient.send(command)

    //delete the certificates
    var certificateId = settings.certificateArn.split('/')[1];
    command = new UpdateCertificateCommand({certificateId:certificateId, newStatus:"INACTIVE"})
    await iotClient.send(command)

    command = new DeleteCertificateCommand({certificateId:certificateId, forceDelete:true})
    await iotClient.send(command)
    settings.certificateArn = ""

    //delete the certificate files
    await fs.unlink(settings.keyPath);
    settings.keyPath = "";

    await fs.unlink(settings.certPath);
    settings.certPath = "";
    settings.caPath = "";

    //save the updated settings file
    var data = JSON.stringify(settings, null, 2);
    await fs.writeFile(SETTINGS_FILE, data);

    //display results
    console.log('IoT Thing Removed: ' + settings.clientId);
    console.log('AWS Profile: ' + profile);
    console.log('AWS Region: ' + region);
  }
  catch (err) {

    console.log('Error deleting sensor');
    console.log(err.message);
  }
}

// parse for profile command line arguent
const parser = new ArgumentParser({
  description: 'Deletes IoT Thing for sensor defined in settings.json'
});

parser.add_argument('--profile', {default: 'default'});
parser.add_argument('--region', {default: 'us-east-1'});

args = parser.parse_args()

deleteSensor(args.profile, args.region);
