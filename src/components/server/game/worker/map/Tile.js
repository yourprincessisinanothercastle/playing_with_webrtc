import SimplexNoise from 'simplex-noise';
import Alea from 'alea';

export default class Tile {
  constructor(x, y, freq, seed = 123, tilesize = 32) {
    this.tilesize = tilesize;
    this.x = x;
    this.y = y;

    this.freq = freq;
    this.seed = seed;

    this.heightTile = this.genTile(this.seed + '1');
    this.tempTile = this.genTile(this.seed);
  }

  genTile(seed) {
    console.log('generating tile', this.x, this.y)
    let data = new Uint8Array(this.tilesize * this.tilesize);

    let numberGenerator = new Alea(seed);
    var simplex = new SimplexNoise(numberGenerator);

    for (let local_y = 0; local_y < this.tilesize; local_y++) {
      for (let local_x = 0; local_x < this.tilesize; local_x++) {
        let value = simplex.noise2D(
          (local_x + this.tilesize * this.x) / this.freq,
          (local_y + this.tilesize * this.y) / this.freq);
        let scaledValue = this.scaleUp(value);
        data[local_y * this.tilesize + local_x] = scaledValue;
      }
    }
    return data;
  }

  scaleUp(value, steps = 8) {
    return parseInt(Math.abs(value * steps));
  }
}
