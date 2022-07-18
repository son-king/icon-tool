import fileSaver from 'file-saver'
import Sprite from './sprite'
import Node from './node'

class Canvas {
    private context: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private icon: Sprite = new Sprite();
    private corner: Sprite = new Sprite();
    private dirty = false;
    private nodes: Node[] = [];

    constructor() {
        this.nodes.push(this.icon);
        this.nodes.push(this.corner);
    }

    init(el: HTMLCanvasElement) {
        this.canvas = el;
        this.context = el.getContext('2d');
        this.reset();
        this.initTouch();
        requestAnimationFrame(this._loop.bind(this))
    }

    private setDirty(b) {
        this.dirty = b;
    }

    private initTouch() {
        const { icon, corner, canvas } = this;
        const self = this;

        function mousemove(event: MouseEvent) {
            icon.x += event.movementX;
            icon.y += event.movementY;
            self.setDirty(true);
        }

        function mousedown() {
            canvas.focus();
            canvas.addEventListener('mousemove', mousemove);
            canvas.addEventListener('mouseup', mouseup);
        }

        function mouseup() {
            canvas.removeEventListener('mousemove', mousemove);
            canvas.removeEventListener('mouseup', mouseup);
        }

        canvas.addEventListener('mousedown', mousedown);

        canvas.addEventListener('keydown', (event: KeyboardEvent) => {
            this.icon.onKeyboard(event);
            this.setDirty(true);
        })
        canvas.addEventListener('wheel', (event: WheelEvent) => {
            const v = 0.01 * event.deltaY;
            icon.changeScale(v);
            this.setDirty(true);
        })
    }

    private _loop() {
        if (this.dirty) {
            this.update();
            this.setDirty(false);
        }
        requestAnimationFrame(this._loop.bind(this))
    }

    update() {
        this.reset();
        this.nodes.forEach(node => {
            node.draw(this.context);
        })
    }

    reset() {
        this.context.fillStyle = 'white';
        this.context.strokeStyle = 'white';
        const { width, height } = this.canvas;
        this.context.clearRect(0, 0, width, height);
        this.context.strokeRect(0, 0, width, height);
        this.context.fillRect(0, 0, width, height);
    }

    cutRoundedRect(ctx, radius, x, y, w, h) {
        var left = x;
        var top = y;
        var right = x + w;
        var bottom = y + h;

        ctx.globalCompositeOperation = 'destination-in';
        ctx.fillStyle = 'black';

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
    };

    save() {
        this.canvas.toBlob((blob) => {
            fileSaver(blob, 'test.png')
        }, 'image/png')
    }

    async loadIcon(base64) {
        await this.icon.initWithBase64(base64);
        this.setDirty(true)
    }

    async loadCorner(base64) {
        await this.corner.initWithBase64(base64);
        this.setDirty(true)
    }

}

const CanvasInstance = new Canvas();
export default CanvasInstance;