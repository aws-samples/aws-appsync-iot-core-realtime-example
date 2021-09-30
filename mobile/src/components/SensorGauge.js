import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Speedometer from 'react-native-speedometer-chart';

const SensorGauge = ({sensorType, value, time, unit}) => {
  return (
    // <View style={styles.container}>
    //   <View style={styles.titleRow}>
    //     <Text style={styles.title}>{sensorType}</Text>
    //   </View>
    //   <View style={styles.row}>
    //     <Text style={styles.value}>{sensorType}: {value}{unit}</Text>
    //   </View>
    //   <View style={styles.row}>
    //     <Text style={styles.value}>{time}</Text>
    //   </View>
    // </View>
    <View style={styles.row}>
      <Text style={styles.value}>
        {sensorType}: {value}
      </Text>
      <Text style={styles.value}>{time}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 28,
  },
  titleRow: {
    flex: 1,
    marginTop: 45,
    alignSelf: 'center',
    fontSize: 24,
  },
  row: {
    // flex: 1,
    margin: 10,
    alignSelf: 'center',
  },
});

export default SensorGauge;
