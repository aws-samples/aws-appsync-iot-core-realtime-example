/* Amplify Params - DO NOT EDIT
You can access the following resource attributes as environment variables from your Lambda function
var environment = process.env.ENV
var region = process.env.REGION
var apiSensorviewGraphQLAPIIdOutput = process.env.API_SENSORVIEW_GRAPHQLAPIIDOUTPUT
var apiSensorviewGraphQLAPIEndpointOutput = process.env.API_SENSORVIEW_GRAPHQLAPIENDPOINTOUTPUT

Amplify Params - DO NOT EDIT */

const AWS = require('aws-sdk');
const appsync = require('aws-appsync');
const gql = require('graphql-tag');
require('cross-fetch/polyfill');


AWS.config.update({
    region: process.env.REGION
});
  
const credentials = AWS.config.credentials;

exports.handler = async (event, context) => {

    console.log('event received:' + JSON.stringify(event));
    
    //create appsync client - using IAM permissions
    const graphqlClient = new appsync.AWSAppSyncClient({
        url: process.env.API_SENSORVIEW_GRAPHQLAPIENDPOINTOUTPUT,
        region: process.env.REGION,
        auth: {
          type: 'AWS_IAM',
          credentials: credentials
        },
        disableOffline: true
    });

    //define the graphql mutation to update the sensor
    const mutation = gql`mutation UpdateSensor($input: UpdateSensorInput!) {
        updateSensor(input: $input) {
          id
          sensorType
          value
          isWarning
          timestamp
        }
      }`;

    //determine if the sensor value is a warning based on the value >= 80
    let isWarning = (event.data.value) >= 80 ? true: false;

    //execute the mutation
    try {

      await graphqlClient.mutate({
        mutation,
        variables: {input: {
            id: event.sensorId,
            sensorType: event.data.sensorType,
            value: event.data.value,
            isWarning: isWarning,
            timestamp: event.data.timestamp
        }}
      });

      const response = {
        statusCode: 200,
        body: JSON.stringify({ message: 'Success' })
      }
    
      return response
    }
    catch (err) {

      const response = {
        statusCode: 400,
        body: JSON.stringify({ message: err.message })
      }

      return response
    }
}
