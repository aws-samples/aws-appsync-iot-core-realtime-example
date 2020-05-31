/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createSensor = /* GraphQL */ `
  mutation CreateSensor($input: CreateSensorInput!) {
    createSensor(input: $input) {
      id
      sensorType
      value
      isWarning
      timestamp
      createdAt
      updatedAt
    }
  }
`;
export const updateSensor = /* GraphQL */ `
  mutation UpdateSensor($input: UpdateSensorInput!) {
    updateSensor(input: $input) {
      id
      sensorType
      value
      isWarning
      timestamp
      createdAt
      updatedAt
    }
  }
`;
export const deleteSensor = /* GraphQL */ `
  mutation DeleteSensor($input: DeleteSensorInput!) {
    deleteSensor(input: $input) {
      id
      sensorType
      value
      isWarning
      timestamp
      createdAt
      updatedAt
    }
  }
`;
