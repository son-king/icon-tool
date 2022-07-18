import CanvasInstance, { Canvas } from "./canvas";
import JSZip from "jszip";
import { saveAs } from "file-saver";

function getBase64Content(data) {
    let flag = "data:image/png;base64,";
    if (data.indexOf(flag) !== -1) {
        return data.substring(flag.length, data.length);
    }
    return data;
}

export async function packZipAndDownload(arr: Array<{ width: number, height: number, name: string }>) {
    const zip = new JSZip();
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        let base64 = await createImage(item.width, item.height);
        base64 = getBase64Content(base64);
        let file = item.name;
        if (!file.endsWith('.png')) {
            file += '.png';
        }
        zip.file(file, base64, { base64: true });
    }
    const data = await zip.generateAsync({ type: 'blob' });
    saveAs(data, 'icon.zip')
}

export async function createImage(width: number, height: number): Promise<string> {
    if (!CanvasInstance.canPack()) {
        console.log('不满足打包条件')
        return;
    }
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const CanvasCtrl = new Canvas();
    CanvasCtrl.transparent = true;
    CanvasCtrl.pack = true;
    CanvasCtrl.init(canvas);
    CanvasCtrl.cornerPosition = CanvasInstance.cornerPosition;
    await CanvasCtrl.loadCorner(CanvasInstance.corner.base64)
    await CanvasCtrl.loadIcon(CanvasInstance.icon.base64);
    CanvasCtrl.icon.updateConfig(CanvasInstance.icon);
    CanvasCtrl.icon.updateScale(width);
    CanvasCtrl.corner.updateConfig(CanvasInstance.corner);
    CanvasCtrl.corner.updateScale(width);
    CanvasCtrl.update();
    return CanvasCtrl.toBase64();
}