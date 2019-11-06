/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getSensor = `query GetSensor($id: ID!) {
  getSensor(id: $id) {
    id
    sensorType
    value
    isWarning
    timestamp
  }
}
`;
export const listSensors = `query ListSensors(
  $filter: ModelSensorFilterInput
  $limit: Int
  $nextToken: String
) {
  listSensors(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      sensorType
      value
      isWarning
      timestamp
    }
    nextToken
  }
}
`;
