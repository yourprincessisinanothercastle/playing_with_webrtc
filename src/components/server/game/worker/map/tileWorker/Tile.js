import SimplexNoise from 'simplex-noise';
import Alea from 'alea';

export default class TileGenerator {
  static genTile(x, y, freq, seed, tileSize) {
    console.log('creating tile', x, y);
    const heightLayer = TileGenerator._genLayer(x, y, freq, seed + '1', tileSize);
    const tempLayer = TileGenerator._genLayer(x, y, freq, seed + '0', tileSize);
    return {
      heightLayer, tempLayer,
    };
  }

  static _genLayer(x, y, freq, seed, tileSize) {
    const data = new Uint8Array(tileSize * tileSize);
    const numberGenerator = new Alea(seed);
    const simplex = new SimplexNoise(numberGenerator);

    for (let localY = 0; localY < tileSize; localY = localY + 1) {
      for (let localX = 0; localX < tileSize; localX = localX + 1) {
        const value = simplex.noise2D(
          (localX + tileSize * x) / freq,
          (localY + tileSize * y) / freq);
        data[localY * tileSize + localX] = this.scaleUp(value);
      }
    }
    return data;
  }

  static scaleUp(value, steps = 8) {
    return parseInt(Math.abs(value * steps));
  }
}
