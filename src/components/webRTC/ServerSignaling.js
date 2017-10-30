import socketio from 'socket.io-client';
import Signaling from './Signaling';
import RTC from './rtcConnection';

const NEEDED_CHANNELS = 2;

class ServerSignaling extends Signaling{
  constructor(host, onConnect, onDisconnect, onGames, onGameOpened, onNewPlayer) {
    super(host, onConnect, onDisconnect);

    this.socket.on('games', (data) => {
      onGames(data);
    });

    this.socket.on('game_open', data => {
      onGameOpened();
    });

    this.socket.on('message', (msg) => {
      switch (msg['data']['type']) {
        case "offer":
          this.connections[msg['from']] = new RTC(this, msg['from'], this.callbackIfComplete(msg['from'], onNewPlayer));
          this.connections[msg['from']].answerOffer(msg['data']);

          break;
        case "iceCandidate":
          this.connections[msg['from']].addIceCandidate(msg['data']['candidate']);
          break;
      }
    });
  }

  callbackIfComplete(client_id, resolveCallback) {
    return (event) => {
      console.log('got channel')
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

export default ServerSignaling
