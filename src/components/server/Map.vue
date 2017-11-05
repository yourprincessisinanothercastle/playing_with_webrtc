<template>
  <div>
    <h5 class="title">map</h5>
    <canvas id="mapCanvas" ref="mapCanvas" :height="h" :width="w">></canvas>
  </div>
</template>

<script>
  export default {
    props: ['map', 'seed'],
    data() {
      return {
        h: 500,
        w: 500
      }
    },
    mounted() {
      this.map.setSeed(this.seed)

      let canvas = this.$refs.mapCanvas
      var ctx = canvas.getContext("2d");
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let y = 0; y < 30; y++) {
        for (let x = 0; x < 30; x++) {
          var array = new Uint8ClampedArray(this.map.getTileImage(x, y));
          var image = new ImageData(array, 32, 32);
          ctx.putImageData(image, x * 32, y * 32);
        }
      }
    }
  }

</script>
