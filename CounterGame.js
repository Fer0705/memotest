import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';

const CounterGame = () => {
  const animals = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐵'];
  const [cards, setCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [showTimeUp, setShowTimeUp] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTimerCritical, setIsTimerCritical] = useState(false);

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
    if (card.flipped || card.matched || matchedCards.length === cards.length || !startTime || endTime) {
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
    setShowTimeUp(false);
    setStartTime(null);
    setEndTime(null);
    setTimeLeft(60);
    setIsTimerCritical(false)
    generateCards();
  };

  useEffect(() => {
    if (cards.length > 0 && matchedCards.length === cards.length && startTime && !endTime) {
      setShowCongratulations(true);
      setEndTime(new Date());
    }
  }, [cards, matchedCards, startTime, endTime]);

  useEffect(() => {
    let timer;
    if (startTime && !endTime && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (matchedCards.length !== cards.length) {
        setShowTimeUp(true);
      }
    }
    return () => clearTimeout(timer);
  }, [startTime, endTime, timeLeft, matchedCards, cards]);

  useEffect(() => {
    if (timeLeft === 10) {
      setIsTimerCritical(true);
    }
  }, [timeLeft]);

  const handleStartGame = () => {
    if (!startTime) {
      setStartTime(new Date());
    }
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
            disabled={selectedCards.length === 2 || card.matched || !startTime || endTime}
          >
            {card.flipped || card.matched ? (
              <Text style={styles.cardText}>{card.value}</Text>
            ) : (
              <Text style={styles.cardText}>🎴</Text>
            )}
          </TouchableOpacity>
        ))}
      </View>
      {!startTime && !endTime && (
        <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
          <Text style={styles.startButtonText}>Comenzar</Text>
        </TouchableOpacity>
      )}
      {/* {endTime && (
        <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
          <Text style={styles.restartButtonText}>Jugar de nuevo</Text>
        </TouchableOpacity>
      )} */}
      <Modal visible={showCongratulations} animationType="fade" transparent>
        <View style={styles.congratulationsContainer}>
          <Text style={styles.congratulationsText}>{showTimeUp ? 'Tiempo agotado' : '¡Felicitaciones!'}</Text>
          {!showTimeUp && (
            <Text style={styles.congratulationsSubText}>
              Has completado el juego!
            </Text>
          )}
          <TouchableOpacity style={styles.closeButton} onPress={restartGame}>
            <Text style={styles.closeButtonText}>Jugar de nuevo</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {showTimeUp && !endTime && (
        <Modal visible={showTimeUp} animationType="fade" transparent>
          <View style={styles.congratulationsContainer}>
            <Text style={styles.loserText}>¡Tiempo agotado!</Text>
            <TouchableOpacity style={styles.closeButton} onPress={restartGame}>
              <Text style={styles.closeButtonText}>Jugar de nuevo</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
      <View style={styles.timerContainer}>
        <Text style={[styles.timerText, isTimerCritical && styles.timerCriticalText]}>
          Tiempo restante: {timeLeft}
        </Text>
      </View>
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
    marginBottom: 20,
  },
  card: {
    width: 80,
    height: 80,
    backgroundColor: '#62b8ff',
    borderRadius: 8,
    margin: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardFlipped: {
    backgroundColor: '#FAFAFA',
  },
  cardMatched: {
    backgroundColor: '#C8E6C9',
  },
  cardText: {
    fontSize: 32,
  },
  startButton: {
    marginTop: 10,
    marginBottom:10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#66b8ff',
    borderRadius: 5,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  restartButton: {
    backgroundColor: '#62b8ff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginBottom: 20,
  },
  restartButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  congratulationsContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  congratulationsText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  congratulationsSubText: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 24,
  },
  loserText:{
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 30,
  },
  closeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#62b8ff',
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white'
  },
  timerCriticalText: {
    fontSize: 24,
    color: '#FF0000',
  },
});

export default CounterGame;
