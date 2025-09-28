import { join } from "path";
import { existsSync, readFileSync, statSync, writeFileSync } from "fs";
import PKG from "../cc-plugin.config";
import { Options } from "./const";
import CCP from "cc-plugin/src/ccp/entry-render";
import { ensureFileSync } from "fs-extra";
const sharp = require("sharp");
CCP.init(PKG, { ready: () => {} });

interface IconOption {
  file: string;
  size: number;
  check: boolean;
  enable: boolean;
}
export const onAfterBuild = async function (options: any, result: any) {
  const opt: Options = options.packages[PKG.manifest.name];
  if (!opt) {
    return;
  }
  if (!opt.enable) {
    return;
  }
  if (!opt.icon) {
    return;
  }
  const resDir = join(CCP.Adaptation.Project.path, "native", "engine", "android", "res");
  if (!existsSync(resDir)) {
    return;
  }
  const iconFileName = "ic_launcher.png";
  const cfg: IconOption[] = [
    {
      enable: false,
      size: 36,
      file: join("drawable-hdpi", iconFileName),
      check: true,
    },
    {
      enable: false,
      size: 24,
      file: join("drawable-mdpi", iconFileName),
      check: true,
    },
    {
      size: 48,
      enable: false,
      file: join("drawable-xhdpi", iconFileName),
      check: true,
    },
    {
      enable: false,
      size: 72,
      file: join("drawable-xxhdpi", iconFileName),
      check: true,
    },
    {
      enable: false,
      size: 96,
      file: join("drawable-xxxhdpi", iconFileName),
      check: true,
    },
    {
      enable: true,
      size: 72,
      file: join("mipmap-hdpi", iconFileName),
      check: true,
    },
    {
      enable: true,
      size: 36,
      file: join("mipmap-ldpi", iconFileName),
      check: true,
    },
    {
      enable: true,
      size: 48,
      file: join("mipmap-mdpi", iconFileName),
      check: true,
    },
    {
      enable: true,
      size: 96,
      file: join("mipmap-xhdpi", iconFileName),
      check: true,
    },
    {
      enable: true,
      size: 144,
      file: join("mipmap-xxhdpi", iconFileName),
      check: true,
    },
    {
      enable: true,
      size: 192,
      file: join("mipmap-xxxhdpi", iconFileName),
      check: true,
    },
    {
      enable: true,
      size: 512,
      file: "playstore-icon.png",
      check: false,
    },
  ];
  cfg.map(async (item) => {
    const icon = join(resDir, item.file);
    if (item.check) {
      if (!existsSync(icon)) {
        console.log(`icon not found ${icon}`);
        debugger;
        return;
      }
    } else {
      ensureFileSync(icon);
    }
    // 检查老icon的分辨率大小是否和预期的一致
    if (item.check) {
      const metadata = await sharp(icon).metadata();
      if (metadata.width !== item.size || metadata.height !== item.size) {
        console.log(`icon size not match ${icon}`);
        debugger;
        return;
      }
    } else {
      // 不检查就跳过
    }

    await sharp(opt.icon).resize(item.size, item.size).toFile(icon);
    console.log(`resize icon ${icon}`);
  });
};
