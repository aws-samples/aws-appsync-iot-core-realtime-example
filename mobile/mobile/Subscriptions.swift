//
//  Subscriptions.swift
//  mobile
//
//  Created by David Moser on 12/15/24.
//

import Amplify

// Appsync GraphQL subscription request for sensor values
extension GraphQLRequest {
    
    static func onCreateSensorValue() -> GraphQLRequest<SensorValue> {
        let operationName = "onCreateSensorValue"
        let document = """
        subscription {
          \(operationName) {
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
            responseType: SensorValue.self,
            decodePath: operationName)
    }
}
