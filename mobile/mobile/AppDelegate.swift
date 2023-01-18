import Amplify
import AWSAPIPlugin
import UIKit

class AppDelegate: NSObject, UIApplicationDelegate {
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {

        do {
            try Amplify.add(plugin: AWSAPIPlugin(modelRegistration: AmplifyModels()))
            try Amplify.configure()
            print("Amplify configured with API plugin")
        } catch {
            print("Failed to initialize Amplify with \(error)")
        }

        return true
    }
}
