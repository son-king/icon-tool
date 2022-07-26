import * as svgdotjs from "@svgdotjs/svg.js";
import { Gizmo } from "./gizmo";

export class Paint {
    private context: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private x = 0;
    private y = 0;
    private width = 0;
    private height = 0;
    private gizmo: Gizmo = new Gizmo();

    init(el: HTMLCanvasElement) {
        this.gizmo.init();
        this.canvas = el;
        this.context = el.getContext('2d')
        this.reset();
        this.height = this.width = 100;
        this.gizmo.updateBox(this.x, this.y, this.width, this.height);
    }


    reset() {
        const { width, height } = this.canvas;
        this.context.clearRect(0, 0, width, height);
        this.context.fillStyle = '#777777';
        this.context.fillRect(0, 0, width, height);
    }

    onResize(el: HTMLElement) {
        const width = el.clientWidth;
        const height = el.clientHeight;
        this.canvas.setAttribute('width', width.toString());
        this.canvas.setAttribute('height', height.toString());
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;
        this.update();
    }

    update() {
        this.reset();
    }
}

const PaintInstance = new Paint();
export default PaintInstance;