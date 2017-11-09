import GameLoop from './GameLoop';


let gl = new GameLoop()

self.onmessage = (msg) => {
    console.log(msg)
}

gl.start()
