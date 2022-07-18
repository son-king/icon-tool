import Node from "./node";

export default class Sprite extends Node {
    private img: HTMLImageElement = null;
    private width: number = 0;
    private height: number = 0;
    public x: number = 0;
    public y: number = 0;
    public scale: number = 1;
    private showBoard: boolean = true;

    initWithImage(img: HTMLImageElement) {

    }

    private _reset() {
        this.x = this.y = 0;
        this.width = this.height = 0;
        this.scale = 1;
        this.img = null;
    }

    async initWithBase64(data: string) {
        this._reset();
        this.img = await this._load(data);
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

    changeScale(v) {
        this.scale += v;
        if (this.scale <= 0) {
            this.scale = 0;
        }
    }

    draw(context: CanvasRenderingContext2D) {
        if (this.scale <= 0 || !this.img) {
            return;
        }
        const width = this.width * this.scale;
        const height = this.height * this.scale;
        if (width < 0 || height < 0) {
            return;
        }
        this.img && context.drawImage(this.img, this.x, this.y, width, height);
        if (this.showBoard) {
            const lineWidth = 1;
            context.lineWidth = lineWidth;
            context.strokeStyle = '#ff0000';
            context.strokeRect(this.x - lineWidth / 2, this.y - lineWidth / 2, width + lineWidth / 2, height + lineWidth / 2);
        }
    }
}