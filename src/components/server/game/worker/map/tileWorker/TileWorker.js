import Tile from './Tile';
import constants from '../../../../../shared/constants';

let messagePort;

self.onmessage = (msg) => {
  if (msg.data.type === constants.MAIN_WORKER_MESSAGETYPES.INIT) {
    messagePort = msg.data.port;

    messagePort.onmessage = (msg) => {
      const {
        x, y, seed, freq, tileSize,
      } = msg.data;

      const tile = Tile.genTile(x, y, seed, freq, tileSize);
      messagePort.postMessage({
        x,
        y,
        heightLayer: tile.heightLayer,
        tempLayer: tile.tempLayer,
      });
    };
  }
  else {
    console.log('tileworker got undefined message');
  }
};
