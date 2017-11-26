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
              <input class="input" type="text" v-model="seed" placeholder="seed">
            </div>
            <div class="control">
              <a class="button is-info" @click="openGame()" :disabled="gameIsOpen">
                open
              </a>
            </div>
          </div>
        </div>
        <div class="column" v-if="!gameIsOpen">
          <Games :games="games"></Games>
        </div>
      </div>
    </div>

    <div class="section" v-if="gameIsOpen">
      <div class="container">
        <div class="columns">
          <div class="column">
            <h5 class="title">players</h5>
            <div v-for="id in Object.keys(players)">
              {{ id }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Games from './components/Games'

  import ServerSignaling from '../webRTC/ServerSignaling.js'
  import Game from './game/GameInterface'


  export default {
    components: {
      Games,
    },
    data() {
      return {
        games: {},
        game_name: '',
        seed: '123',
        gameIsOpen: false,
        players: {},
        signaling: new ServerSignaling('https://ws.kwoh.de', this.onConnect, this.onDisconnect, this.onGames, this.onGameOpened,
          this.onNewPlayer, this.onPlayerQuit),
        game: null,
        tiles: {}
      }
    },

    methods: {
      onConnect() {
      },

      onDisconnect() {
      },

      onGames(games) {
        this.games = Object.assign({}, games)
      },

      onGameOpened() {
        // pos answer from signaling
        console.log('disableing');
        this.gameIsOpen = true;
        this.game = new Game(this.seed, this.onAddTile)
      },

      openGame() {
        // ask signaling for a new game
        this.signaling.openGame(this.game_name);
      },

      onNewPlayer(client_id, channels) {
        console.log('new player!', client_id, channels);

        this.game.addPlayer(client_id, channels['reliable'], channels['unreliable']);
        this.players = Object.assign({}, this.game.players)
      },

      onPlayerQuit(channels) {
        // todo
      },

      onAddTile(x, y, tileData) {
        // todo
      }
    },
  }

</script>
