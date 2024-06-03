<template>
  <div class="img" @click="onAdd">
    <img :src="imageData" v-if="imageData" alt="" />
    <div class="add" v-if="!imageData"><span style="font-size: 60px; user-select: none">+</span></div>
    <div class="info" v-if="imageData">
      <div class="board">{{ imgWidth }}*{{ imgHeight }}</div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { selectFile } from "./util";
import { Base64 } from "cc-plugin/src/ccp/util/base64";

export default defineComponent({
  name: "a-img",
  emits: ["change"],
  props: {
    data: {
      type: String,
      default: "",
    },
    width: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      default: 0,
    },
  },
  setup(props, { emit }) {
    const imageData = ref(props.data);
    const imgWidth = ref(0);
    const imgHeight = ref(0);
    return {
      imageData,
      imgWidth,
      imgHeight,
      async onAdd() {
        const data = await selectFile();
        if (data) {
          const size = await Base64.getBase64WidthHeight(data);
          if (size) {
            const { width, height } = size;
            imgWidth.value = width;
            imgHeight.value = height;
          }
          imageData.value = data;
          emit("change", data);
        }
      },
    };
  },
});
</script>
<style scoped lang="less">
.img {
  width: 100px;
  height: 100px;
  border: 1px solid black;
  position: relative;
  cursor: pointer;

  img {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  .add {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .info {
    position: absolute;
    bottom: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;

    .board {
      user-select: none;
      color: red;
      padding: 0 8px;
      text-align: center;
      background-color: rgba(0, 0, 255, 0.51);
      border-radius: 5px;
      border: 1px solid blue;
    }
  }
}
</style>
