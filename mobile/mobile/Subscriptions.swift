import Amplify

// Appsync GraphQL subscription request for sensor values
extension GraphQLRequest {
    
    static func onCreateSensorValue(sensorId: String) -> GraphQLRequest<SensorValue> {
        let operationName = "onCreateSensorValue"
        let document = """
        subscription \(operationName)($sensorId: String!) {
          \(operationName)(sensorId: $sensorId) {
            id
            createdAt
            sensorId
            timestamp
            updatedAt
            value
          }
        }
        """
        
        return GraphQLRequest<SensorValue>(
            document: document,
            variables: ["sensorId": sensorId],
            responseType: SensorValue.self,
            decodePath: operationName)
    }
}
