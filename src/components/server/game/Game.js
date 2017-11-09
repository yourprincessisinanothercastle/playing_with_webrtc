import messaging from '../../shared/messaging/instance';
import GameMap from './map/Map';
import constants from '../../shared/constants';
import Worker from 'worker-loader!./worker/GameWorker.js';


export default class Game{
    constructor(seed){
        this.map = new GameMap(seed);
        this.players = {};

        this.worker = new Worker();
        this.worker.onmessage = this.processWorkerMessage;
    }

    processWorkerMessage(msg) {
        switch(msg.data.type) {
            case constants.WORKERMESSAGETYPES.UNICAST:
                break;
            case constants.WORKERMESSAGETYPES.MULTICAST:
                break;
            case constants.WORKERMESSAGETYPES.BROADCAST:
                messaging.broadcastReliable(msg.data)
                break;
            default:
                console.log('unknown message', msg.data)
        }

    }

    addPlayer(client_id, reliableChannel, unreliableChannel){
        messaging.addPlayer(client_id, reliableChannel, unreliableChannel)
    }
}