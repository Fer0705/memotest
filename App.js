import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import MemoryGame from './MemoryGame';
import CounterGame from './CounterGame';

export default function App() {
  const [gameMode, setGameMode] = useState(null);

  const handleStartGame = (mode) => {
    setGameMode(mode);
  };

  const renderGameModeSelection = () => (
    <View style={styles.container}>
      <View style={styles.welcomeContainer}>
      <Image
          source={{ uri: 'https://res.cloudinary.com/dldclv2km/image/upload/v1692898911/animalMemory_gmodrs.jpg' }} 
          style={styles.headerImage}
        />
        <Text style={styles.welcome}>¡Bienvenido a Memotest!</Text>
        <Text style={styles.description}>El desafío de la memoria te espera</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleStartGame('tradition')}
        >
          <Text style={styles.buttonTradicionalText}>Modalidad Tradicional</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleStartGame('counter')}
        >
          <Text style={styles.buttonText}>Modalidad Contrarreloj</Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#113',
  },
  
  welcomeContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    borderRadius: 10,
  },
  headerImage: {
    width: 200, 
    height: 100, 
    marginBottom: 10,
    borderRadius: 8,
  },
  welcome: {
    fontSize: 28,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    color: '#555',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#62b8ff',
    borderRadius: 5,
    marginBottom: 10,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 22,
    color: '#fff',
    textAlign: 'center',
    fontWeight:'400'
  },
  buttonTradicionalText: {
    fontSize: 22.7,
    color: '#fff',
    textAlign: 'center',
    fontWeight:'400'
  },
});

