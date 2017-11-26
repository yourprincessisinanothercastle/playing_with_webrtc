import GameLoop from './GameLoop';
import constants from '../../../shared/constants';

const game = new GameLoop();

self.onmessage = (msg) => {
  console.log('got msg', msg.data)
  if (msg.data['type'] === constants.MAIN_WORKER_MESSAGETYPES.INIT) {
    game.init(msg.data['seed'], msg.data['tileWorkerPort']);
  } else {
    game.mainEventInputQueue.push(msg);
  }
}
