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
            this.callbackIfComplete(clientId, (channels) => this.onNewPeer(channels)), (event) => this.onPeerDisconnect(event));
          this.connections[clientId].answerOffer(msg['data']);
          break;

        case "iceCandidate":
          this.connections[clientId].addIceCandidate(msg['data']['candidate']);
          break;
      }
    });
  }

  onNewPeer(channels) {
    console.log('player joined');
    this.onNewPlayer(channels);
  }

  onPeerDisconnect(clientId) {
    console.log('player quit');
    this.connections[clientId].close();
    delete this.connections[clientId];
    this.onPlayerQuit();
  }

  callbackIfComplete(client_id, resolveCallback) {
    return (event) => {
      console.log('got channel');
      if (Object.keys(this.connections[client_id].dataChannels).length == NEEDED_CHANNELS) {
        console.log('done! resolving with', this.connections[client_id].dataChannels);
        resolveCallback(this.connections[client_id].dataChannels);
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
