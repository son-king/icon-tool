<template>
  <div class="root">
    <canvas ref="canvas"></canvas>
    <svg id="drawing"></svg>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import PaintInstance from "./paint";
import { bind } from "size-sensor";

export default defineComponent({
  name: 'img-cut',
  setup(props, { emit }) {
    const canvas = ref();
    onMounted(() => {

      const el: HTMLCanvasElement = canvas.value as HTMLCanvasElement;
      PaintInstance.init(el);
      PaintInstance.onResize(el.parentElement);
      bind(el.parentElement, () => {
        PaintInstance.onResize(el.parentElement);
      })
    })
    return {
      canvas,
    }
  }
})
</script>
<style lang="less">
.root {
  width: 100%;
  height: 150px;
  position: relative;

  canvas {
    display: block;
  }

  #drawing {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
  }
}
</style>