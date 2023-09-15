import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

interface colorProps {
  color?: String
}

const LoadingIndicator = (props: colorProps) => {  
  const color = props.color === 'black' ? '#000' : '#fff813' ;
  return (
    <View style={styles.container}>
      <Text style={{...styles.carregandoText, color: color }}>Carregando...</Text>
      <ActivityIndicator size="large" color={`${color}`} />
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
    marginBottom: 20
  }
});

export default LoadingIndicator;
