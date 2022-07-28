import CCP from "cc-plugin/src/ccp/entry-render";

export async function selectFile(): Promise<string | null> {
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
        }
        imageData = ret[keys[0]];
    }
    return imageData;
}

export async function getImageSizeByBase64(data: string): Promise<{ width: number, height: number }> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = data;
        img.onload = () => {
            resolve({ width: img.width, height: img.height });
        }
    });
}