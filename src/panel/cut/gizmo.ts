import * as  svgdotjs from "@svgdotjs/svg.js";
import { Point } from "./type";
import tinycolor from "tinycolor2";
import { Line } from "./line";
import { Dot } from "./dot";

export class Gizmo {

    private draw: svgdotjs.Container;

    init() {
        this.draw = svgdotjs.SVG('#drawing') as svgdotjs.Container;
    }

    public updateBox(x, y, width, height) {
        const leftTop = new Point(x, y);
        const rightTop = new Point(x + width, y);
        const leftBottom = new Point(x, y + height);
        const rightBottom = new Point(x + width, y + height);
        new Line(this.draw, leftTop, rightTop);
        new Line(this.draw, rightTop, rightBottom);
        new Line(this.draw, rightBottom, leftBottom);
        new Line(this.draw, leftBottom, leftTop);
        new Dot(this.draw, leftTop, 'nesw-resize');
        new Dot(this.draw, leftBottom, 'nesw-resize');
        new Dot(this.draw, rightBottom, 'nwse-resize');
        new Dot(this.draw, rightTop, 'nwse-resize');
    }
}

