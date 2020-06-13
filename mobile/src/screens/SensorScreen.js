import React, {useState,useEffect} from 'react';
import {API, graphqlOperation} from 'aws-amplify';
import {GetSensor, GetSensorStatusColor} from '../api/Sensors';
import {onCreateSensorValue} from '../graphql/subscriptions';

import SensorGauge from '../components/SensorGauge';
import Activity from '../components/Activity';

import settings from '../settings.json';

const SensorScreen = () => {

  const sensorId = settings.sensorId;

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

    sensorValue.value === undefined ? <Activity title="Fetching Sensor"/> :
      <SensorGauge 
        sensorType={sensor.sensorType}
        gaugeColor={GetSensorStatusColor(sensorValue.isWarning)}
        value={sensorValue.value}
        time={new Date(sensorValue.timestamp).toLocaleTimeString()}
      />
  );
};



export default SensorScreen;
