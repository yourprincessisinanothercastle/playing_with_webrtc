<template>
  <div>
    <div class="section">
      <div class="container">
        <div class="columns">
          <div class="column">
            <div v-for="id in Object.keys(openGames)">
              <a class=button @click="publishOffer(openGames[id]['server'])"> join {{ id }} </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Signaling from '../webRTC/Signaling.js'

  export default {
    data() {
      return {
        openGames: {},
        signaling: new Signaling(this.onConnected, this.onDisconnected, this.onGames),
        msg: 'doooone!',
        server: ''
      }
    },

    methods: {
      publishOffer(to) {
        this.server = to
        this.signaling.joinGame(to)
          .then(() => {
            console.log('handshake done')
            /**/
          })
      },

      onDisconnected() {
        console.log('disconnected');
      },

      onConnected(data) {
        console.log('connected')
      },

      onGames(data) {
        this.openGames = Object.assign({}, data)
      }
    }
  }

</script>
