import socketio from 'socket.io-client';
import RTC from './rtcConnection';

const NEEDED_CHANNELS = 2;

class Signaling {
  constructor(host, onConnect, onDisconnect) {
    this.socket = socketio(host);
    this.onConnect = onConnect;
    this.onDisconnect = onDisconnect;

    this.connections = {};

    this.socket.on('connect', () => {
      onConnect();
    });

    this.socket.on('disconnect', () => {
      onDisconnect();
    });
   
  };

  sendMessage(to, data) {
    console.log('sending', data, to)
    this.socket.emit('message', data, to)
  }
}

export default Signaling
