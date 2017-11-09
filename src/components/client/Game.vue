<template>
  <canvas ref="myCanvas"  width="400" height="400"></canvas> 
</template>
<script>
  import * as PIXI from 'pixi.js'

  export default {
    props: ['channels'],
    mounted() {
        console.log('mounted game')
        console.log(PIXI)
        console.log(this.channels)
        let myView = this.$refs.myCanvas;
        let renderer = PIXI.autoDetectRenderer(400, 400, {view: myView}); 
    }
  }

</script>
