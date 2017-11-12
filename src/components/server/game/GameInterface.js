import messaging from '../../shared/messaging/instance';
import constants from '../../shared/constants';

import Worker from 'worker-loader!./worker/GameWorker.js';
/**
 * the interface betrween the webworker-gameloop and messaging
 */
export default class Game {
  constructor(seed, onAddTile) {
    this.players = {};

    this.onAddTile = onAddTile;

    this.worker = new Worker();
    this.worker.onmessage = this.processWorkerMessage;
    this.worker.postMessage({
      type: constants.MAIN_WORKER_MESSAGETYPES.INIT,
      seed
    });
  }

  processWorkerMessage(msg) {
    switch (msg.data.type) {
      case constants.WORKER_MAIN_MESSAGETYPES.TILE:
        console.log('got tile', msg.data)
        this.onAddTile({
          data: msg.data.data,
          x: msg.data.x,
          y: msg.data.y
        })
        break;

      default:
        console.error('unknown message', msg.data)
    }
  }

  addPlayer(client_id, reliableChannel, unreliableChannel) {
    messaging.addPlayer(client_id, reliableChannel, unreliableChannel)
  }
}
