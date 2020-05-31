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

    //define the graphql query to verify if the sensor exists
    const getSensor = gql`query GetSensor($id: ID!) {
      getSensor(id: $id) {
        id
        sensorType
        value
        isWarning
        timestamp
        createdAt
        updatedAt
      }
    }`;

    //define the graphql mutation to create the sensor record
    const createSensor = gql`mutation CreateSensor($input: CreateSensorInput!) {
        createSensor(input: $input) {
          id
          sensorType
          value
          isWarning
          timestamp
          createdAt
          updatedAt
        }
      }`;

    //execute the mutations
    try {

      //execute the get query to see if the sensor already exists
      const sensor = await graphqlClient.query({
        query: getSensor,
        variables: {
            id: event.sensorId
          }
      });

      console.log('getSensor query executed');

      //if the sensor does not exist - create it
      if (!sensor.data.getSensor)
      {
        console.log('sensor record does not exist - creating new record');

        await graphqlClient.mutate({
          mutation: createSensor,
          variables: {input: {
              id: event.sensorId,
              sensorType: event.data.sensorType,
              value: event.data.value,
              isWarning: false,
              timestamp: event.data.timestamp
          }}
        });

        console.log('sensor record created');
      }
      else {
        console.log('sensor record already exists');
      }

      const response = {
        statusCode: 200,
        body: JSON.stringify({ message: 'Success' })
      }
    
      return response
    }
    catch (err) {

      console.log('an error occured');

      const response = {
        statusCode: 400,
        body: JSON.stringify({ message: err.message })
      }

      return response
    }
}
