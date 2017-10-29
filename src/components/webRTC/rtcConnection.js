import DataChannel from './rtcConnectionDataChannel';
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

export default class RTCConnection {

  constructor(signaling, target, channelOpenedCallback) {
    this.channelOpenedCallback = channelOpenedCallback;
    let config = {
      "iceServers": [{
        "urls": ["stun:stun.l.google.com:19302"]
      }]
    };

    this._sendMessage = function (message) { // not working as arrow
      signaling.sendMessage(target, message);
    };

    this.target = target;

    this.peerConnection = new RTCPeerConnection(config);
    Promise.all([this.addDataChannel(), this.addDataChannel()])
      .then(([reliable, unreliable]) => {
        this.reliable = reliable;
        this.unreliable = unreliable;
      })

    this.peerConnection.ondatachannel = this.onDataChannel; // remote peer adds datachannel

    this.peerConnection.onicecandidate = (event) => {
      console.log('new ice candidate!')
      // if we find a new ice for us, do something to send it to the peer
      if (!this.peerConnection || !this.peerConnection.remoteDescription.type) return;
      if (!event || !event.candidate) return;
      this.sendIceCandidate(event.candidate);
    };

    /*this.addDataChannel()
      .then((event) => {
        console.log(event);
        this.channelOpenedCallback(this.dataChannel);
      })*/
  }

  onDataChannel(event) {
    event.channel.onopen = this.channelOpenedCallback;
  }

  addDataChannel(isReliable) {
    return new Promise((resolve, reject) => {
      console.log('adding new datachannel')
      new DataChannel(this.peerConnection, isReliable, resolve);
    });
  }

  processAnswer(answer) {
    this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    console.log("------ PROCESSED ANSWER ------");
  }

  sendOffer() {
    // we are the client, sending an offer
    return this._createOffer({ offerToReceiveVideo: 1, offerToReceiveAudio: 1 })
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
