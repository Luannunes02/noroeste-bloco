import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

const LoadingIndicator = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.carregandoText}>Carregando...</Text>
      <ActivityIndicator size="large" color="#fff813" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  carregandoText: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#fff813',
    marginBottom: 20
  }
});

export default LoadingIndicator;
