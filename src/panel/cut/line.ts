import tinycolor from "tinycolor2";
import * as  svgdotjs from "@svgdotjs/svg.js";
import { Point } from "./type";

export class Line {
    private line1: svgdotjs.Line | null = null;
    private line2: svgdotjs.Line | null = null;

    constructor(draw: svgdotjs.Container, p1: Point, p2: Point) {
        const normalColor = '#ff0000';

        function mouseMove(event: MouseEvent) {
            //cb && cb(event)
        }

        function mouseUp() {
            line1.stroke({ color: normalColor })
            document.removeEventListener('mousemove', mouseMove);
            document.removeEventListener('mouseup', mouseUp);
        }

        const group = draw.group();
        let line1 = draw.line(p1.x, p1.y, p2.x, p2.y).stroke({ width: 1, color: normalColor });
        let line2 = draw.line(p1.x, p1.y, p2.x, p2.y).stroke({ width: 8, color: normalColor, opacity: 0 })
        if (p1.x === p2.x) {
            group.attr('cursor', 'col-resize');
        } else {
            group.attr('cursor', 'row-resize');
        }
        group.on('mousedown', () => {
            line1.stroke({ color: tinycolor(normalColor).brighten(40).toString('hex6') })
            document.addEventListener('mousemove', mouseMove);
            document.addEventListener('mouseup', mouseUp);
        })
        group.add(line1)
        group.add(line2);
        this.line1 = line1;
        this.line2 = line2;
    }

    updateLine(p1: Point, p2: Point) {
        this.line1?.plot(p1.x, p1.y, p2.x, p2.y);
        this.line2?.plot(p1.x, p1.y, p2.x, p2.y);
    }
}