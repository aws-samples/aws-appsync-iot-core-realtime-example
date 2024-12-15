import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { sendSensorValue } from "../functions/send-sensor-value/resource";

const schema = a
  .schema({
    SensorValue: a.model({
      id: a.id(),
      sensorId: a.string().required(),
      value: a.float().required(),
      timestamp: a.timestamp().required(),
    }),
  })
  .authorization((allow) => [
    allow.authenticated(),
    allow.resource(sendSensorValue),
  ]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
