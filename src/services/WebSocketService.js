import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

class WebSocketService {
  constructor() {
    this.stompClient = null;
    this.connected = false;
    this.subscriptions = {};
  }

  connect(backendUrl, onConnected, onError) {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(`${backendUrl}/game-websocket`),
      debug: (str) => {
        // Disable debug logs in production
        if (process.env.NODE_ENV === 'development') {
          console.log(str);
        }
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        this.connected = true;
        console.log('Connected to WebSocket');
        onConnected();
      },
      onStompError: (frame) => {
        this.connected = false;
        console.error('STOMP error:', frame);
        onError(frame);
      },
      onWebSocketError: (error) => {
        this.connected = false;
        console.error('WebSocket error:', error);
        onError(error);
      }
    });

    this.stompClient.activate();
  }

  disconnect() {
    if (this.stompClient && this.connected) {
      Object.values(this.subscriptions).forEach(sub => sub.unsubscribe());
      this.subscriptions = {};
      this.stompClient.deactivate();
      this.connected = false;
    }
  }

  subscribeToUser(callback) {
    if (this.stompClient && this.connected) {
      const subscription = this.stompClient.subscribe('/user/queue/messages', (message) => {
        callback(JSON.parse(message.body));
      });
      this.subscriptions['user'] = subscription;
    }
  }

  subscribeToRoom(roomCode, callback) {
    if (this.stompClient && this.connected) {
      const subscription = this.stompClient.subscribe(`/topic/room/${roomCode}`, (message) => {
        callback(JSON.parse(message.body));
      });
      this.subscriptions[`room-${roomCode}`] = subscription;
    }
  }

  unsubscribeFromRoom(roomCode) {
    const key = `room-${roomCode}`;
    if (this.subscriptions[key]) {
      this.subscriptions[key].unsubscribe();
      delete this.subscriptions[key];
    }
  }

  send(destination, data) {
    if (this.stompClient && this.connected) {
      this.stompClient.publish({
        destination: destination,
        body: JSON.stringify(data)
      });
    }
  }

  createRoom(playerName) {
    this.send('/app/create-room', {
      type: 'CREATE_ROOM',
      playerName
    });
  }

  joinRoom(roomCode, playerName) {
    this.send('/app/join-room', {
      type: 'JOIN_ROOM',
      roomCode: roomCode.toUpperCase(),
      playerName
    });
  }

  leaveRoom(roomCode, playerId) {
    this.send('/app/leave-room', {
      type: 'LEAVE_ROOM',
      roomCode,
      playerId
    });
  }

  startGame(roomCode, playerId) {
    this.send('/app/start-game', {
      type: 'START_GAME',
      roomCode,
      playerId
    });
  }

  submitAnswers(roomCode, playerId, answers) {
    this.send('/app/submit-answers', {
      type: 'SUBMIT_ANSWERS',
      roomCode,
      playerId,
      answers
    });
  }

  submitScores(roomCode, playerId, categoryScores) {
    this.send('/app/submit-scores', {
      type: 'SUBMIT_SCORES',
      roomCode,
      playerId,
      categoryScores
    });
  }

  isConnected() {
    return this.connected;
  }
}

export default new WebSocketService();