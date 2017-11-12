/**
 * "low level" webrtc messaging
 * keeps track of players and their channels,
 * sends and gets messages
 * 
 */
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
      this._addMessage(id, 'reliable', message);
    };

    unreliableChannel.onmessage = (message) => {
      this._addMessage(id, 'unreliable', message);
    };
  }

  rmPlayer(id) {
    this.connectedPlayers = this.connectedPlayers.filter(playerId => playerId !== id)
    delete this.playerInputQueues[id];
    delete this.playerChannels[id];
  }

  /**
   * add a message to the queue
   * 
   * @param {*} id 
   * @param {*} channel 
   * @param {*} message 
   */
  _addMessage(id, channel, message) {
    this.playerInputQueues[id][channel].push(message.data)
  }

  /**
   * yields all messages that are currently in the queue
   * todo: what happens if a message is put in here while we are processing?
   */
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

  multicastReliable(toIDs, message){
    toIDs.forEach(id => {
      sendMessageReliable(id, message)
    });
  }

  multicastUnreliable(toIds, message){
    toIDs.forEach(id => {
      sendMessageUnreliable(id, message)
    });
  }

  sendMessageReliable(toID, message){
    this.playerChannels[toID]['reliable'].send(JSON.stringify(message));
  }

  sendMessageUnreliable(toID, message){
    this.playerChannels[toID]['unreliable'].send(JSON.stringify(message));
  }

}


