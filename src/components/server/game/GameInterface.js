import messaging from '../../shared/messaging/instance';
import constants from '../../shared/constants';

// we do this here because webkit doesnt support nested workers yet
import TileWorker from 'worker-loader!./worker/map/tileWorker/TileWorker.js';
import Worker from 'worker-loader!./worker/GameWorker.js';

/**
 * the interface between the webworker-gameloop and messaging
 */
export default class Game {
  constructor(seed, onAddTile = console.log) {
    this.players = {};
    this.onAddTile = (x, y, tileData) => {
      return onAddTile(x, y, tileData);
    };
    this.seed = seed;

    this.tileWorker = new TileWorker();
    this.worker = new Worker();

    this.worker.onmessage = (msg) => {
      return this.processWorkerMessage(msg);
    };

    this.setUpWorkerCommunication();
  }

  setUpWorkerCommunication() {
    const channel = new MessageChannel();

    this.tileWorker.postMessage({
      type: constants.MAIN_WORKER_MESSAGETYPES.INIT,
      port: channel.port1,
    }, [channel.port1]);

    this.worker.postMessage({
      type: constants.MAIN_WORKER_MESSAGETYPES.INIT,
      tileWorkerPort: channel.port2,
      seed: this.seed,
    }, [channel.port2]);

  }

  processWorkerMessage(msg) {
    if (constants.WORKER_MAIN_MESSAGETYPES.TILEIMAGE) {
      console.log('got tile', msg.data);
      this.onAddTile(msg.data.x, msg.data.y, msg.data.data);
    } else {
      console.error('unknown message', msg.data);
    }
  }

  addPlayer(client_id, reliableChannel, unreliableChannel) {
    messaging.addPlayer(client_id, reliableChannel, unreliableChannel)
  }
}
