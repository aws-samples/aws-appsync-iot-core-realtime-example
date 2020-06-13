import React, {useState,useEffect} from 'react';
import {API, graphqlOperation} from 'aws-amplify';
import {View, StyleSheet, Text} from 'react-native';
import Speedometer from 'react-native-speedometer-chart'
import {GetSensor, GetSensorStatusColor} from '../api/Sensors';
import {onCreateSensorValue} from '../graphql/subscriptions';

const SensorScreen = () => {

  const sensorId = 'sensor-1592012150474';

  const [sensor, setSensor] = useState({});
  const [sensorValue, setSensorValue] = useState({});
  const [readyToSubscribe, setReadyToSubscribe] = useState(false);

  //fetch sensor
  useEffect(() => {
    const initSensor = async () => {

      console.log('fetching sensor');

      try {
        const response = await GetSensor(sensorId);

        if (response) {
          setSensor(response);
          console.log('sensor retrived');
          setReadyToSubscribe(true);
        }
      }
      catch (error) {
        console.log('error fetching sensor', error);
      }
    };

    initSensor()

  }, [sensorId]);

  //subscribe to changes in sensor values
  useEffect(() => {

    if (readyToSubscribe) {
      console.log('start subscription to sensor');

      const subscriber = API.graphql(graphqlOperation(onCreateSensorValue, {sensorId : sensorId})).subscribe({
        next: (response) => {

          //update the sensor's status in state
          if (response.value.data.onCreateSensorValue) {
            setSensorValue(response.value.data.onCreateSensorValue)
          }
        },
        error: (error) => {
          console.log('error on sensor subscription', error);
        }
      });

      return () => {
        console.log('terminating subscription to sensor');
        subscriber.unsubscribe();
      }
    }

  }, [readyToSubscribe, sensorId]);

  return (

    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{sensor.sensorType}</Text>
      </View>
      <View style={styles.row}>
        <Speedometer 
              value={sensorValue.value} 
              totalValue={100} 
              showIndicator
              outerColor="#d3d3d3"
              internalColor={GetSensorStatusColor(sensorValue.isWarning)} 
          />
      </View>
      <View style={styles.row}>
        <Text style={styles.value}>{sensorValue.value}</Text>
      </View>
      <View style={styles.row}>
          <Text style={styles.value}>{new Date(sensorValue.timestamp).toLocaleTimeString()}</Text>
      </View>
  </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  title: {
    fontSize:32,
    fontWeight:'bold'
  },
  value: {
    fontSize:28
  },
  titleRow: {
    flex: 1,
    marginTop: 45,
    alignSelf: 'center',
    fontSize:24
  },
  row: {
    flex: 1,
    alignSelf: 'center'
  }
});

export default SensorScreen;
