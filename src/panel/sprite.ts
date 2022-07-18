import Node from "./node";
import { Canvas } from "./canvas";

export default class Sprite extends Node {
    private canvas: Canvas;
    private img: HTMLImageElement = null;
    public width: number = 0;
    public height: number = 0;
    public x: number = 0;
    public y: number = 0;
    public scale: number = 1;
    public showBoard: boolean = true;
    public base64: string = '';

    public radius: number = 0;
    public enabledRound: boolean = false;

    constructor(canvas: Canvas) {
        super();
        this.canvas = canvas;
    }

    updateConfig(spr: Sprite) {
        this.radius = spr.radius;
        this.enabledRound = spr.enabledRound;
        this.visible = spr.visible;
        this.showBoard = false;
    }

    initWithImage(img: HTMLImageElement) {

    }

    public isValid(): boolean {
        return !!this.img;
    }

    private _reset() {
        this.x = this.y = 0;
        this.width = this.height = 0;
        this.scale = 1;
        this.img = null;
        this.radius = 0;
        this.enabledRound = false;
        this.base64 = '';
    }

    async initWithBase64(data: string) {
        this._reset();
        if (data.indexOf('base64') !== -1) {
            this.base64 = data;
            this.img = await this._load(data);
        } else {
            this.base64 = '';
            this.img = null;
        }
    }

    private _load(data: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.src = data;
            img.onload = () => {
                this.width = img.width;
                this.height = img.height;
                resolve(img);
            }
            // img.oninvalid = () => {
            //     reject(false);
            // }
        })
    }

    onKeyboard(event: KeyboardEvent) {
        const left = 37, up = 38, right = 39, down = 40;
        const { keyCode } = event;
        if (keyCode == left) {
            this.x--;
        } else if (keyCode == right) {
            this.x++;
        } else if (keyCode == up) {
            this.y--;
        } else if (keyCode == down) {
            this.y++;
        }
    }

    updateScale(packWidth) {
        this.scale = packWidth / this.width;
    }

    cutRoundedRect(ctx, radius, x, y, w, h) {
        var left = x;
        var top = y;
        var right = x + w;
        var bottom = y + h;

        ctx.globalCompositeOperation = 'destination-in';
        ctx.fillStyle = 'white';

        ctx.beginPath();
        ctx.moveTo(left + radius, top);
        ctx.lineTo(right - radius, top);
        ctx.quadraticCurveTo(right, top, right, top + radius);
        ctx.lineTo(right, bottom - radius);
        ctx.quadraticCurveTo(right, bottom, right - radius, bottom);
        ctx.lineTo(left + radius, bottom);
        ctx.quadraticCurveTo(left, bottom, left, bottom - radius);
        ctx.lineTo(left, top + radius);
        ctx.quadraticCurveTo(left, top, left + radius, top);
        ctx.fill();
        // 恢复到默认
        ctx.globalCompositeOperation = 'source-over';
    };

    getContentSize() {
        return {
            width: this.width * this.scale * this.canvas.scale,
            height: this.height * this.scale * this.canvas.scale,
        }
    }

    onMove(event: MouseEvent) {
        this.x += event.movementX;
        this.y += event.movementY;
    }

    draw(canvas: Canvas) {
        const { context, scale } = canvas;

        if (this.scale <= 0 || !this.img) {
            return;
        }
        const width = this.width * this.scale * scale;
        const height = this.height * this.scale * scale;
        if (width < 0 || height < 0) {
            return;
        }
        this.img && context.drawImage(this.img, this.x, this.y, width, height);
        if (this.enabledRound) {
            this.cutRoundedRect(context, this.radius * this.scale * scale, this.x, this.y, width, height);
        }
        if (this.showBoard) {
            const lineWidth = 1;
            context.lineWidth = lineWidth;
            context.strokeStyle = '#ff0000';
            context.strokeRect(this.x - lineWidth / 2, this.y - lineWidth / 2, width + lineWidth / 2, height + lineWidth / 2);
        }
    }
}