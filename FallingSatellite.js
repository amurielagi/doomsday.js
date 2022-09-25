import { CITY_BOTTOM } from "./City.js";
import StageObject from "./StageObject.js";
import { bezier, distanceTo, random, randomSign } from "./Utils.js";


export default class FallingSatellite extends StageObject {
    constructor(ctx, stage, speed) {
        super(ctx, stage);
        this.speed = speed;
    }

    start() {
        this.origin = {
            x: random(100, 350),
            y: -20
        };
        this.inflectionPoint = {
            x: this.origin.x + random(50, 70) * randomSign(),
            y: random(100, 200)
        };
        this.target = {
            x: this.origin.x + random(-50, 50),
            y: CITY_BOTTOM - 20
        };
        this.image = this.ctx.images.mir3;
        this.imageOffsetX = this.image.naturalWidth / 2;
        this.imageOffsetY = this.image.naturalHeight / 2;
        this.timeToTarget = distanceTo(this.origin, this.target) / this.speed;
        this.sub(this.stage.register(this));
        this.ctx.sounds.play.russianmir1();
    }

    extents(l) {
        return {
            x0: l.x - this.imageOffsetX,
            y0: l.y - this.imageOffsetY,
            x1: l.x + this.imageOffsetX,
            y1: l.y + this.imageOffsetY
        };
    }

    nextFrame(t) {
        const location = bezier(t / this.timeToTarget, this.origin, this.inflectionPoint, this.target);
        if (this.stage.explosionWithin(this.extents(location))) {
            this.detonate(location);
            return;
        }
        if (t >= this.timeToTarget) {
            this.makeImpact();
        }
        this.draw(location, this.ctx.front);
    }

    draw(location, front) {
        front.drawImage(this.image, location.x - this.imageOffsetX, location.y - this.imageOffsetY);
    }

    makeImpact() {
        this.ctx.sounds.play.exp2();
        this.stage.addExplosion(this.target);
        this.stage.destroyAsset(this.target.x);
        this.dispose();
    }

    detonate(location) {
        this.ctx.sounds.play.exp2();
        this.stage.addExplosion(location);
        this.destroyed = true;
        this.dispose();
    }
};