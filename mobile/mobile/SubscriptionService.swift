import Foundation
import Amplify

class SensorValueService: NSObject, ObservableObject {
    
    // ObservedObject for iOS views to subscribe to new messages as they are received from the Cloud
    @Published var sensorValue: Double = 0.00
    @Published var sensorTime: Date = Date.now
    
    // in a production app this will come from the authenticated user or sensor registration
    // for this sample we will hard code the sensor identifier
    var sensorId = "aws-iot-mobile-demo-sensor"
    
    var subscription: AmplifyAsyncThrowingSequence<GraphQLSubscriptionEvent<SensorValue>>
    
    override init() {
        self.subscription = Amplify.API.subscribe(request: .onCreateSensorValue(sensorId: sensorId))
        super.init()
        startSubscription()
    }
    
    private func startSubscription() {

        Task {
            do {
                for try await subscriptionEvent in self.subscription {
                    switch subscriptionEvent {
                    case .connection(let subscriptionConnectionState):
                        print("Subscription connect state is \(subscriptionConnectionState)")
                    case .data(let result):
                        switch result {
                        case .success(let createdSensorValue):
                            print("Successfully received value from subscription: \(createdSensorValue)")
                            DispatchQueue.main.async {
                                self.sensorValue = createdSensorValue.value
                                self.sensorTime = Date(timeIntervalSince1970: Double(createdSensorValue.timestamp / 1000))
                            }
                        case .failure(let error):
                            print("Got failed result with \(error.errorDescription)")
                        }
                    }
                }
            } catch {
                print("Subscription has terminated with \(error)")
            }
        }
    }
    
    func cancelSubscription() {
        print("Cancelling subscription")
        self.subscription.cancel();
    }
}
