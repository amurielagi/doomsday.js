import StageObject from "./StageObject.js";
import { random } from "./Utils.js";

const SPRITES = [
    [
        [12, 8, 18, 17],
        [49, 5, 23, 23],
        [89, 3, 24, 27],
        [129, 2, 26, 29],
        [165, 1, 30, 31],
        [205, 1, 30, 31],
        [245, 1, 32, 31],
        [285, 4, 30, 28],
        [325, 5, 30, 26],
        [365, 7, 32, 24],
        [407, 11, 30, 20],
        [447, 11, 28, 19],
        [488, 13, 25, 16],
        [532, 13, 18, 14],
        [583, 16, 3, 3]
    ],
    [
        [12, 8, 18, 17],
        [49, 5, 23, 23],
        [89, 3, 24, 27],
        [129, 2, 26, 29],
        [165, 1, 30, 31],
        [205, 1, 30, 31],
        [245, 1, 32, 31],
        [285, 1, 30, 28],
        [325, 2, 30, 26],
        [365, 2, 32, 24],
        [407, 2, 30, 20],
        [447, 3, 28, 19],
        [488, 4, 25, 16],
        [532, 6, 18, 14],
        [583, 14, 3, 3]
    ]
];

const SPRITE_TIME = 1420 / SPRITES[0].length;
export default class Explosion extends StageObject {
    constructor(ctx, stage, { x, y }) {
        super(ctx, stage);
        this.x = x;
        this.y = y;
        this.index = -1;
        this.spriteSetIndex = Math.random() > 0.5 ? 0 : 1;
    }

    start() {
        this.sub(this.stage.register(this, 2));
        this.ctx.sounds.play[`exp${random(1,3)}`]();
    }

    get spriteSet() {
        return SPRITES[this.spriteSetIndex];
    }

    get spriteSetImage() {
        return this.spriteSetIndex ? this.ctx.images.smallexps4noblack2 : this.ctx.images.smallexps4noblack;
    }

    nextFrame(t) {
        if (t >= this.spriteSet.length * SPRITE_TIME) {
            this.index = -1;
            this.stage.removeExplosion(this);
            this.dispose();
            return;
        }
        const last = this.index;
        this.index = Math.floor(t / SPRITE_TIME);
        if (last !== this.index) {
            this._extents = null;
        }
        this.drawSprite();
    }

    get extents() {
        if (this.index === -1) {
            return null;
        }
        if (!this._extents) {
            const sprite = this.spriteSet[this.index];
            const x0 = this.x - sprite[2] / 2;
            const y0 = this.y - sprite[3] / 2;
            this._extents = {
                x0,
                y0,
                x1: x0 + sprite[2],
                y1: y0 + sprite[3]
            };
        }
        return this._extents;
    }

    drawSprite() {
        const sprite = this.spriteSet[this.index];
        this.ctx.front.drawImage(this.spriteSetImage,
            ...sprite,
            this.extents.x0,
            this.extents.y0,
            sprite[2],
            sprite[3]);
    }
};