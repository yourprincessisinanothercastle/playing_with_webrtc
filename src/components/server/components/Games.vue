<template>
  <div>
    <h5 class="title">open games</h5>
    <ul>
      <li v-for="game in Object.keys(games)">{{game}}</li>
    </ul>
  </div>
</template>

<script>
  import Signaling from '../../webRTC/Signaling.js'

  export default {
    props: ['games']
  }

</script>
