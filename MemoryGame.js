import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

const MemoryGame = () => {
  const animals = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐵'];
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  useEffect(() => {
    generateCards();
  }, []);

  const generateCards = () => {
    const duplicatedAnimals = [...animals, ...animals];
    const shuffledAnimals = shuffleArray(duplicatedAnimals);
    const newCards = shuffledAnimals.map((animal, index) => ({
      id: index,
      value: animal,
      flipped: false,
      matched: false,
    }));
    setCards(newCards);
  };

  const shuffleArray = (array) => {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const flipCard = (card) => {
    if (card.flipped || card.matched || matchedCards.length === cards.length) {
      return;
    }

    if (selectedCards.length < 2) {
      setCards((prevCards) =>
        prevCards.map((c) => {
          if (c.id === card.id) {
            return { ...c, flipped: true };
          }
          return c;
        })
      );
      setSelectedCards((prevSelectedCards) => [...prevSelectedCards, card]);
    }
  };

  const checkForMatch = () => {
    if (selectedCards.length === 2) {
      const [card1, card2] = selectedCards;
      if (card1.value === card2.value) {
        setMatchedCards((prevMatchedCards) => [
          ...prevMatchedCards,
          card1.id,
          card2.id,
        ]);
        setCards((prevCards) =>
          prevCards.map((card) => {
            if (card.id === card1.id || card.id === card2.id) {
              return { ...card, matched: true };
            }
            return card;
          })
        );
        setSelectedCards([]);
      } else {
        setTimeout(() => {
          setCards((prevCards) =>
            prevCards.map((card) => {
              if (card.id === card1.id || card.id === card2.id) {
                return { ...card, flipped: false };
              }
              return card;
            })
          );
          setSelectedCards([]);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    checkForMatch();
  }, [selectedCards]);

  const restartGame = () => {
    setCards([]);
    setSelectedCards([]);
    setMatchedCards([]);
    setShowCongratulations(false);
    setStartTime(new Date());
    setEndTime(null);
    generateCards();
  };

  useEffect(() => {
    setStartTime(new Date());
  }, []);

  useEffect(() => {
    if (cards.length > 0 && matchedCards.length === cards.length) {
      setShowCongratulations(true);
      setEndTime(new Date());
    }
  }, [cards, matchedCards]);

  const calculateElapsedTime = () => {
    if (startTime && endTime) {
      const elapsedTimeInSeconds = Math.floor((endTime - startTime) / 1000);
      const minutes = Math.floor(elapsedTimeInSeconds / 60);
      const seconds = elapsedTimeInSeconds % 60;
      return `${minutes} minutos y ${seconds} segundos`;
    }
    return '';
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardsContainer}>
        {cards.map((card) => (
          <TouchableOpacity
            key={card.id}
            style={[
              styles.card,
              card.flipped || card.matched ? styles.cardFlipped : null,
              card.matched ? styles.cardMatched : null,
            ]}
            onPress={() => flipCard(card)}
            disabled={selectedCards.length === 2 || card.matched}
          >
            {card.flipped || card.matched ? (
              <Text style={styles.cardText}>{card.value}</Text>
            ) : (
              <Text style={styles.cardText}>🎴</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity
        style={styles.restartButton}
        onPress={restartGame}
        disabled={matchedCards.length === cards.length}
      >
        <Text style={styles.restartButtonText}>Reiniciar juego</Text>
      </TouchableOpacity>
      <Modal visible={showCongratulations} animationType="fade" transparent>
        <View style={styles.congratulationsContainer}>
          <Text style={styles.congratulationsText}>¡Felicitaciones!</Text>
          <Text style={styles.congratulationsSubText}>
            Has completado el juego en {calculateElapsedTime()}
          </Text>
          <TouchableOpacity style={styles.closeButton} onPress={restartGame}>
            <Text style={styles.closeButtonText}>Jugar de nuevo</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#113',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
  card: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#62b8ff',
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardFlipped: {
    backgroundColor: '#fff',
  },
  cardMatched: {
    backgroundColor: '#76c893',
  },
  cardText: {
    fontSize: 32,
    color: '#000',
  },
  restartButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#62b8ff',
    borderRadius: 5,
  },
  restartButtonText: {
    fontSize: 18,
    color: '#fff',
  },
  congratulationsContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  congratulationsText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  congratulationsSubText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 20,
    textAlign:'center'
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#62b8ff',
    borderRadius: 5,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default MemoryGame;