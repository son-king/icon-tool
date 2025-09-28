import { BuildPlatform } from "cc-plugin/src/declare";
import PKG from "../cc-plugin.config";
/**
 * @description https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/custom-build-plugin.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E6%9E%84%E5%BB%BA%E9%9D%A2%E6%9D%BF%E9%80%89%E9%A1%B9
 */

class OptRenderAttrs {
  /**输入框占位符 */
  placeholder: string = "";
  setPlaceholder(placeholder: string) {
    this.placeholder = placeholder;
    return this;
  }
}
enum OptsRenderUI {
  Checkbox = "ui-checkbox",
  Input = "ui-input",
  File = "ui-file",
}
class OptRender {
  /**
   * UI组件名字
   * @link https://docs.cocos.com/creator/3.8/manual/zh/editor/extension/ui.html
   * */
  ui: OptsRenderUI = OptsRenderUI.Input;
  attributes: OptRenderAttrs = new OptRenderAttrs();
  setUI(ui: OptsRenderUI) {
    this.ui = ui;
    return this;
  }
}

enum OptsVerifyRule {
  /**必填项 */
  required = "required",
  /**自定义校验规则 */
  ruleTest = "ruleTest",
}
class Opts {
  /**参数在界面上显示的名称，支持 i18n:key 配置 */
  label: string = "";
  /**简要描述信息，用于鼠标悬停在 label 上时显示提示，支持 i18n:key 配置 */
  description: string = "";
  /**参数的默认值 */
  default: any = null;
  render: OptRender = new OptRender();
  verifyRules: OptsVerifyRule[] = [];
  setLabel(label: string) {
    this.label = label;
    return this;
  }
  setDefault(defaultValue: any) {
    this.default = defaultValue;
    return this;
  }
  addVerifyRules(rule: OptsVerifyRule) {
    if (!this.verifyRules.includes(rule)) {
      this.verifyRules.push(rule);
    }
    return this;
  }
}
class VerifyRuleMap {
  /**自定义校验规则失败时的提示信息 */
  message: string = "";
  func: (val: any, buildOptions: any) => boolean = null;
  setMessage(message: string) {
    this.message = message;
    return this;
  }
}
class Platfrom {
  hooks: string = "./hooks";
  options: Record<string, any> = {};
  verifyRuleMap: Record<string, any> = {};
  setHooks(hooks: string) {
    this.hooks = hooks;
    return this;
  }
  addOptions(key: string): Opts {
    if (!this.options[key]) {
      const opts = new Opts();
      opts.label = key;
      this.options[key] = opts;
    }
    return this.options[key];
  }
  addVerifyRuleMap(key: string): VerifyRuleMap {
    if (!this.verifyRuleMap[key]) {
      this.verifyRuleMap[key] = new VerifyRuleMap();
    }
    return this.verifyRuleMap[key];
  }
}

class BuildOptonsConfig {
  /**最终要导出的配置数据 */
  data: Record<string, Platfrom> = {};
  platformAll(): Platfrom {
    return this.getPlatform("*");
  }
  private getPlatform(platfrom: string) {
    if (!this.data[platfrom]) {
      this.data[platfrom] = new Platfrom();
    }
    return this.data[platfrom];
  }
}

const cfg = new BuildOptonsConfig();
const platform = cfg.platformAll();
platform.addOptions("enable").setDefault(true).render.setUI(OptsRenderUI.Checkbox);
platform
  .addOptions("icon") //
  // .addVerifyRules(OptsVerifyRule.required) //
  .setDefault("")
  .render.setUI(OptsRenderUI.File)
  .attributes.setPlaceholder("please select android icon file");

export const configs = cfg.data;
