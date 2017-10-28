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
    let config = {
      "iceServers": [{
        "url": "stun:stun.l.google.com:19302"
      }]
    };

    this._sendMessage = function (target, message) { // not working as arrow
      signaling.sendMessage(target, message);
    };

    this.target = target;

    this.peerConnection = new RTCPeerConnection(config);
    this.peerConnection.onicecandidate = (event) => {
      // if we find a new ice for us, do something to send it to the peer
      if (!this.peerConnection || !this.peerConnection.remoteDescription.type) return;
      if (!event || !event.candidate) return;
      console.log('sending ice candidate:', event.candidate)
      this.sendIceCandidate(event.candidate);
    };
    this.channel = new DataChannel(this.peerConnection, channelOpenedCallback);
  }

  _sendSignalingMessage(message) {
    console.log('sending', message)
    this._sendMessage(this.target, message);
  }

  sendOffer() {
    // we are the client, sending an offer
    this.channel.createOffer()
      .then(offer => {
        this._sendSignalingMessage(offer);
      });
  }

  answerOffer(offer) {
    // we are the server, which should not have a datachannel here - so we create one
    this.channel.processOffer(offer)
      .then(answer => {
        this._sendSignalingMessage(answer);
      });
  }

  sendIceCandidate(candidate) {
    console.log('sending ice candidate')
    this._sendSignalingMessage({
      type: 'iceCandidate',
      candidate
    });
  }

  addIceCandidate(candidate) {
    // add a remote ice
    console.log('got ice candidate')
    this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
  }
}
