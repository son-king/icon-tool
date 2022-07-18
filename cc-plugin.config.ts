// @ts-ignore
import { CocosPluginManifest, CocosPluginOptions, Panel, PluginType } from 'cc-plugin/src/declare';
import utils from 'cc-plugin/src/utils'

const pkgName = 'icon-tool'


function i18n(key: string) {
    return `i18n:${pkgName}.${key}`
}

const manifest: CocosPluginManifest = {
    name: pkgName,
    version: '1.0.0',
    description: 'icon 小工具',
    author: 'xu_yanfeng',
    main: "./src/main.ts",
    panels: [
        {
            name: 'main',
            type: Panel.Type.Dockable,
            main: './src/panel/index.ts',
            title: 'CC-Plugin',
            width: 900,
            height: 900,
            minWidth: 550,
            minHeight: 400,
        }
    ],
    menus: [],
    i18n_en: './src/i18n/en.ts',
    i18n_zh: './src/i18n/zh.ts',
}
// 这里的options变量名暂时不支持修改，发布时会进行必要的修改
const options: CocosPluginOptions = {
    // type: PluginType.PluginV2,
    type: PluginType.Web,
    server: {
        enabled: true,
        port: 2022,
    },
    watchBuild: true,
    outputProject: {
        v2: '/Users/xyf/Documents/project/creator-plugin/v249/',
        v3: '/Users/xyf/Documents/project/creator-plugin/v352/',
        web: './dist',
    }
}
utils.init(manifest, options);

manifest.menus.push({
    path: `${utils.builtinMenu.package}/${i18n('title')}`,
    message: {
        name: 'showPanel'
    }
})
export default { manifest, options }
