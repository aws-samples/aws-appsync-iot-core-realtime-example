import React from 'react'
import { View, StyleSheet } from "react-native"
import { Text } from "react-native-elements";
import Speedometer from 'react-native-speedometer-chart'
import { API, graphqlOperation } from 'aws-amplify'
import * as queries from '../graphql/queries'
import * as subscriptions from '../graphql/subscriptions'

//load the settings file that contains the id of the sensor to monitor
const settings = require('../settings.json')

export default class SensorDetailScreen extends React.Component {
  
  //variable to hold the appsync subscription for sensor value changes
  subscription = {};

  //set the title of the screen
  static navigationOptions = {
      title: 'Sensor View'
  };

  constructor(props) {
    super(props);

    //screen values that will change are stored in the state object
    this.state = {
      value: 0,
      isWarning: false,
      timestamp: 0,
      sensorType: ""
    };

  }

  async componentDidMount() {

    //create a parameter to specify the sensor id
    let param = {id: settings.sensorId};

    //execute a query to retrieve the initial value for the sensor and set the result in the state object
    try {
      const value = await API.graphql(graphqlOperation(queries.getSensor, param))
      
      this.setState({
        value: value.data.getSensor.value,
        isWarning: value.data.getSensor.isWarning,
        timestamp: value.data.getSensor.timestamp,
        sensorType: value.data.getSensor.sensorType
      })

    } catch (err) {
      console.log('error fetching sensor data', err)
    }

    //subscribe to changes in sensor status and update the state object
    this.subscription = API.graphql(
      graphqlOperation(subscriptions.onUpdateSensor, param)
    ).subscribe({
        next: eventData => {
          
            console.log('eventData', eventData)
              
            this.setState({
                value: eventData.value.data.onUpdateSensor.value,
                isWarning: eventData.value.data.onUpdateSensor.isWarning,
                timestamp: eventData.value.data.onUpdateSensor.timestamp,
                sensorType: eventData.value.data.onUpdateSensor.sensorType
              })

        }
    });
  }

  //when the screen unmounts unsubscribe from the subscription
  componentWillUnmount(){
    this.subscription.unsubscribe();
  }

  //create the screen - using the values from the state object to display changing data
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.firstrow}>
          <Text h1>{this.state.sensorType}</Text>
        </View>
        <View style={styles.secondrow}>
          <Speedometer 
                value={this.state.value} 
                totalValue={100} 
                showIndicator
                outerColor="#d3d3d3"
                internalColor={this.state.isWarning ? "red": "green"} 
            />
        </View>
        <View style={styles.thirdrow}>
          <Text h2>{ this.state.value }</Text>
        </View>
        <View style={styles.fourthrow}>
            <Text h3>{ new Date(this.state.timestamp).toLocaleTimeString() }</Text>
        </View>
      </View>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  firstrow: {
    flex: 1,
    marginTop: 45,
    alignSelf: 'center'
  },

  secondrow: {
    flex: 1,
    alignSelf: 'center'
  },

  thirdrow: {
    flex: 1,
    alignSelf: 'center'
  },

  fourthrow: {
    flex: 1,
    alignSelf: 'center'
  }
  
});