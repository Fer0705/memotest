import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import MemoryGame from './MemoryGame';
import CounterGame from './CounterGame';

export default function App() {
  const [gameMode, setGameMode] = useState(null);

  const handleStartGame = (mode) => {
    setGameMode(mode);
  };

  const renderGameModeSelection = () => (
    <View style={styles.welcomeContainer}>
      <Text style={styles.welcome}>¡Bienvenido!</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleStartGame('tradition')}
      >
        <Text style={styles.buttonText}>Modalidad Tradicional</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleStartGame('counter')}
      >
        <Text style={styles.buttonText}>Modalidad Contrarreloj</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {gameMode === 'tradition' && <MemoryGame />}
      {gameMode === 'counter' && <CounterGame />}
      {!gameMode && renderGameModeSelection()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#113',
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcomeContainer: {
    alignItems: 'center',
  },
  welcome: {
    fontSize: 24,
    color: '#fff',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#62b8ff',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
  },
});
