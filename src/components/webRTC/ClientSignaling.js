import socketio from 'socket.io-client';
import Signaling from './Signaling';

import RTC from './rtcConnection';

const NEEDED_CHANNELS = 2;

class ClientSignaling extends Signaling {
  constructor(host, onConnect, onDisconnect, onGames) {
    super(host, onConnect, onDisconnect);

    this.socket.on('games', (data) => {
      console.log('got games')
      onGames(data);
    });
    
    this.socket.on('game_open', data => {
      console.log('game open')
      onGameOpened();
    });

    this.socket.on('message', (msg) => {
      switch (msg['data']['type']) {
        case "answer":
          this.connections[msg['from']].processAnswer(msg['data']);
          break;

        case 'iceCandidate':
          this.connections[msg['from']].addIceCandidate(msg['data']['candidate']);
          break;
      }
    });
  }

  resolveIfComplete(server_id, resolveCallback) {
    return (event) => {
      console.log('got channel')
      if (Object.keys(this.connections[server_id].dataChannels).length == NEEDED_CHANNELS) {
        console.log('done! resolving with', this.connections[server_id].dataChannels);
        resolveCallback(this.connections[server_id].dataChannels);
      }
    };
  }

  joinGame(server_id) {
    return new Promise((resolve, reject) => {
      let channels = {};

      this.connections[server_id] = new RTC(this, server_id, this.resolveIfComplete(server_id, resolve));

      this.connections[server_id].addDataChannel("reliable", {});
      this.connections[server_id].addDataChannel("unreliable", {
        maxRetransmits: 0,
        ordered: false
      });
      this.connections[server_id].sendOffer();
    });
  }
}

export default ClientSignaling
