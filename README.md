# aws-appsync-iot-core-realtime-example

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

3. The Node js Lambda function executes a GraphQL mutatation in AppSync.  The mutation saves the latest value for the sensor in DynamoDB and broadcasts the latest value in real-time to the iOS application. The Lambda function uses an IAM role and policy to obtain permissions to interact with AppSync.

4. The React Native iOS application subscribes to the AppSync Sensor Update subscription.  When new temperature values are received, the gauge component on the screen is updated in real-time to reflect the new sensor value. The iOS application uses Cognito to authenticate users and allow them to perform the AppSync subscription. 

## Getting Started

### **Prerequisites**

The following software was used in the development of this application.  While it may work with alternative versions, we recommend you deploy the specified minimum version.

1. An AWS account in which you have Administrator access.

2. [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html) (2.4.19) the AWS Command Line Interface (CLI) is used to configure your connection credentials to AWS.

3. [Node.js](https://nodejs.org/en/download/current/) (^16.8.1) with NPM (^8.12.2)

4. [Amplify CLI](https://docs.amplify.aws/cli/start/install) (^10.6.1) Amplify is used to create the AWS AppSync API and generate the client side Swift code to interact with AWS.

5. [Xcode](https://developer.apple.com/xcode/) (14.2) Xcode is used to build and debug the mobile appliction application.  You will need iOS Simulator 16.0 enabled.

After you have installed and configured Amplify, take note of the AWS profile you selected during the configuration.  If you created a profile other than **default**, you will need the profile name for later steps in the deployment.

### **Installing**

**Clone this code repository**

```
$ git clone https://github.com/aws-samples/aws-appsync-iot-core-realtime-example.git
```

**Switch to the mobile folder**

```
$ cd aws-appsync-iot-core-realtime-example/mobile
```

**Install the iOS app's Node.js and CocoaPod packages**

```
$ npm install
$ cd ios
$ pod install
$ cd ..
```

**Initialize your Amplify environment**

```
$ cd aws-appsync-iot-core-realtime-example/mobile
$ amplify init

? Enter a name for the environment: mysandbox
? Choose your default editor: [select your favorite IDE]
? Do you want to use an AWS profile? Yes
? Please choose the profile you want to use: default
```

When you select your profile, make sure to select the same profile you used when configuring Amplify.

Amplify will then begin to provision your account for the project deployment.

```
? Do you want to configure Lambda Triggers for Cognito? (Y/n) n
```
Once your account has been provisioned, entering the 'amplify status' command will show you the resources Amplify will create in your account:

```
$ amplify status

Current Environment: mysandbox

| Category | Resource name      | Operation | Provider plugin   |
| -------- | ------------------ | --------- | ----------------- |
| Auth     | sensorview74d21f87 | Create    | awscloudformation |
| Api      | sensorview         | Create    | awscloudformation |
| Function | getsensor          | Create    | awscloudformation |
| Function | createsensorvalue  | Create    | awscloudformation |
| Iotrule  | createsensorvalue  | Create    | awscloudformation |
```

**Deploy the app infrastructure to your AWS account**

```
$ amplify push

? Do you want to update code for your updated GraphQL API (Y/n) Y

? Do you want to generate GraphQL statements (queries, mutations and subscription) based on your schema types? This will overwrite your current graphql queries, mutations and subscriptions (Y/n) Y
```
You will then see a series of output as Amplify builds and deploys the app's CloudFormation Templates, creating the app infrastucture in your AWS account. 

Resources being created in your account include:

- AppSync GraphQL API
- DynamoDB table
- Cognito user pool
- Lambda functions (2)
- IoT Rule


**Install the IoT Sensor Simulator**

Open a new terminal window then switch to the app's **sensor** folder (aws-appsync-iot-core-realtime-example/sensor). 

Install the Node.js packages, and run the Node.js app to create your sensor as a **Thing** in AWS IoT Core.  It will also create and install the certificates your sensor needs to authenticate to IoT Core.

From the **sensor** folder:

```
$ npm install
$ node create-sensor.js [--profile] [--region]
```

*Note - the profile and region arguments are optional. If not specified, the app will create the sensor using your default AWS Profile in us-east-1*

## Run the App

**Start the IoT Sensor**

From the **sensor** terminal window:

```
$ node index.js
```
You will see output from the app as it connects to IoT Core, transmits its shadow document, and publishes new temperature messages every 2 seconds.

```
connected to IoT Hub

published to shadow topic $aws/things/sensor-1592073852935/shadow/update {"state":{"reported":{"sensorType":"Temperature"}}}

published to topic dt/sensor-view/sensor-1592073852935/sensor-value {"value":77,"timestamp":1592073890804}

published to topic dt/sensor-view/sensor-1592073852935/sensor-value {"value":76,"timestamp":1592073892807}

published to topic dt/sensor-view/sensor-1592073852935/sensor-value {"value":77,"timestamp":1592073894810}
```
Keep this app running and switch to your mobile terminal window.

**Start the iPhone app**

Switch back to the terminal window pointing to the **mobile** folder and run:

```
$ npx react-native run-ios
```
This will launch Xcode's iPhone simulator and a new terminal window that serves up the app.

The default simulator is "iPhone X". If you wish to run your app on another iPhone version, for example an iPhone 11 Pro Max, run:

```
$ npx react-native run-ios --simulator="iPhone 11 Pro Max"
```

The simulator name must correspond to a device available in Xcode. You can check your available devices by running the following command from the console.

```
$ xcrun simctl list devices 
```

**Sign-up and Sign-in**

The iOS app requires users to authenticate via Cognito.  The first screen you will see is a logon screen.  Tap the **Sign Up** link and then tap the link to **Create account** and create a new account using your email address.

Cognito will then email you a confirmation code.  Enter this code into the subsequent confirmation screen and logon to the app with your credentials.

**Use the App!**

You should now see a screen similar to the one at the top of this guide.  If you look at the terminal window running the sensor app, you shoud see the values being published to the Cloud reflected in the iPhone app's sensor gauge in real-time.

## Cleanup

Once you are finished working with this project, you may want to delete the resources it created in your AWS account.  

From the **mobile** folder:

```
$ amplify delete
? Are you sure you want to continue? (This would delete all the environments of the project from the cloud and wipe out all the local amplify resource files) (Y/n)  Y
```

From the **sensor** folder:

```
$ node delete-sensor.js [--profile] [--region]
```

*Note - the profile and region arguments are optional. If not specified the app will delete the sensors using your default AWS Profile in us-east-1*

## License

This sample code is made available under a modified MIT-0 license. See the LICENSE file.
