export default class LocalMessageQueue{
    constructor(){
        this.queue = [];
    }

  push(message){
    this.queue.push(message);
  }

  /**
   * yields all messages that are currently in the queue
   */
  * getMessages() {
      for(let element of this.queue){
        yield element
      }
  }

    
}