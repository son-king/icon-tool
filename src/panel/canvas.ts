import fileSaver from 'file-saver'
import Sprite from './sprite'
import Node from './node'
import { CornerPosition } from "./data";

export class Canvas {
    public context: CanvasRenderingContext2D;
    private canvas: HTMLCanvasElement;
    private icon: Sprite = new Sprite(this);
    private corner: Sprite = new Sprite(this);
    private dirty = false;
    private nodes: Node[] = [];
    public cornerPosition: CornerPosition = CornerPosition.RightTop;
    public scale = 1;

    constructor() {
        this.corner.showBoard = false;
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

    private _updateCorner() {
        if (this.corner.isValid() && this.icon.isValid()) {
            const { width: iconWidth, height: iconHeight } = this.icon.getContentSize();
            const { x: iconX, y: iconY } = this.icon;
            const { width: cornerWidth, height: cornerHeight } = this.corner.getContentSize();
            let cornerX = iconX, cornerY = iconY;
            switch (this.cornerPosition) {
                case CornerPosition.LeftBottom:
                    cornerX = iconX;
                    cornerY = iconY + iconHeight-cornerHeight;
                    break;
                case CornerPosition.LeftTop:
                    cornerX = iconX;
                    cornerY = iconY;
                    break;
                case CornerPosition.RightBottom:
                    cornerX = iconX + iconWidth - cornerWidth;
                    cornerY = iconY + iconHeight - cornerHeight;

                    break;
                case CornerPosition.RightTop:
                    cornerX = iconX + iconWidth - cornerWidth;
                    cornerY = iconY;
                    break;
            }
            this.corner.x = cornerX;
            this.corner.y = cornerY;
        }

    }

    updateRadius(enabled, radius) {
        this.icon.radius = radius;
        this.icon.enabledRound = enabled;
        this.setDirty(true);
    }

    updateCornerPosition(position: CornerPosition) {
        this.cornerPosition = position;
        this.setDirty(true);
    }

    updateCornerEnabled(enabled: boolean) {
        this.corner.visible = enabled;
        this.setDirty(true);

    }

    private setDirty(b) {
        this.dirty = b;
    }

    private initTouch() {
        const { icon, corner, canvas, nodes } = this;
        const self = this;

        function mousemove(event: MouseEvent) {
            nodes.forEach(node => {
                node.onMove(event)
            })
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
            this.scale += v;
            if (this.scale <= 0) {
                this.scale = 0;
            }
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
        this._updateCorner();
        this.nodes.forEach(node => {
            if (node.visible) {
                node.draw(this);
            }
        })
    }

    reset() {
        const color = '#777777';
        this.context.fillStyle = color;
        this.context.strokeStyle = color;
        const { width, height } = this.canvas;
        this.context.clearRect(0, 0, width, height);
        this.context.strokeRect(0, 0, width, height);
        this.context.fillRect(0, 0, width, height);
    }


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