import React from 'react';
import {View, StyleSheet, Text, ActivityIndicator } from 'react-native';

const Activity = ({title}) => {

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{title}</Text>
        <ActivityIndicator size="large" />
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
        marginBottom: 40
    },
    titleRow: {
        flex: 1,
        marginTop: 150,
        alignSelf: 'center'
    },
});

export default Activity;
