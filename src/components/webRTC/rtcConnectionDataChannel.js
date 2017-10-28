class DataChannel {

  constructor(peerConnection) {
    let datachannelOptions = {
      reliable: false
    };

    this.peerConnection = peerConnection;
    this.dataChannel = this.peerConnection.createDataChannel("datachannel", datachannelOptions); // (2)

    this.dataChannel.onmessage = (e) => {
      this.processMessage(e);
    };

    this.dataChannel.onclose = function () {
      console.log("------- DC closed! -------");
    };

    this.dataChannel.onerror = function () {
      console.log("DC ERROR!!!");
    };
  }


  createOffer() { // (3), server
    return this.peerConnection.createOffer()
      .then(offer => {
        this.peerConnection.setLocalDescription(offer);
        return offer; // (4)
      }).catch(error => {
        console.error('error creating offer', error)
      })
  }

  processOffer(offer) {
    this.peerConnection
      .setRemoteDescription(new RTCSessionDescription(offer))
      .catch(console.error)

    return this.peerConnection
      .createAnswer()
      .then((answer) => {
        this.peerConnection.setLocalDescription(answer);
        return answer;
      });
  }

  get id() {
    return this.dataChannel.id;
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

  processAnswer(answer) {
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    console.log("------ PROCESSED ANSWER ------");
  };
}
export default DataChannel;
