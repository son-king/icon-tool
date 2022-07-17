<template>
  <div class="panel">
    <cc-prop name="目标工程">
      <CCSelect :data="targets" value="1"></CCSelect>
    </cc-prop>
    <CCProp name="图标文件">
      <CCInput v-model:value="pngFile"></CCInput>
      <CcButton>...</CcButton>
      <CcButton><i class="iconfont icon-folder"></i></CcButton>
    </CCProp>
    <div style="display: flex;flex-direction: row;">
      <div style="flex:1;"></div>
      <CcButton color="green">替换</CcButton>
    </div>
  </div>
</template>
<script lang="ts">

import { defineComponent, onMounted, ref, provide, nextTick } from 'vue'
import PluginConfig from '../../cc-plugin.config'
import CCProp from "cc-plugin/src/ui/packages/cc-prop";
import CCSelect from "cc-plugin/src/ui/packages/cc-select";
import CCInput from "cc-plugin/src/ui/packages/cc-input";
import CcButton from "cc-plugin/src/ui/packages/cc-button";

export default defineComponent({
  name: 'index',
  components: { CCProp, CCSelect, CCInput, CcButton },
  setup(props, { emit }) {
    onMounted(() => {
    })
    const targets = ref([{ label: 'android', value: 1 }])
    const pngFile = ref('111')
    return {
      pngFile,
      targets,
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
}
</style>
