// swiftlint:disable all
import Amplify
import Foundation

public struct SensorValue: Model {
  public let id: String
  public var sensorId: String
  public var value: Double
  public var timestamp: Int
  public var createdAt: Temporal.DateTime?
  public var updatedAt: Temporal.DateTime?
  
  public init(id: String = UUID().uuidString,
      sensorId: String,
      value: Double,
      timestamp: Int) {
    self.init(id: id,
      sensorId: sensorId,
      value: value,
      timestamp: timestamp,
      createdAt: nil,
      updatedAt: nil)
  }
  internal init(id: String = UUID().uuidString,
      sensorId: String,
      value: Double,
      timestamp: Int,
      createdAt: Temporal.DateTime? = nil,
      updatedAt: Temporal.DateTime? = nil) {
      self.id = id
      self.sensorId = sensorId
      self.value = value
      self.timestamp = timestamp
      self.createdAt = createdAt
      self.updatedAt = updatedAt
  }
}