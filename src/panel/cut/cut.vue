<template>
  <div class="root">
    <canvas ref="canvas"></canvas>
    <svg id="drawing" v-show="imageData"></svg>
    <div class="add" @click="onClickAdd" v-if="!imageData">
      <span>+</span>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import PaintInstance from "./paint";
import { bind } from "size-sensor";
import { selectFile } from "../util";

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
    const imageData = ref("");
    return {
      canvas,
      imageData,
      async onClickAdd() {
        const data = await selectFile();
        if (data) {
          imageData.value = data;
          PaintInstance.loadImage(data);
        }
      }
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

  .add {
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;

    span {
      font-size: 66px;
      user-select: none;
    }
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