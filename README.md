# AWS AppSync IoT Core Realtime Example

This application demonstrates an iPhone receiving real-time updates from an IoT sensor.  The solution is built with AWS AppSync and AWS IoT Core technologies.

![Image description](images/app.png)

## Architecture
![Image description](images/architecture.png)
1. The sensor component is developed with the AWS IoT Device SDK for Javascript.  The sensor is registered as a Thing in IoT Core and publishes a random temperature in a JSON payload to the Cloud every 2 seconds.  The Thing Shadow also containes meta-data about then sensor specifying the _sensor type_ as Temperature.

```json
{
    "value": 84,
    "timestamp": 1570562147790
}
```

2. A rule in IoT Core subscribes to the message topic and forwards the JSON payload to a Lambda function.

3. The NodeJS Lambda function executes a GraphQL mutatation in AppSync.  The mutation saves the latest value for the sensor in DynamoDB and broadcasts the latest value in real-time to the iOS application. The Lambda function uses an IAM role and policy to obtain permissions to interact with AppSync.

4. The iOS application uses the [Amplify Swift](https://github.com/aws-amplify/amplify-swift) package, built with the [AWS SDK for Swift](https://github.com/awslabs/aws-sdk-swift), to subscribe to the AppSync Sensor Value subscription.  When new temperature values are received, the gauge component on the screen is updated in real-time to reflect the new sensor value. 

## Getting Started

### **Prerequisites**

The following software was used in the development of this application.  While it may work with alternative versions, we recommend you deploy the specified minimum version.

1. An AWS account in which you have Administrator access.

2. [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) (^2.15.3) the AWS Command Line Interface (CLI) is used to configure your connection credentials to AWS.

3. [Node.js](https://nodejs.org/en/download/current/) (^18.19.0) with NPM (^10.1.0)

4. [Amplify CLI](https://docs.amplify.aws/cli/start/install) (^12.10.1x) Amplify is used to create the AWS AppSync API and generate the client side Swift code to interact with AWS.

5. [Xcode](https://developer.apple.com/xcode/) (15.2) Xcode is used to build and debug the mobile appliction application.  You will need iOS Simulator 17.0 enabled.

After you have installed and configured Amplify, take note of the AWS profile you selected during the configuration.  If you created a profile other than **default**, you will need the profile name for later steps in the deployment.

### **Installing**

**Clone this code repository**

```
git clone https://github.com/aws-samples/aws-appsync-iot-core-realtime-example.git
```

**Switch to the mobile folder**

```
cd aws-appsync-iot-core-realtime-example/mobile
```

**Initialize your Amplify environment**

```
amplify init

? Enter a name for the environment: dev
? Choose your default editor: [select your favorite IDE]
? Select the authentication method you want to use: (Use arrow keys)
❯ AWS profile
  AWS access keys

? Please choose the profile you want to use (Use arrow keys)
❯ default
```

When you select your profile, make sure to select the same profile you used when configuring Amplify.

Once your account has been provisioned, entering the **amplify status** command will show you the resources Amplify will create in your account:

```
amplify status

Current Environment: dev

┌──────────┬───────────────────┬───────────┬───────────────────┐
│ Category │ Resource name     │ Operation │ Provider plugin   │
├──────────┼───────────────────┼───────────┼───────────────────┤
│ Api      │ sensorapi         │ Create    │ awscloudformation │
├──────────┼───────────────────┼───────────┼───────────────────┤
│ Function │ createsensorvalue │ Create    │ awscloudformation │
├──────────┼───────────────────┼───────────┼───────────────────┤
│ Custom   │ iotrule           │ Create    │ awscloudformation │
└──────────┴───────────────────┴───────────┴───────────────────┘
```

**Deploy the app infrastructure to your AWS account**

```
amplify push

? Do you want to generate code for your newly created GraphQL API (Y/n) n
```
You will then see a series of output as Amplify builds and deploys the app's CloudFormation Templates, creating the app infrastucture in your AWS account. 

Resources being created in your account include:

- AppSync GraphQL API
- DynamoDB table
- Lambda function
- IoT Rule

**Generate the Swift client side code**

This command will generate the Swift classes for your app to communicate with the the API.

```
amplify codegen models
```

**Install the IoT Sensor Simulator**

Open a new terminal window then switch to the app's **sensor** folder (aws-appsync-iot-core-realtime-example/sensor). 

Install the Node.js packages, and run the Node.js app to create your sensor as a **Thing** in AWS IoT Core.  It will also create and install the certificates your sensor needs to authenticate to IoT Core.

From the **sensor** folder:

```
npm install
node create-sensor.js [--profile] [--region]
```

*Note - the profile and region arguments are optional. If not specified, the app will create the sensor using your default AWS Profile in us-east-1*

## Run the App

**Start the IoT Sensor**

From the **sensor** terminal window:

```
node index.js
```
You will see output from the app as it connects to IoT Core, transmits its shadow document, and publishes new temperature messages every 2 seconds.

```
connected to IoT Hub

published to shadow topic $aws/things/aws-iot-mobile-demo-sensor/shadow/update {"state":{"reported":{"sensorType":"Temperature"}}}

published to topic dt/sensor-view/aws-iot-mobile-demo-sensor/sensor-value {"value":77,"timestamp":1592073890804}

published to topic dt/sensor-view/aws-iot-mobile-demo-sensor/sensor-value {"value":76,"timestamp":1592073892807}

published to topic dt/sensor-view/aws-iot-mobile-demo-sensor/sensor-value {"value":77,"timestamp":1592073894810}
```
Keep this app running and switch to your mobile terminal window.

**Start the iPhone app**

From the terminal window pointing to the **mobile** folder (aws-appsync-iot-core-realtime-example/mobile) and open the Xcode project:

```
open mobile.xcodeproj
```

Once the project loads in Xcode, select the "Run" arrow button to start the app.

**Use the App!**

You should now see a screen similar to the one at the top of this guide.  If you look at the terminal window running the sensor app, you shoud see the values published to the Cloud reflected in the iPhone app's sensor gauge in real-time.

## Cleanup

Once you are finished working with this project, you may want to delete the resources it created in your AWS account.  

From the **mobile** folder:

```
amplify delete
? Are you sure you want to continue? (This would delete all the environments of the project from the cloud and wipe out all the local amplify resource files) (Y/n)  Y
```

From the **sensor** folder:

```
node delete-sensor.js [--profile] [--region]
```

*Note - the profile and region arguments are optional. If not specified the app will delete the sensor using your default AWS Profile in us-east-1*

## License

This sample code is made available under a modified MIT-0 license. See the LICENSE file.
