import React from 'react';
import {View, StyleSheet, Text } from 'react-native';
import Speedometer from 'react-native-speedometer-chart'


const SensorGauge = ({sensorType, gaugeColor, value, time}) => {

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{sensorType}</Text>
      </View>
      <View style={styles.row}>
        <Speedometer 
              value={value} 
              totalValue={100} 
              showIndicator
              outerColor="#d3d3d3"
              internalColor={gaugeColor} 
          />
      </View>
      <View style={styles.row}>
        <Text style={styles.value}>{value}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.value}>{time}</Text>
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

export default SensorGauge;
