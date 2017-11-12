import Tile from './Tile';

self.onmessage = (msg) => {
  console.log('tileworker got msg', msg.data)
  let {x, y, seed, freq} = msg.data;
  let tile = new Tile(x, y, seed, freq);
  self.postMessage({heightTile: tile.heightTile, tempTile: tile.tempTile});
}
