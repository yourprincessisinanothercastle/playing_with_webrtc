import socketio from 'socket.io-client';
import RTC from './rtcConnection';


class Signaling {
  constructor(onConnect, onDisconnect, onGames, onGameOpened) {
    this.socket = socketio('http://192.168.178.44:5000');
    this.onConnect = onConnect;
    this.onDisconnect = onDisconnect;
    this.onGames = onGames;
    this.onGameOpened = onGameOpened;
    this.setupEvents();
  };

  setupEvents() {
    this.socket.on('connect', () => {
      console.log('calling onconnect');
      this.onConnect();
    });

    this.socket.on('games', (data) => {
      this.onGames(data);
    });

    this.socket.on('game_open', data => {
      this.onGameOpened();
    });

    this.socket.on('disconnect', () => {
      this.onDisconnect();
    });

    this.connections = {};

    this.socket.on('message', (msg) => {
      console.log('got', msg)
      if (msg['data']['type'] === "offer") {
        /* server gets offers */
        this.connections[msg['from']] = new RTC(this, msg['from'], []);
        this.connections[msg['from']].answerOffer(msg['data']);

      } else if (msg['data']['type'] === "answer") {
        /* client gets answer */
        // todo: move processanswer to connection
        this.connections[msg['from']].processAnswer(msg['data']);

      } else if (msg['data']['type'] === 'iceCandidate') {
        this.connections[msg['from']].addIceCandidate(msg['data']['candidate']);

      } else {
        console.log('unknown msg', msg);
      }
    });
  }

  joinGame(server_id) {
    return new Promise((resolve, reject) => {
      this.connections[server_id] = new RTC(this, server_id, []);

      this.connections[server_id].addDataChannel("reliable", {});
      this.connections[server_id].addDataChannel("unreliable", {maxRetransmits: 0, ordered: false});
      
      this.connections[server_id].sendOffer();
    });
  }

  openGame(name) {
    this.socket.emit('open_game', {
      game_name: name
    });
  }

  getGames() {
    this.socket.emit('get_games')
  }

  sendMessage(to, data) {
    console.log('sending', data, to)
    this.socket.emit('message', data, to)
  }
}

export default Signaling
