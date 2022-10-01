import { MAX_AMMO } from "./Magazine.js";

export default class MagazineView {
    constructor(magazine, dir, ctx) {
        this.magazine = magazine;
        this.x0 = dir === 'left' ? 7 : 324;
        this.magazine.addChangeObserver(() => this.draw(ctx.mid));
        this.maxPerLine = MAX_AMMO / 2;
    }

    draw(drawingCtx) {
        drawingCtx.clearRect(this.x0, 359, 120, 8);
        drawingCtx.clearRect(this.x0, 351, 120, 8);

        let line1Count = 0;
        let line2Count = this.magazine.count;
        if (line2Count > this.maxPerLine) {
            line1Count = line2Count - this.maxPerLine;
            line2Count = this.maxPerLine;
        }
        this.drawLine(drawingCtx, 351, line1Count);
        this.drawLine(drawingCtx, 359, line2Count);
    }

    drawLine(drawingCtx, y, count) {
        drawingCtx.clearRect(this.x0, y, 8, 120);
        drawingCtx.fillStyle = "black";
        drawingCtx.fillRect(this.x0 + count * 3, y, 120 - 3 * count, 8);
    }
};