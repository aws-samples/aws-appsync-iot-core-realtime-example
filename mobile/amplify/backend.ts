import { defineBackend } from "@aws-amplify/backend";
import { ServicePrincipal } from "aws-cdk-lib/aws-iam";
import { CfnTopicRule } from "aws-cdk-lib/aws-iot";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { sendSensorValue } from "./functions/send-sensor-value/resource";

const backend = defineBackend({
  auth,
  data,
  sendSensorValue,
});

// disable unauthenticated access
const { cfnIdentityPool } = backend.auth.resources.cfnResources;
cfnIdentityPool.allowUnauthenticatedIdentities = false;

//  IoT Resources
const iotStack = backend.createStack("iot-stack");

const sendSensorValueLambda = backend.sendSensorValue.resources.lambda;

// create a rule to process messages from the sensors - send them to the lambda function
const rule = new CfnTopicRule(iotStack, "SendSensorValueRule", {
  topicRulePayload: {
    sql: "select * as data, topic(3) as sensorId from 'dt/sensor-view/+/sensor-value'",
    actions: [
      {
        lambda: {
          functionArn: sendSensorValueLambda.functionArn,
        },
      },
    ],
  },
});

// allow IoT rule to invoke the lambda function
sendSensorValueLambda.addPermission("AllowIoTInvoke", {
  principal: new ServicePrincipal("iot.amazonaws.com"),
  sourceArn: `arn:aws:iot:${iotStack.region}:${iotStack.account}:rule/SendSensorValueRule*`,
});
