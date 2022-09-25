import { CITY_BOTTOM } from "./City.js";
import ParabollicDebris from "./ParabollicDebris.js";
import StageObject from "./StageObject.js";
import { angleDistanceFrom, random, randomFloat, roundToNearest, WIDTH } from "./Utils.js";
import Wake from "./Wake.js";

const MAX_WIGGLE_HALF_ANGLE = Math.PI / 15;
export default class Meteor extends StageObject {
    constructor(ctx, stage, opt, origin, size) {
        super(ctx, stage);
        this.opt = opt;
        this.origin = origin;
        this.size = size;
        this.donePromise = new Promise(accept => {
            this.sub({ dispose: () => accept(this.destroyed) });
        });
    }

    start() {
        this.target = this.selectTarget();
        if (!this.origin) {
            this.origin = this.selectOrigin();
        }
        if (this.size == null) {
            this.size = this.selectSize();
        }
        this.speed = randomFloat(...this.selectSpeedRange());
        this.image = this.ctx.images[`meteor${this.size}`];
        this.imageOffsetX = this.image.naturalWidth / 2;
        this.imageOffsetY = this.image.naturalHeight / 2;

        [this.angle, this.distanceToTarget] = angleDistanceFrom(this.origin, this.target);
        this.splitDistances = this.selectSplitDistances(this.distanceToTarget);
        this.splitDistance = this.splitDistances.pop();

        this.sub(this.stage.register(this, 1));
        return this.donePromise;
    }

    selectSplitDistances(distanceToTarget) {
        if (this.size === 2 && Math.random() < this.opt.meteorSplitChance) {
            return [distanceToTarget * randomFloat(0.3, 0.8)];
        }
        return [];
    }

    selectSpeedRange() {
        return this.opt.meteorSpeedRange;
    }

    selectOrigin() {
        return {
            x: random(-5, WIDTH + 5),
            y: -5
        };
    }

    selectSize() {
        return random(1, 2);
    }

    selectTarget() {
        if (Math.random() < this.opt.meteorTargetCannonChance) {
            return [this.stage.cannonLeft, this.stage.cannonRight][random(0, 1)].origin;
        }
        else {
            return {
                x: random(...this.stage.city.targetXRange),
                y: CITY_BOTTOM - 20
            };
        }
    }

    get sizeAfterSplit() {
        return 1;
    }

    nextFrame(t) {
        const tm = roundToNearest(t, 60);
        const dist = this.speed * tm;
        const extents = this.extents(dist);
        const location = {
            x: extents.x0 + this.imageOffsetX,
            y: extents.y0 + this.imageOffsetY
        };
        if (this.stage.explosionWithin(extents)) {
            this.detonate(location);
            return;
        }
        if (dist >= this.distanceToTarget) {
            this.targetReached();
            return;
        }
        if (tm !== this.last) {
            this.wiggleAngle = randomFloat(-MAX_WIGGLE_HALF_ANGLE, MAX_WIGGLE_HALF_ANGLE);
            this.last = tm;
        }
        const tw = roundToNearest(t, 70);
        if (tw != this.lastWakeTime) {
            if (this.lastWakeTime) {
                this.makeWake(this.getLocation(dist - this.imageOffsetY * 0.5));
            }
            this.lastWakeTime = tw;
        }

        if (this.splitDistance && dist >= this.splitDistance) {
            const meteor = new Meteor(this.ctx, this.stage, this.opt, location, 1);
            this.stage.objectFactory.addMeteorPromise(meteor.start());
            this.splitDistance = this.splitDistances.pop();
            this.size = this.sizeAfterSplit;
            this.image = this.ctx.images[`meteor${this.size}`];
        }

        this.draw(dist, this.ctx.front);
    }

    getLocation(d) {
        return {
            x: this.origin.x + Math.floor(d * Math.sin(this.angle)),
            y: this.origin.y + Math.floor(d * Math.cos(this.angle))
        };
    }

    extents(d) {
        const l = this.getLocation(d);
        return {
            x0: l.x - this.imageOffsetX,
            y0: l.y - this.imageOffsetY,
            x1: l.x + this.imageOffsetX,
            y1: l.y + this.imageOffsetY
        };
    }

    makeWake(location) {
        const wake = new Wake(this.ctx, this.stage, location.x, location.y, this.image.naturalWidth, this.angle);
        wake.start(this.donePromise);
    }

    draw(dist, front) {
        front.translate(this.origin.x, this.origin.y);
        front.rotate(Math.PI - this.angle);
        front.translate(0, -dist);
        front.rotate(this.wiggleAngle + Math.PI);
        front.drawImage(this.image, -this.imageOffsetX, - this.imageOffsetY);
        front.setTransform(1, 0, 0, 1, 0, 0);
    }

    targetReached() {
        this.makeImpact();
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
        this.shedDebris(location);
        this.dispose();
    }

    shedDebris(location) {
        const count = random(10, 15);
        for (let i = 0; i < count; i++) {
            const debris = new ParabollicDebris(this.ctx, this.stage, location);
            debris.shed();
        }
    }
};