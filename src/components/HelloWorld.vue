<template>
  <div>
    <textarea v-model="game_name"></textarea>
    <button @click="openGame()">send</button>
  </div>
</template>

<script>
  import RTC from './webRTC/rtcConnection'
  import Signaling from './signaling/Signaling.js'

  export default {
    data() {
      return {
        signaling: new Signaling(this.onConnect, this.onDisconnect, this.onGames, this.onMessage),
        connections: {},
        game_name: ''
      }
    },

    methods: {
      onConnect() {},
      onDisconnect() {},
      onGames() {},
      openGame() {
        this.signaling.openGame(this.game_name);
        this.game_name = '';
      },

      onMessage(msg) {
        console.log('got a message!', msg);
        if (msg['data']['type'] === "offer") {
          console.log('processing offer')        
          this.connections[msg['from']] = new RTC(this.signaling, msg['from'])
          this.connections[msg['from']].answerOffer(msg['data'])
        } else if (msg['data']['type'] === 'iceCandidate'){
          console.log('got ice')
          this.connections[msg['from']].addIceCandidate(msg['data']['candidate'])
        
        } else {
          console.log('unknown msg', msg)
        }
      }
    },
    computed: {},
  }

</script>
