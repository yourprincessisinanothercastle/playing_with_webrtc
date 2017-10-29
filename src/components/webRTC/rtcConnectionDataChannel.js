class DataChannel {

  constructor(peerConnection, isReliable, openCallback) {
    console.log('new channel on', peerConnection)
    let datachannelOptions = {};

    if (!isReliable) {
      datachannelOptions = {
        maxRetransmits: false
      };
    }

    let id = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
    this.dataChannel = peerConnection.createDataChannel(id, datachannelOptions); // (2)

    this.dataChannel.onmessage = (e) => {
      this.processMessage(e);
    };

    this.dataChannel.onclose = function () {
      console.log("------- DC closed! -------");
    };

    this.dataChannel.onerror = function () {
      console.log("DC ERROR!!!");
    };

    this.dataChannel.onopen = (e) => {
      console.log('opened!');
      openCallback(e);
    }
    
  }

  processMessage(msg) {
    console.log('process message', msg);
  }

  channelOpened(e) {
    console.log("------ DATACHANNEL OPENED ------");
  }

  channelClosed(e) {
    console.log("------ DATACHANNEL CLOSED ------");
  }

  channelError(e) {
    console.log("------ DATACHANNEL ERROR ------");
  }
}
export default DataChannel;
