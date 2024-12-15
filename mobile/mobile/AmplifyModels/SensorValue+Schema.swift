// swiftlint:disable all
import Amplify
import Foundation

extension SensorValue {
  // MARK: - CodingKeys 
   public enum CodingKeys: String, ModelKey {
    case id
    case sensorId
    case value
    case timestamp
    case createdAt
    case updatedAt
  }
  
  public static let keys = CodingKeys.self
  //  MARK: - ModelSchema 
  
  public static let schema = defineSchema { model in
    let sensorValue = SensorValue.keys
    
    model.authRules = [
      rule(allow: .private, operations: [.create, .update, .delete, .read])
    ]
    
    model.listPluralName = "SensorValues"
    model.syncPluralName = "SensorValues"
    
    model.attributes(
      .index(fields: ["id"], name: nil),
      .primaryKey(fields: [sensorValue.id])
    )
    
    model.fields(
      .field(sensorValue.id, is: .required, ofType: .string),
      .field(sensorValue.sensorId, is: .required, ofType: .string),
      .field(sensorValue.value, is: .required, ofType: .double),
      .field(sensorValue.timestamp, is: .required, ofType: .int),
      .field(sensorValue.createdAt, is: .optional, isReadOnly: true, ofType: .dateTime),
      .field(sensorValue.updatedAt, is: .optional, isReadOnly: true, ofType: .dateTime)
    )
    }
    public class Path: ModelPath<SensorValue> { }
    
    public static var rootPath: PropertyContainerPath? { Path() }
}

extension SensorValue: ModelIdentifiable {
  public typealias IdentifierFormat = ModelIdentifierFormat.Default
  public typealias IdentifierProtocol = DefaultModelIdentifier<Self>
}
extension ModelPath where ModelType == SensorValue {
  public var id: FieldPath<String>   {
      string("id") 
    }
  public var sensorId: FieldPath<String>   {
      string("sensorId") 
    }
  public var value: FieldPath<Double>   {
      double("value") 
    }
  public var timestamp: FieldPath<Int>   {
      int("timestamp") 
    }
  public var createdAt: FieldPath<Temporal.DateTime>   {
      datetime("createdAt") 
    }
  public var updatedAt: FieldPath<Temporal.DateTime>   {
      datetime("updatedAt") 
    }
}