import * as svgdotjs from "@svgdotjs/svg.js";
import { Gizmo } from "./gizmo";
import Sprite from "../sprite";

export class Paint {
    private context: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private x = 0;
    private y = 0;
    private width = 0;
    private height = 0;
    private scale = 1;
    private gizmo: Gizmo = new Gizmo();
    private img: HTMLImageElement;
    private sprite: Sprite;

    init(el: HTMLCanvasElement) {
        this.gizmo.init();
        this.canvas = el;
        this.context = el.getContext('2d')
        this.reset();
        this.height = this.width = 100;
        this.gizmo.updateBox(this.x, this.y, this.width, this.height);
    }

    async loadImage(str: string) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = str;
            img.onload = () => {
                this.img = img;
                this.width = img.width;
                this.height = img.height;
                this.canvas.width;
                this.canvas.height;

                this.update();
            }
        })
    }

    private update() {
        this.reset();
        if (this.img) {
            this.context.drawImage(this.img, 0, 0, this.width, this.height)
        }
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


}

const PaintInstance = new Paint();
export default PaintInstance;