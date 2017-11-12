/**
 * supposed to run on a webworker
 */
import Loop from 'gameloop';
import constants from '../../../shared/constants';
import GameMap from './map/Map';


export default class Game {
  constructor() {
    self.onmessage = this.onMessage;
    // queue to add new players etc... (events from outside)
    this.mainEventInputQueue = [];
    this.seed = '';

    this.map = null;
    this.loop = null;
  }

  init(seed) {
    console.log('initializing gameworker...')
    this.seed = seed;

    this.loop = new Loop({
      fps: 1
    });

    this.loop.on('update', (delta, time) => {
      this.update(delta, time);
    });

    this.map = new GameMap(seed);
    this.map.getTileImage(0, 0)
      .then((imageData) => {
        self.postMessage({
          type: constants.WORKER_MAIN_MESSAGETYPES.TILE,
          x: 0, y: 0,
          data: imageData
        });
      });
    this.start();
  }

  processMessages() {
    while (this.mainEventInputQueue.length > 0) {
      msg = this.mainEventInputQueue.shift();
      switch (msg.data['type']) {
        case constants.MAIN_WORKER_MESSAGETYPES.START:
          this.start()

        default:
          console.log('worker got unknown message', msg.data)
          break;
      }
    }
  }

  sendTileImageToMain() {
    self.postMessage({
      'tile': this.map.getTileImage(0, 0)
    })
  }


  start() {
    this.loop.start();
  }

  stop() {
    this.loop.stop();
  }

  update(delta, time) {
    this.processMessages();
  }

  draw(renderer, dt) {}

}
