
import TileWorker from 'worker-loader!./TileWorker.js';

export default class Map {
  constructor() {
    this.cache = {};
    this.imageCache = {};
    this.seed = undefined;
    this.freq = 500;
  }

  setSeed(seed) {
    this.seed = seed;
  }

  getTile(x, y) {
    return new Promise((resolve, reject) => {
      let cache = this.cache;
      if (cache[x] && cache[x][y]) {
        resolve(cache[x][y]);
      } else {
        if (!cache[x]) cache[x] = {};
        return this._createTile(x, y, this.freq, this.seed)
          .then(({heightTile, tempTile}) => {
            cache[x][y] = {heightTile, tempTile};
            resolve(cache[x][y]);
          });
      }
    });
  }

  _createTile(x, y, freq, seed) {
    return new Promise((resolve, reject) => {
      let tileworker = new TileWorker();
      tileworker.postMessage({x, y, freq, seed});
      tileworker.onmessage = (msg) => {
        console.log('got tile', x, y)
        resolve(msg.data);
      };
    });
  }

  getTileImage(x, y) {
    return this.getTile(x, y).then(data => {
      return this._genTileImage(data)
    })
  }

  _genTileImage({heightTile, tempTile}) {
    let imageData = new Uint8ClampedArray(this.tilesize * this.tilesize * 4);
    for (let i = 0; i <= this.tilesize * this.tilesize; i++) {
      imageData[i * 4] = tempTile[i] / 8 * 255; /* green */
      imageData[i * 4 + 1] = heightTile[i] / 8 * 255; // g
      imageData[i * 4 + 2] = heightTile[i] / 8 * 255; // b
      imageData[i * 4 + 3] = 255;
    }
    return imageData;
  }
}
