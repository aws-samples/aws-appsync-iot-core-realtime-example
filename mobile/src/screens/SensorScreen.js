import React, {useState,useEffect} from 'react';
import {API, graphqlOperation} from 'aws-amplify';
import {GetSensor} from '../api/Sensors';
import {onCreateSensorValue} from '../graphql/subscriptions';

import SensorGauge from '../components/SensorGauge';
import Activity from '../components/Activity';
import { View,StyleSheet } from 'react-native';

import settings from '../settings.json';

const SensorScreen = () => {

  const sensorIdTe = settings.tempSensorId;
  const sensorIdBr = settings.brightnessSensorId;

  const [sensorTe, setSensorTe] = useState({});
  const [sensorValueTe, setSensorValueTe] = useState({});
  const [readyToSubscribeTe, setReadyToSubscribeTe] = useState(false);

  const [sensorBr, setSensorBr] = useState({});
  const [sensorValueBr, setSensorValueBr] = useState({});
  const [readyToSubscribeBr, setReadyToSubscribeBr] = useState(false);

  //fetch sensor
  useEffect(() => {
    const initSensorTe = async () => {

      console.log('fetching sensor');

      try {
        const response = await GetSensor(sensorIdTe);

        if (response) {
          setSensorTe(response);
          console.log('sensor retrived');
          setReadyToSubscribeTe(true);
        }
      }
      catch (error) {
        console.log('error fetching sensor', error);
      }
    };

    initSensorTe()

  }, [sensorIdTe]);

  //fetch sensor
  useEffect(() => {
    const initSensorBr = async () => {

      console.log('fetching sensor');

      try {
        const response = await GetSensor(sensorIdBr);

        if (response) {
          setSensorBr(response);
          console.log('sensor retrived');
          setReadyToSubscribeBr(true);
        }
      }
      catch (error) {
        console.log('error fetching sensor', error);
      }
    };

    initSensorBr()

  }, [sensorIdBr]);

  //subscribe to changes in sensor values
  useEffect(() => {

    if (readyToSubscribeTe) {
      console.log('start subscription to sensor');

      const subscriber = API.graphql(graphqlOperation(onCreateSensorValue, {sensorId : sensorIdTe})).subscribe({
        next: (response) => {

          //update the sensor's status in state
          if (response.value.data.onCreateSensorValue) {
            setSensorValueTe(response.value.data.onCreateSensorValue)
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

  }, [readyToSubscribeTe, sensorIdTe]);

  //subscribe to changes in sensor values
  useEffect(() => {

    if (readyToSubscribeBr) {
      console.log('start subscription to sensor');

      const subscriber = API.graphql(graphqlOperation(onCreateSensorValue, {sensorId : sensorIdBr})).subscribe({
        next: (response) => {

          //update the sensor's status in state
          if (response.value.data.onCreateSensorValue) {
            setSensorValueBr(response.value.data.onCreateSensorValue)
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

  }, [readyToSubscribeBr, sensorIdBr]);


  return (

    sensorValueTe.value === undefined ? <Activity title="Fetching Sensor"/> :
    <View style={styles.container}>
      <SensorGauge 
        sensorType={sensorTe.sensorType}
        value={sensorValueTe.value}
        unit={"C"}
        time={new Date(sensorValueTe.timestamp).toLocaleTimeString()}
      />
      <SensorGauge 
        sensorType={sensorBr.sensorType}
        value={sensorValueBr.value}
        unit={"C"}
        time={new Date(sensorValueBr.timestamp).toLocaleTimeString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  }
});


export default SensorScreen;
