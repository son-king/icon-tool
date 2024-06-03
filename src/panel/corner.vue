<template>
  <CCSection name="角标" class="corner">
    <template v-slot:header>
      <div style="display: flex; flex: 1; flex-direction: row; justify-content: flex-end">
        <Checkbox v-model:value="enabledCorner" @change="onChangeCornerEnabled" label="启用"></Checkbox>
      </div>
    </template>
    <div class="content">
      <Image @change="onSelectCorner"></Image>
      <CCProp name="文件" v-if="false">
        <CCInput :disabled="true" v-model:value="cornerFile"></CCInput>
        <CCButton @click="onSelectCornerFile">...</CCButton>
        <CCButton v-show="!isWeb"><i class="iconfont icon-folder"></i></CCButton>
      </CCProp>
      <div class="pos">
        <div class="row">
          <div class="item" style="border-left: 0 solid transparent; border-top: 0 solid transparent" @click="onChangeCornerPosition(CornerPosition.LeftTop)">
            <img class="leftTop" :src="require('../res/corner-pos.svg')" alt="" />
          </div>
          <div class="item" style="border-right: 0 solid transparent; border-top: 0 solid transparent" @click="onChangeCornerPosition(CornerPosition.RightTop)">
            <img class="rightTop" :src="require('../res/corner-pos.svg')" alt="" />
          </div>
        </div>
        <div class="row">
          <div class="item" style="border-left: 0 solid transparent; border-bottom: 0 solid transparent" @click="onChangeCornerPosition(CornerPosition.LeftBottom)">
            <img class="leftBottom" :src="require('../res/corner-pos.svg')" alt="" />
          </div>
          <div class="item" style="border-right: 0 solid transparent; border-bottom: 0 solid transparent" @click="onChangeCornerPosition(CornerPosition.RightBottom)">
            <img class="rightBottom" :src="require('../res/corner-pos.svg')" alt="" />
          </div>
        </div>
        <div class="tips">角标位置</div>
      </div>
    </div>
  </CCSection>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import Image from "./img.vue";
import { CornerPosition } from "./data";
import Canvas from "./canvas";
import { selectFile } from "./util";
import CCP from "cc-plugin/src/ccp/entry-render";
import ccui from "@xuyanfeng/cc-ui";
const { CCButtonGroup, CCSection, CCCheckBox, CCInputNumber, CCButton, CCProp, CCInput, CCSelect } = ccui.components;
export default defineComponent({
  name: "corner",
  components: {
    CCButtonGroup,
    CCSection,
    CCCheckBox,
    CCInputNumber,
    CCButton,
    CCProp,
    CCInput,
    CCSelect,
    Image,
  },
  setup(props, { emit }) {
    const isWeb = ref(CCP.Adaptation.Env.isWeb);
    const enabledCorner = ref(true);

    function onSelectCorner(data: string) {
      if (data) {
        Canvas.loadCorner(data);
      }
    }
    const cornerFile = ref("");
    return {
      cornerFile,
      isWeb,
      enabledCorner,
      CornerPosition,
      onChangeCornerEnabled() {
        Canvas.updateCornerEnabled(enabledCorner.value);
      },
      onChangeCornerPosition(pos) {
        Canvas.updateCornerPosition(pos);
      },
      onSelectCorner,
      async onSelectCornerFile() {
        const imageData = await selectFile();
        onSelectCorner(imageData);
      },
    };
  },
});
</script>
<style scoped lang="less">
.corner {
  .content {
    display: flex;
    flex-direction: row;

    .pos {
      position: relative;
      margin: 0 2px;
      flex: 1;
      display: flex;
      flex-direction: column;
      border: 1px solid gray;
      box-sizing: border-box;

      .tips {
        pointer-events: none;
        user-select: none;
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
      }

      .row {
        display: flex;
        flex-direction: row;

        .item:hover {
          border: 1px solid gray;
        }

        .item {
          box-sizing: border-box;
          cursor: pointer;
          position: relative;
          flex: 1;
          height: 50px;
          border: 1px solid transparent;

          img {
            width: 40px;
            height: 40px;
            position: absolute;
          }

          .leftTop {
            left: 0;
            top: 0;
          }

          .rightTop {
            transform: rotate(90deg);
            right: 0;
            top: 0;
          }

          .leftBottom {
            transform: rotate(-90deg);
            left: 0;
            bottom: 0;
          }

          .rightBottom {
            transform: rotate(180deg);
            right: 0;
            bottom: 0;
          }
        }
      }
    }
  }
}
</style>
