import constants from '../constants'
import messaging from '../messaging/instance'

class Message{
    /**
     * 
     * @param {*} payload - object 
     * @param {*} target - client id, null to broadcast
     */
    constructor(payload, reliable=false, targets=null) {
        this.payload = payload
        this.target = target
        this.reliable = reliable
    }

    send() {
        for(target in this.targets){
            messaging.sendMessage(target, this.payload, this.reliable)
        }
    }
}