// swiftlint:disable all
import Amplify
import Foundation

// Contains the set of classes that conforms to the `Model` protocol. 

final public class AmplifyModels: AmplifyModelRegistration {
  public let version: String = "33cd80b8343a60126657a25bc9025724"
  
  public func registerModels(registry: ModelRegistry.Type) {
    ModelRegistry.register(modelType: SensorValue.self)
  }
}