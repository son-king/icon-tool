import { CocosPluginManifest, CocosPluginOptions, Panel, PluginType } from "cc-plugin/src/declare";

const manifest: CocosPluginManifest = {
  name: "icon-tool",
  version: "1.0.0",
  description: "icon 小工具",
  author: "xu_yanfeng",
  main: "./src/main.ts",
  analysis: {
    tongjiniao: "656939525843935232",
  },
  panels: [
    {
      name: "main",
      type: Panel.Type.DockAble,
      main: "./src/panel/index.ts",
      title: "icon-tool",
      width: 900,
      height: 900,
      minWidth: 550,
      minHeight: 400,
    },
  ],
  menus: [
    {
      path: `i18n.title`,
      message: {
        name: "showPanel",
      },
    },
  ],
  i18n_en: "./src/i18n/en.ts",
  i18n_zh: "./src/i18n/zh.ts",
};
// 这里的options变量名暂时不支持修改，发布时会进行必要的修改
const options: CocosPluginOptions = {
  server: {
    enabled: true,
    port: 2022,
  },
  watchBuild: true,
  outputProject: {
    v2: "",
    v3: "",
    web: "./web",
  },
};

export default { manifest, options };
