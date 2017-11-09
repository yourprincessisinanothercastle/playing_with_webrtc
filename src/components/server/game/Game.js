import messaging from './messaging/instance';
import GameMap from './map/Map';

import Worker from 'worker-loader!./worker/GameWorker.js';


export default class Game{
    constructor(seed){
        this.map = new GameMap(seed);
        this.players = {};

        this.worker = new Worker();
        this.worker.onmessage = this.processWorkerMessage
    }

    processWorkerMessage() {
        console.log('msg from worker!')
    }

    addPlayer(client_id, reliableChannel, unreliableChannel){
        messaging.addPlayer(client_id, reliableChannel, unreliableChannel)
    }
}