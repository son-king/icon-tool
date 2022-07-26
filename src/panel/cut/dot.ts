import tinycolor from "tinycolor2";
import * as  svgdotjs from "@svgdotjs/svg.js";
import { Point } from "./type";

export class Dot {
    private circle: svgdotjs.Circle | null = null;
    private radius = 8;

    constructor(draw: svgdotjs.Container, p: Point, cursor: string, cb: Function = null) {
        function mouseMove(event: MouseEvent) {
            //cb && cb(event)
        }

        function mouseUp() {
            circle.stroke({ color: normalColor }).fill(normalColor)
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('mouseup', mouseUp);
        }

        const normalColor = '#656519';
        const circle = draw.circle(this.radius).move(p.x - this.radius / 2, p.y - this.radius / 2).fill(normalColor);
        circle.attr('cursor', cursor);
        circle.attr('pointer-events', 'bounding-box');
        circle.on('mousedown', () => {
            const color = tinycolor(normalColor).brighten(40).toString('hex6')
            circle.stroke({ color }).fill(color);
            document.addEventListener('mousemove', mouseMove);
            document.addEventListener('mouseup', mouseUp);
        })
        this.circle = circle;
    }

    updatePos(pos: Point) {
        this.circle?.move(pos.x - this.radius / 2, pos.y - this.radius / 2);
    }
}