import React from 'react';
import { View, StyleSheet } from 'react-native';

export default function Logo() {
  return (
    <View style={styles.container}>
      <View style={styles.arc} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arc: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 4,
    borderColor: '#4EBEB3',
    borderTopColor: 'transparent',
    transform: [{ rotate: '45deg' }],
  },
});