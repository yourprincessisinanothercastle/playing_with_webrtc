import constants from '../../../../shared/constants';

export default class Map {
  constructor(seed, tileworkerMessagePort) {
    this.cache = {};
    this.seed = seed;
    this.freq = 500;

    this.tileWorkerPort = tileworkerMessagePort;
    this.tileWorkerPort.onmessage = (msg) => {
      return this.onTileWorkerMessage(msg);
    };
    this.tileWorkerTasks = {};
  }

  getTile(x, y) {
    return new Promise((resolve, reject) => {
      const cache = this.cache;
      if (cache[x] && cache[x][y]) {
        resolve(cache[x][y]);
      } else {
        if (!cache[x]) cache[x] = {};

        return this._addTileWorkerTask(x, y, this.freq, this.seed, constants.TILESIZE)
          .then(layers => {
            cache[x][y] = layers;
            resolve(cache[x][y]);
          });
      }
    });
  }

  _addTileWorkerTask(x, y, freq, seed, tileSize) {
    return new Promise((resolve, reject) => {
      // resolves in onTileWorkerMessage when tile is processed
      if (!this.tileWorkerTasks[x]) this.tileWorkerTasks[x] = {};
      this.tileWorkerTasks[x][y] = {
        resolve,
        reject,
      };
      console.log('added task');
      console.log('current tasks:', this.tileWorkerTasks);
      this.tileWorkerPort.postMessage({
        x, y, freq, seed, tileSize,
      });
    });
  }

  onTileWorkerMessage({data}) {
    console.log('got tile', data.x, data.y, 'from tileworker');
    const {
      x, y, heightLayer, tempLayer,
    } = data;

    this.tileWorkerTasks[x][y].resolve({
      heightLayer,
      tempLayer,
    });

    delete this.tileWorkerTasks[x][y];
  }

  getTileImage(x, y) {
    return this.getTile(x, y)
      .then(tileLayers => {
        return Map._genTileImage(tileLayers);
      });
  }

  static _genTileImage(tileLayers) {
    const {
      heightLayer, tempLayer,
    } = tileLayers;

    console.log('creating iomage from', tileLayers, constants.TILESIZE);

    const imageData = new Uint8ClampedArray(constants.TILESIZE * constants.TILESIZE * 4);
    for (let i = 0; i <= constants.TILESIZE * constants.TILESIZE; i++) {
      imageData[i * 4] = tempLayer[i] / 8 * 255;
      /* green */
      imageData[i * 4 + 1] = heightLayer[i] / 8 * 255; // g
      imageData[i * 4 + 2] = heightLayer[i] / 8 * 255; // b
      imageData[i * 4 + 3] = 255;
    }
    return imageData;
  }
}
