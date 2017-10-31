/*
 http://www.justgoscha.com/programming/2014/03/07/simple-webrtc-datachannel-establishment-for-dummies.html


            A              |    signaling    |          B                 
 --------------------------|:---------------:|----------------------------
 create peerconnection     |                 |                            
 create datachannel        |                 |                            
 create offer              |                 |                            
 (callback) offer created  |                 |                            
 setLocalDescription(offer)|                 |                            
                           |---- offer ----> |                            
                           |                 |create peerconnection       
                           |                 |create datachannel          
                           |                 |setRemoteDescription(offer) 
                           |                 |create answer               
                           |                 |(callback) answer created   
                           |                 |setRemoteDescription(answer)
                           |<---- answer ----|                            
 processing Answer         |                 |                            
                           |                 |(event) onicecandidate      
                           |<-ice candidate--|                            
                           |<-ice candidate--|                            
                           |<-ice candidate--|                            
 processIce                |                 |                            
                           |                 |                            
 (event) onicecandidate    |                 |                            
                           |--ice candidate->|                            
                           |--ice candidate->|                            
                           |--ice candidate->|                            
                           |                 |processIce                  
                           |                 |                            
 datachannel opens         |                 |datachannel opens  

 */

let config = {
  "iceServers": [{
    "urls": ["stun:stun.l.google.com:19302"]
  }]
};

export default class RTCConnection {

  constructor(signaling, target, onDatachannelOpen = () => {}, onDisconnect = () => {}) {
    this._sendMessage = function (message) { // not working as arrow
      signaling.sendMessage(target, message);
    };

    this.onDatachannelOpen = (event) => onDatachannelOpen(event);

    this.target = target;
    this.dataChannels = {}; // established channels

    this.peerConnection = new RTCPeerConnection(config);
    this.peerConnection.ondatachannel = (event) => {
      this.onDataChannel(event);
    }; // remote peer adds datachannel
    this.peerConnection.onicecandidate = (event) => {
      this.onIceCandidate(event);
    };

    this.peerConnection.oniceconnectionstatechange = (event) => {
      console.log('connectionstate changed', event);
      console.log(this.peerConnection.iceConnectionState);
      switch (this.peerConnection.iceConnectionState) {
        case "connected":
          console.log('new connection');
          break;
        case "disconnected":
        case "closed":
        case "failed":
          onDisconnect(target)
          console.error('connection failed', event)
          break;
      }
    }
  }

  close(){
    this.peerConnection.close();
  }

  getChannels() {
    return Promise.all(this.datachannelPromises);
  }

  onIceCandidate(event) {
    // if we find a new ice for us, do something to send it to the peer
    if (!event || !event.candidate) return;
    this.sendIceCandidate(event.candidate);
  }

  onDataChannel(event) {
    // other side opens datachannel
    event.channel.onopen = (event) => {
      this.dataChannels[event.target.label] = event.target;
      console.log('datachannel!', this.dataChannels)
      this.onDatachannelOpen(event)
    };
  }

  addDataChannel(label, options = {}) {
    // open a datachannel
    let dc = this.peerConnection.createDataChannel(label, options);
    dc.onopen = (event) => {
      console.log('datachannel!', this.dataChannels)
      this.dataChannels[event.currentTarget.label] = event.currentTarget;
      this.onDatachannelOpen(event)
    };
    return dc;
  }

  processAnswer(answer) {
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  }

  /* signaling stuff */
  sendOffer() {
    // we are the client, sending an offer
    return this._createOffer()
      .then(offer => {
        this._sendMessage(offer);
      });
  }

  answerOffer(offer) {
    // we are the server, which should not have a datachannel here - so we create one
    this._processOffer(offer)
      .then(answer => {
        this._sendMessage(answer);
      });
  }

  sendIceCandidate(candidate) {
    this._sendMessage({
      type: 'iceCandidate',
      candidate
    });
  }
  /* /signaling stuff */

  addIceCandidate(candidate) {
    // add a remote ice
    this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  }

  _createOffer() {
    return this.peerConnection.createOffer()
      .then(offer => {
        this.peerConnection.setLocalDescription(offer);
        return offer; // (4)
      }).catch(error => {
        console.error('error creating offer', error)
      });
  }

  _processOffer(offer) {
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
}
