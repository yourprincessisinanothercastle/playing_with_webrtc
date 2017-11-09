import Tile from './Tile';

export default class Map {
  constructor(seed = Math.random()) {
    this.cache = {};
    this.imageCache = {};
    this.seed = seed;

    this.freq = 500;
  }

  setSeed(seed) {
    console.log('setting seed', seed)
    this.seed = seed;
  }

  getTile(x, y) {
    let cache = this.cache;
    if (cache[x] && cache[x][y]) {
      return cache[x][y];
    } else {
      if (!cache[x]) cache[x] = {};
      let tile = new Tile(x, y, this.freq, this.seed);
      cache[x][y] = tile;
      return cache[x][y];
    }
  }

  getTileImage(x, y) {
    return this.getTile(x, y).getImage();
  }
}
