import { WIDTH, HEIGHT, DPI } from './Utils.js';

export default class DrawingContextWrapper {
    constructor(id) {
        const canvas = document.getElementById(id);
        this.drawingCtx = canvas.getContext('2d');
        const ctxProto = Object.getPrototypeOf(this.drawingCtx);

        ['getImageData', 'arc', 'ellipse', 'fill', 'beginPath', 'moveTo', 'lineTo',
            'stroke', 'fillRect', 'drawImage', 'clearRect', 'strokeRect', 'rotate',
            'setTransform', 'translate', 'save', 'restore'].forEach(m => {
                this[m] = (...args) => this.drawingCtx[m](...args);
            });
        ['fillStyle', 'lineWidth', 'strokeStyle'].forEach(m => {
            const desc = Object.getOwnPropertyDescriptor(ctxProto, m);
            Object.defineProperty(this, m, {
                set: val => desc.set.call(this.drawingCtx, val),
                get: () => desc.get.call(this.drawingCtx)
            });
        });
    }
    flood(color) {
        this.drawingCtx.fillStyle = color;
        this.drawingCtx.fillRect(0, 0, WIDTH, HEIGHT);
    }
    clear() {
        this.drawingCtx.clearRect(0, 0, WIDTH, HEIGHT);
    }

    doWipe(delta, x, targetX, done, fillStyle) {
        let method = 'clearRect';
        if (fillStyle) {
            this.fillStyle = fillStyle;
            method = 'fillRect';
        }
        this[method](x, 0, x + Math.abs(delta), HEIGHT);
        if (x === targetX) {
            done();
            return;
        }
        setTimeout(() => this.doWipe(delta, x + delta, targetX, done, fillStyle), 10);
    }
};