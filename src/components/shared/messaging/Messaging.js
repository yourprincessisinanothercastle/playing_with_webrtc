export default class Messaging {
  constructor() {
    this.connectedPlayers = [];
    this.playerInputQueues = {
      // playeri: {reliableQueue: rq, unreliableQueue: uq}
    };
    this.playerChannels = {
      // player1: {reliable: c1, unreliable: c2}
    }
  }

  addPlayer(id, reliableChannel, unreliableChannel) {
    this.connectedPlayers.push(id);
    this.playerInputQueues[id] = {
      reliable: [],
      unreliable: []
    };

    this.playerChannels[id] = {
      reliable: reliableChannel,
      unreliable: unreliableChannel
    }

    reliableChannel.onmessage = (message) => {
      this.addMessage(id, 'reliable', message);
    };

    unreliableChannel.onmessage = (message) => {
      this.addMessage(id, 'unreliable', message);
    };
  }

  rmPlayer(id) {
    this.connectedPlayers = this.connectedPlayers.filter(playerId => playerId !== id)
    delete this.playerInputQueues[id];
    delete this.playerChannels[id];
  }

  addMessage(id, channel, message) {
    // i guess its safe to call this async..?
    this.playerInputQueues[id][channel].push(message.data)
  }

  * getMessages() {
    let playerQueues = Object.keys(this.playerInputQueues);
    for (let id in this.playerInputQueues) {
      while (this.playerInputQueues[id]['reliable'].length > 0) {
        yield {
          client_id: id,
          message: this.playerInputQueues[id]['reliable'].shift()
        };
      }

      while (this.playerInputQueues[id]['unreliable'].length > 0) {
        yield {
          client_id: id,
          message: this.playerInputQueues[id]['unreliable'].shift()
        };
      }
      return;
    }
  }

  broadcastUnreliable(msg) {
    for (let id in this.playerChannels) {
      this.sendMessageUnreliable(id, msg);
    }
  }


  broadcastReliable(msg) {
    for (let id in this.playerChannels) {
      this.sendMessageReliable(id, msg);
    }
  }

  sendMessageReliable(toID, message){
    this.sendMessage(toID, message, true);
  }

  sendMessageUnreliable(toID, message){
    this.sendMessage(toID, message, false);
  }

  sendMessage(toID, message, isReliable){
    let channel = isReliable ? 'reliable' : 'unreliable';
    this.playerChannels[toID][channel].send(JSON.stringify(message));
  }
}


