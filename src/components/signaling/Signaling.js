import socketio from 'socket.io-client';

class Signaling {
  constructor(onConnected, onDisconnected, onGames, onMessage) {
    this.socket = socketio('http://localhost:5000');

    this.socket.on('connect', () => {
      console.log('calling onconnect');
      onConnected();
    });

    this.socket.on('games', (data) => {
      onGames(data);
    });

    this.socket.on('disconnect', () => {
      onDisconnected()
    });

    this.socket.on('message', (msg) => {
      onMessage(msg)
    })

  }

  openGame(name){
    this.socket.emit('open_game', {game_name: name})
  }

  getGames() {
    this.socket.emit('get_games')
  }

  sendMessage(to, data) {
    this.socket.emit('message', data, to)
  }
}

export default Signaling
