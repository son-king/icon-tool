<template>
  <div class="panel">
    <cc-prop name="目标工程">
      <CCSelect :data="targets" value="1"></CCSelect>
    </cc-prop>
    <CCProp name="图标文件">
      <CCInput v-model:value="pngFile"></CCInput>
      <CcButton @click="onSelectIconFile">...</CcButton>
      <CcButton><i class="iconfont icon-folder"></i></CcButton>
    </CCProp>
    <div style="display: flex;flex-direction: row;">
      <div style="flex:1;"></div>
      <CcButton @click="onGenBySize" color="blue">生成</CcButton>
      <CcButton @click="onReplace" color="green">替换</CcButton>
    </div>
    <CCProp name="目标尺寸">
      <CcInputNumber v-model:value="newSize" style="flex:1;" :min="0"></CcInputNumber>
      <CcButton color="green" @click="onAddNewSize">新增</CcButton>
      <CcButton color="green" @click="onSelectAllSize">全选</CcButton>
    </CCProp>
    <div class="targetSizes">
      <Checkbox :label="`${item.width}*${item.height}`" :value="item.use"
                :key="index"
                style="margin:0 4px;"
                v-for="(item, index) in allSizeSettings">
      </Checkbox>
    </div>

    <div class="preview">

      <canvas ref="canvas" tabindex="0">

      </canvas>
    </div>
    <CCSection name="圆角">
      <template v-slot:header>
        <div style="display: flex; flex:1; flex-direction: row; justify-content: flex-end;">
          <Checkbox v-model:value="enabledRound" label="启用" @change="onChangeRound"></Checkbox>
        </div>
      </template>
      <CCProp name="尺寸">
        <CcInputNumber v-model:value="radius" :min="0" style="flex:1;" @change="onChangeRound"></CcInputNumber>
      </CCProp>
    </CCSection>
    <CCSection name="角标">
      <template v-slot:header>
        <div style="display: flex; flex:1; flex-direction: row; justify-content: flex-end;">
          <Checkbox v-model:value="enabledCorner"
                    @change="onChangeCornerEnabled" label="启用"></Checkbox>
        </div>
      </template>
      <CCProp name="文件">
        <CCInput v-model:value="cornerFile"></CCInput>
        <CcButton @click="onSelectCornerFile">...</CcButton>
        <CcButton><i class="iconfont icon-folder"></i></CcButton>
      </CCProp>
      <CCProp name="位置">
        <CcButton @click="onChangeCornerPosition(CornerPosition.LeftTop)">左上</CcButton>
        <CcButton @click="onChangeCornerPosition(CornerPosition.LeftBottom)">左下</CcButton>
        <CcButton @click="onChangeCornerPosition(CornerPosition.RightTop)">右上</CcButton>
        <CcButton @click="onChangeCornerPosition(CornerPosition.RightBottom)">右下</CcButton>
      </CCProp>
    </CCSection>

  </div>
</template>
<script lang="ts">

import { defineComponent, onMounted, ref, provide, nextTick } from 'vue'
import PluginConfig from '../../cc-plugin.config'
import CCProp from "cc-plugin/src/ui/packages/cc-prop";
import CCSelect from "cc-plugin/src/ui/packages/cc-select";
import CCInput from "cc-plugin/src/ui/packages/cc-input";
import CcButton from "cc-plugin/src/ui/packages/cc-button";
import Canvas from "./canvas";
import CCP from "cc-plugin/src/ccp/entry-render";
import Checkbox from "cc-plugin/src/ui/packages/cc-checkbox/checkbox.vue";
import CcInputNumber from "cc-plugin/src/ui/packages/cc-input-number/index.vue";
import CCSection from "cc-plugin/src/ui/packages/cc-section";
import { CornerPosition } from "./data";
import { pack } from "./pack";

export default defineComponent({
  name: 'index',
  components: {
    CCProp, CCSelect, CCInput, CcButton,
    CCSection,
    Checkbox, CcInputNumber
  },
  setup(props, { emit }) {

    const allSizeSettings = ref([20, 29, 40, 58, 60, 76, 80, 87, 120, 152, 167, 180].map(val => {
      return { width: val, height: val, use: false };
    }));
    const targets = ref([{ label: 'android', value: 1 }])
    const pngFile = ref('111')
    const cornerFile = ref('');
    const canvas = ref();
    onMounted(() => {
      const el: HTMLCanvasElement = canvas.value as HTMLCanvasElement;
      Canvas.init(el);
    })
    const newSize = ref(100);
    const enabledCorner = ref(true);
    const radius = ref(0);
    const enabledRound = ref(true);

    async function selectFile(): Promise<string | null> {
      let imageData = null;
      const ret = await CCP.Adaptation.Dialog.select({
        title: '选择文件',
        type: 'file',
        multi: false,
        filters: [{ name: 'png', extensions: ['.png'] }]
      });
      const keys = Object.keys(ret);
      if (keys.length) {
        if (CCP.Adaptation.Env.isWeb) {
          imageData = ret[keys[0]];
        }


      }
      return imageData;
    }

    return {
      enabledRound,
      radius,
      onChangeRound() {
        Canvas.updateRadius(enabledRound.value, radius.value);
      },

      CornerPosition,
      enabledCorner,
      onChangeCornerEnabled() {
        Canvas.updateCornerEnabled(enabledCorner.value);
      },
      onChangeCornerPosition(pos) {
        Canvas.updateCornerPosition(pos);
      },
      newSize,
      cornerFile,
      allSizeSettings,
      canvas,
      pngFile,
      targets,
      onGenBySize() {
        // Canvas.save();
        pack(400, 400);
      },
      onReplace() {

      },
      onAddNewSize() {
        const size = newSize.value;
        if (!allSizeSettings.value.find(el => el.width === size)) {
          allSizeSettings.value.push({ width: size, height: size, use: true });
        }
      },
      onSelectAllSize() {
        let use = true;
        if (allSizeSettings.value.find(el => !el.use)) {
          // 全部都是未选中
          use = true;
        } else if (!allSizeSettings.value.find(el => !el.use)) {
          // 全部选中
          use = false;
        } else {
          use = true;
        }
        allSizeSettings.value.forEach(el => {
          el.use = use;
        })

      },
      async onSelectCornerFile() {
        const imageData = await selectFile();
        if (imageData) {
          Canvas.loadCorner(imageData)
        }
      },
      async onSelectIconFile() {
        const imageData = await selectFile();
        if (imageData) {
          Canvas.loadIcon(imageData)
        }
      }
    }
  }
})
</script>

<style scoped lang="less">
.panel {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .preview {
    border: 1px solid #999999;

    canvas {
      background-color: #777777;
      outline: none;
      width: 100%;
      height: 100%;
    }
  }

  .targetSizes {
    margin-left: 15px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    border: 1px solid #9a6e3a;
  }
}
</style>
