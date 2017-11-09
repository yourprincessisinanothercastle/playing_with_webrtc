/**
 * supposed to run on a webworker
 */

import Loop from 'gameloop';

export default class GameLoop {
  constructor() {
    
    // queue to add new players etc... (events from outside)
    let mainEventInputQueue = [];

    this.loop = new Loop({fps: 1});

    this.loop.on('update', (delta, time) => {this.update(delta, time)});
    
    this.loop.on('draw', (renderer, dt) => {this.draw(renderer, dt)});
  }


  start() {
    this.loop.start();
  }
  stop() {
    this.loop.stop();
  }

  update(delta, time, keys = false /*dev only*/ ) {
    self.postMessage({type: 'msg-broadcast', data: 'nop'})
    //console.log('done for this loop!')
  }

  draw(renderer, dt) {
      
  }
}
