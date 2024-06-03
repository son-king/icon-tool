import CCP from "cc-plugin/src/ccp/entry-render";
import { Base64 } from "cc-plugin/src/ccp/util/base64";
export async function selectFile(): Promise<string | null> {
  let imageData = null;
  const ret = await CCP.Adaptation.Dialog.select({
    title: "选择文件",
    type: "file",
    multi: false,
    filters: [{ name: "png", extensions: [".png"] }],
  });
  const keys = Object.keys(ret);
  if (keys.length) {
    if (CCP.Adaptation.Env.isWeb) {
    }

    imageData = ret[keys[0]];
    if (imageData instanceof ArrayBuffer) {
      imageData = Base64.transformArrayBuffer(imageData);
      if (!Base64.invalid(imageData)) {
        imageData = Base64.fillHead(imageData, "png");
      }
    }
  }
  return imageData;
}
