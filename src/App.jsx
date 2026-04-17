import React, { useState, useEffect, useCallback } from 'react';
import WebSocketService from './services/WebSocketService';
import Header from './components/Header';
import StartScreen from './components/StartScreen';
import Lobby from './components/Lobby';
import GameScreen from './components/GameScreen';
import WaitingScreen from './components/WaitingScreen';
import ResultsScreen from './components/ResultsScreen';
import Alert from './components/Alert';
import './styles/global.css';
import './App.css';

// IMPORTANT: Update this with your Render.com backend URL
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'https://npat-backend.onrender.com/api';

function App() {
  const [connected, setConnected] = useState(false);
  const [gameState, setGameState] = useState({
    screen: 'start', // start, lobby, game, waiting, results
    roomCode: null,
    playerId: null,
    playerName: null,
    isHost: false,
    players: [],
    letter: null,
    timeLeft: 60,
    timerDuration: 60
  });
  const [alert, setAlert] = useState(null);

  // Connect to WebSocket on mount
  useEffect(() => {
    WebSocketService.connect(
      BACKEND_URL,
      () => {
        setConnected(true);
        WebSocketService.subscribeToUser(handleUserMessage);
      },
      (error) => {
        setConnected(false);
        showAlert('Connection error. Please refresh the page.', 'error');
      }
    );

    return () => {
      if (gameState.roomCode) {
        WebSocketService.leaveRoom(gameState.roomCode, gameState.playerId);
      }
      WebSocketService.disconnect();
    };
  }, []);

  const showAlert = (message, type = 'error') => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleUserMessage = useCallback((message) => {
    console.log('User message:', message);

    switch (message.type) {
      case 'ROOM_CREATED':
        handleRoomCreated(message);
        break;
      case 'ROOM_JOINED':
        handleRoomJoined(message);
        break;
      case 'ERROR':
        showAlert(message.data, 'error');
        break;
      default:
        break;
    }
  }, []);

  const handleRoomMessage = useCallback((message) => {
    console.log('Room message:', message);

    switch (message.type) {
      case 'PLAYER_JOINED':
      case 'PLAYER_LEFT':
        setGameState(prev => ({
          ...prev,
          players: message.data.players
        }));
        break;
      case 'GAME_STARTED':
        setGameState(prev => ({
          ...prev,
          screen: 'game',
          letter: message.data.letter,
          timeLeft: message.data.timerDuration || 60,
          timerDuration: message.data.timerDuration || 60
        }));
        break;
      case 'GAME_UPDATE':
        // Update if needed
        break;
      case 'RESULTS_READY':
        setGameState(prev => ({
          ...prev,
          screen: 'results',
          players: message.data.players,
          winner: message.data.winner
        }));
        break;
      default:
        break;
    }
  }, []);

  const handleRoomCreated = (message) => {
    const { roomCode, playerId, data } = message;
    setGameState({
      ...gameState,
      screen: 'lobby',
      roomCode,
      playerId,
      isHost: true,
      players: data.players,
      timerDuration: data.timerDuration || 60
    });
    WebSocketService.subscribeToRoom(roomCode, handleRoomMessage);
  };

  const handleRoomJoined = (message) => {
    const { roomCode, playerId, data } = message;
    setGameState({
      ...gameState,
      screen: 'lobby',
      roomCode,
      playerId,
      isHost: false,
      players: data.players,
      timerDuration: data.timerDuration || 60
    });
    WebSocketService.subscribeToRoom(roomCode, handleRoomMessage);
  };

  const createRoom = (playerName) => {
    if (!playerName.trim()) {
      showAlert('Please enter your name!', 'error');
      return;
    }
    setGameState(prev => ({ ...prev, playerName }));
    WebSocketService.createRoom(playerName);
  };

  const joinRoom = (roomCode, playerName) => {
    if (!playerName.trim()) {
      showAlert('Please enter your name!', 'error');
      return;
    }
    if (!roomCode || roomCode.length !== 4) {
      showAlert('Please enter a valid 4-letter room code!', 'error');
      return;
    }
    setGameState(prev => ({ ...prev, playerName }));
    WebSocketService.joinRoom(roomCode, playerName);
  };

  const startGame = () => {
    WebSocketService.startGame(gameState.roomCode, gameState.playerId);
  };

  const submitAnswers = (answers) => {
    WebSocketService.submitAnswers(gameState.roomCode, gameState.playerId, answers);
    setGameState(prev => ({ ...prev, screen: 'waiting' }));
  };

  const leaveRoom = () => {
    WebSocketService.leaveRoom(gameState.roomCode, gameState.playerId);
    WebSocketService.unsubscribeFromRoom(gameState.roomCode);
    setGameState({
      screen: 'start',
      roomCode: null,
      playerId: null,
      playerName: null,
      isHost: false,
      players: [],
      letter: null,
      timeLeft: 60,
      timerDuration: 60
    });
  };

  const playAgain = () => {
    if (gameState.isHost) {
      startGame();
    } else {
      showAlert('Only the host can start a new game!', 'error');
    }
  };

  return (
    <div className="app-container">
      <Header connected={connected} />
      
      <div className="game-container">
        {gameState.screen === 'start' && (
          <StartScreen onCreateRoom={createRoom} onJoinRoom={joinRoom} />
        )}
        
        {gameState.screen === 'lobby' && (
          <Lobby
            roomCode={gameState.roomCode}
            players={gameState.players}
            isHost={gameState.isHost}
            onStartGame={startGame}
            onLeaveRoom={leaveRoom}
          />
        )}
        
        {gameState.screen === 'game' && (
          <GameScreen
            letter={gameState.letter}
            timerDuration={gameState.timerDuration}
            onSubmitAnswers={submitAnswers}
          />
        )}
        
        {gameState.screen === 'waiting' && (
          <WaitingScreen />
        )}
        
        {gameState.screen === 'results' && (
          <ResultsScreen
            players={gameState.players}
            winner={gameState.winner}
            letter={gameState.letter}
            onPlayAgain={playAgain}
            onBackToLobby={() => setGameState(prev => ({ ...prev, screen: 'lobby' }))}
            isHost={gameState.isHost}
          />
        )}
      </div>

      {alert && <Alert message={alert.message} type={alert.type} />}
    </div>
  );
}

export default App;
