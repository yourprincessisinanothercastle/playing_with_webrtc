<template>
  <div class="section">
    <div class="container">
      <div class="columns">
        <div class="column">
          <div class="field has-addons">
            <div class="control">
              <input class="input" type="text" v-model="game_name" placeholder="open game">
            </div>
            <div class="control">
              <a class="button is-info" @click="openGame()" :disabled="gameIsOpen">
                open
              </a>
            </div>
          </div>
        </div>
        <div class="column">
          <Games :games="games"></Games>
        </div>
        <div class="column">
          <div v-for="id in Object.keys(players)">
            {{ id }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ServerSignaling from '../webRTC/ServerSignaling.js'
  import Games from './Games'

  export default {
    components: {
      Games
    },
    data() {
      return {
        signaling: new ServerSignaling('https://ws.kwoh.de', this.onConnect, this.onDisconnect, this.onGames, this.onGameOpened,
          this.onNewPlayer),
        games: {},
        game_name: '',
        gameIsOpen: false,
        players: {}
      }
    },

    methods: {
      onConnect() {},
      onDisconnect() {},
      onGames(games) {
        this.games = Object.assign({}, games)
      },
      onGameOpened() {
        console.log('disableing')
        this.gameIsOpen = true
      },
      openGame() {
        this.signaling.openGame(this.game_name);
      },
      onNewPlayer(channels) {
        console.log('new player!')
        this.players = Object.assign({}, this.signaling.connections)
      }
    },
  }

</script>
