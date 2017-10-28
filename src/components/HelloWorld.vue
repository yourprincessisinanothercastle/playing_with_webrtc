<template>
  <div>
    <textarea v-model="game_name"></textarea>
    <button @click="openGame()">send</button>
  </div>
</template>

<script>
  import Signaling from './webRTC/Signaling.js'

  export default {
    data() {
      return {
        signaling: new Signaling(this.onConnect, this.onDisconnect, this.onGames),
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
    },
    computed: {},
  }

</script>
