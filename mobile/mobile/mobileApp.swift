//
//  mobileApp.swift
//  mobile
//
//  Created by David Moser on 12/15/24.
//
import Amplify
import Authenticator
import AWSCognitoAuthPlugin
import AWSAPIPlugin
import SwiftUI

@main
struct mobileApp: App {
    init() {
        let awsApiPlugin = AWSAPIPlugin(modelRegistration: AmplifyModels())
        do {
            try Amplify.add(plugin: AWSCognitoAuthPlugin())
            try Amplify.add(plugin: awsApiPlugin)
            try Amplify.configure(with: .amplifyOutputs)
        } catch {
            print("Unable to configure Amplify \(error)")
        }
    }
    
    var body: some Scene {
        WindowGroup {
            Authenticator { state in
                ContentView()
            }
        }
    }
}
