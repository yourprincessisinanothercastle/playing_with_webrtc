<template>
  <div>
    <div class="section">
      <div class="container">
        <div class="columns">
          <div class="column" v-if="!server">
            <h5 class=title>join game</h5>

            <div v-for="id in Object.keys(openGames)">
              <a class=button @click="publishOffer(openGames[id]['server'])"> {{ id }}</a>
            </div>

            <div v-if="Object.keys(openGames).length === 0">
              no games open
            </div>
          </div>
          <div class="column" v-else="">
            <button class="button" @click="sendReliable()">send something reliable</button>
            <button class="button" @click="sendUnreliable()">send something unreliable</button>
          </div>

          <div class="column">
            <router-link :to="{ name: 'Server' }">...or be the server</router-link>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Signaling from '../webRTC/ClientSignaling'

  export default {
    data() {
      return {
        openGames: {},
        signaling: new Signaling('https://ws.kwoh.de', this.onConnected, this.onDisconnected, this.onGames),
        server: '',
        channels: {}
      }
    },

    methods: {
      publishOffer(to) {
        this.server = to
        this.signaling.joinGame(to)
          .then((channels) => {
            this.channels = channels
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
        console.log('ongames called')
        this.openGames = Object.assign({}, data)
      },

      sendReliable(){
          this.channels['reliable'].send('reliable stuff')
      },
      
      sendUnreliable(){
        this.channels['unreliable'].send('unreliable stuff')
      },
    }
  }

</script>
