<template>
  <div class="panel">
    <div class="preview">
      <div style="position: absolute; top: 0; left: 0">预览：</div>
      <canvas style="display: block" ref="canvas" tabindex="0"></canvas>
    </div>
    <div class="settings">
      <div class="content">
        <CCSection name="图标">
          <!--          <img-cut ></img-cut>-->
          <Image @change="onSelectIcon"></Image>
          <CCProp name="文件" v-if="false">
            <CCInput :disabled="true" v-model:value="pngFile"></CCInput>
            <CCButton @click="onSelectIconFile">...</CCButton>
            <CCButton v-show="!isWeb"><i class="iconfont icon-folder"></i></CCButton>
          </CCProp>
          <CCProp name="生成尺寸">
            <CCInputNumber v-model:value="newSize" style="flex: 1" :min="0"></CCInputNumber>
            <CCButton color="green" @click="onAddNewSize">新增</CCButton>
            <CCButton color="green" @click="onSelectAllSize">全选</CCButton>
          </CCProp>
          <div class="targetSizes">
            <Checkbox v-model:value="item.use" :key="index" style="margin: 0 4px" v-for="(item, index) in allSizeSettings">
              <template v-slot:label>
                <span style="user-select: none; cursor: pointer" @click="onClickItemSize(item)">{{ item.width }}*{{ item.height }}</span>
              </template>
            </Checkbox>
          </div>
        </CCSection>
        <CCSection name="圆角">
          <template v-slot:header>
            <div style="display: flex; flex: 1; flex-direction: row; justify-content: flex-end">
              <Checkbox v-model:value="enabledRound" label="启用" @change="onChangeRound"></Checkbox>
            </div>
          </template>
          <CCProp name="尺寸">
            <CCInputNumber v-model:value="radius" :min="0" style="flex: 1" @change="onChangeRound"></CCInputNumber>
          </CCProp>
        </CCSection>
        <corner></corner>
        <CCSection v-if="!isWeb && false" name="替换项目图标">
          <CCProp name="目标工程">
            <CCSelect :data="targets" value="1"></CCSelect>
          </CCProp>
          <div style="display: flex; flex-direction: row; justify-content: flex-end">
            <CCButton @click="onReplace" color="green">替换</CCButton>
          </div>
        </CCSection>
      </div>
      <div style="display: flex; flex-direction: row; justify-content: flex-end; margin: 3px 0">
        <CCButton @click="onGenBySize" color="blue">批量生成</CCButton>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, onMounted, ref, provide, nextTick } from "vue";
import PluginConfig from "../../cc-plugin.config";
import Canvas from "./canvas";
import CCP from "cc-plugin/src/ccp/entry-render";
import { CornerPosition } from "./data";
import { packZipAndDownload, createImage } from "./pack";
import { bind } from "size-sensor";
import { saveAs } from "file-saver";
import Image from "./img.vue";
import { selectFile } from "./util";
import Corner from "./corner.vue";
import ImgCut from "./cut/cut.vue";
import ccui from "@xuyanfeng/cc-ui";
const { CCButtonGroup, CCSection, CCCheckBox, CCInputNumber, CCButton, CCProp, CCInput, CCSelect } = ccui.components;
export default defineComponent({
  name: "index",
  components: {
    ImgCut,
    Corner,
    Image,
    CCButtonGroup,
    CCSection,
    CCCheckBox,
    CCInputNumber,
    CCButton,
    CCProp,
    CCInput,
    CCSelect,
  },
  setup(props, { emit }) {
    const allSizeSettings = ref(
      [20, 29, 40, 58, 60, 76, 80, 87, 120, 152, 167, 180].map((val) => {
        return { width: val, height: val, use: false };
      })
    );
    const targets = ref([{ label: "android", value: 1 }]);
    const pngFile = ref("111");
    const cornerFile = ref("");
    const canvas = ref();
    onMounted(() => {
      const el: HTMLCanvasElement = canvas.value as HTMLCanvasElement;
      Canvas.init(el);
      Canvas.onResize(el.parentElement);
      bind(el.parentElement, () => {
        Canvas.onResize(el.parentElement);
      });
    });
    const newSize = ref(100);
    const radius = ref(0);
    const enabledRound = ref(true);

    function onSelectIcon(data: string) {
      if (data) {
        Canvas.loadIcon(data);
      }
    }

    const isWeb = ref(CCP.Adaptation.Env.isWeb);
    // isWeb.value = false;
    return {
      isWeb,
      enabledRound,
      radius,
      onChangeRound() {
        Canvas.updateRadius(enabledRound.value, radius.value);
      },

      newSize,
      cornerFile,
      allSizeSettings,
      canvas,
      pngFile,
      targets,
      onGenBySize() {
        const width = Canvas.icon.width;
        const height = Canvas.icon.height;
        if (width != height) {
          console.log(`icon 宽(${width})高(${height})不一致，暂不支持输出！`);
          return;
        }
        let arr = [];
        allSizeSettings.value.forEach((setting) => {
          if (setting.use) {
            arr.push({
              width: setting.width,
              height: setting.height,
              name: `icon-${setting.width}.png`,
            });
          }
        });
        if (arr.length === 0) {
          console.log("没有要生成的图片");
          return;
        }
        packZipAndDownload(arr);
      },
      onReplace() {},
      onAddNewSize() {
        const size = newSize.value;
        if (!allSizeSettings.value.find((el) => el.width === size)) {
          allSizeSettings.value.push({ width: size, height: size, use: true });
        }
      },
      onSelectAllSize() {
        let use = true;
        if (allSizeSettings.value.find((el) => !el.use)) {
          // 全部都是未选中
          use = true;
        } else if (!allSizeSettings.value.find((el) => !el.use)) {
          // 全部选中
          use = false;
        } else {
          use = true;
        }
        allSizeSettings.value.forEach((el) => {
          el.use = use;
        });
      },
      onSelectIcon,
      async onSelectIconFile() {
        const imageData = await selectFile();
        onSelectIcon(imageData);
      },
      async onClickItemSize(item) {
        const { width, height } = item;
        const data = await createImage(width, height);
        saveAs(data, `icon-${width}*${height}.png`);
      },
    };
  },
});
</script>

<style scoped lang="less">
.panel {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;

  .preview {
    position: relative;
    overflow: hidden;
    border: 1px solid #999999;
    flex: 1;
    display: flex;
    flex-direction: column;

    canvas {
      flex: 1;
      background-color: #777777;
      outline: none;
      width: 100%;
    }
  }

  .settings {
    flex: 1;
    display: flex;
    flex-direction: column;

    .content {
      flex: 1;
      overflow: auto;
      flex-direction: column;
      border: 1px solid #fd942b;
      margin: 0 5px;
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
