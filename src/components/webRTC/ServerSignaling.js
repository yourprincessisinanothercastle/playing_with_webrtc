import socketio from 'socket.io-client';
import Signaling from './Signaling';
import RTC from './rtcConnection';

const NEEDED_CHANNELS = 2;

class ServerSignaling extends Signaling {
  constructor(host, onConnect, onDisconnect, onGames, onGameOpened, onNewPlayer = () => {}, onPlayerQuit = () => {}) {
    super(host, onConnect, onDisconnect);
    this.onNewPlayer = onNewPlayer;
    this.onPlayerQuit = onPlayerQuit;

    this.socket.on('games', (data) => {
      onGames(data);
    });

    this.socket.on('game_open', data => {
      onGameOpened();
    });

    this.socket.on('message', (msg) => {
      let clientId = msg['from'];

      switch (msg['data']['type']) {
        case "offer":
          this.connections[clientId] = new RTC(
            this,
            clientId,
            this.callbackIfComplete(clientId),
            (clientId) => this.onPeerDisconnect(clientId));
          this.connections[clientId].answerOffer(msg['data']);
          break;

        case "iceCandidate":
          this.connections[clientId].addIceCandidate(msg['data']['candidate']);
          break;
      }
    });
  }

  onPeerDisconnect(clientId) {
    if (this.connections[clientId]) {
      console.log('player quit', clientId);
      console.log(this.connections.clientId);
      this.connections[clientId].close();
      delete this.connections[clientId];
      this.onPlayerQuit();
    }
  }

  callbackIfComplete(client_id) {
    return (event) => {
      console.log('got channel');
      if (Object.keys(this.connections[client_id].dataChannels).length == NEEDED_CHANNELS) {
        console.log('done! resolving with', this.connections[client_id].dataChannels);
        
        this.onNewPlayer(client_id, this.connections[client_id].dataChannels);
      }
    };
  }

  openGame(name) {
    this.socket.emit('open_game', {
      game_name: name
    });
  }

  getGames() {
    this.socket.emit('get_games')
  }
}

export default ServerSignaling;
