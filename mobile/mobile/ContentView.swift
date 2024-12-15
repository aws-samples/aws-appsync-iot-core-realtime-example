//
//  ContentView.swift
//  mobile
//
//  Created by David Moser on 12/15/24.
//

import SwiftUI
import Amplify

struct ContentView: View {
    
    // start service to receive new values from the cloud
    @ObservedObject var sensorValueService = SensorValueService()
    
    let gradient = Gradient(colors: [.blue, .green, .orange, .red])
    
    var body: some View {

        VStack (spacing: 150) {
            Text("Temperature")
                .font(.largeTitle)
            
            Gauge(value: sensorValueService.sensorValue, in: 0...100) {
            } currentValueLabel: {
                Text(sensorValueService.sensorValue, format: .number)
                    .foregroundColor(.gray)
            } minimumValueLabel: {
                Text("0")
                    .foregroundColor(.blue)
            } maximumValueLabel: {
                Text("100")
                    .foregroundColor(.red)
            }
            .gaugeStyle(.accessoryCircular)
            .scaleEffect(3)
            .tint(gradient)
            
            Text(sensorValueService.sensorTime, style: .time)
                .font(.title2)
        }
        .onDisappear {
            sensorValueService.cancelSubscription()
        }
    }
}

//#Preview {
//    ContentView()
//}
