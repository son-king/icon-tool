import CanvasInstance, { Canvas } from "./canvas";


export async function pack(width: number, height: number) {
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
    CanvasCtrl.corner.updateConfig(CanvasInstance.corner);
    CanvasCtrl.update();
    CanvasCtrl.save();
}