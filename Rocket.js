import Debris from "./Debris.js";
import StageObject from "./StageObject.js";
import { angleDistanceFrom, random, randomFloat } from "./Utils.js";

const SPEED = 320 / 1000;

export default class Rocket extends StageObject {
    constructor(ctx, stage, origin, target) {
        super(ctx, stage);
        this.origin = origin;
        this.target = target;
    }

    launch() {
        [this.angle, this.distanceToTarget] = angleDistanceFrom(this.origin, this.target);
        this.sub(this.stage.register(this));
        this.ctx.sounds.play.launch1();
    }

    nextFrame(t) {
        const dist = SPEED * t;
        if (dist + 8 > this.distanceToTarget) {
            this.detonate();
            return;
        }
        this.shedSomeDebris(dist);
        this.drawTarget(this.ctx.front);
        this.drawRocket(dist, this.ctx.front);
    }

    detonate() {
        this.ctx.sounds.play.exp1();
        this.stage.addExplosion(this.target);
        this.dispose();
    }

    shedSomeDebris(d) {
        const center = {
            x: this.origin.x + Math.floor(d * Math.sin(this.angle)),
            y: this.origin.y + Math.floor(d * Math.cos(this.angle))
        };

        const amplitude = 3 * Math.sin(d / 30 * Math.PI);
        const count = random(1, 2);
        for (let i = 0; i < count; i++) {
            this.shedDebris({
                x: center.x + amplitude * Math.sin(this.angle) + randomFloat(-2, 2),
                y: center.y + amplitude * Math.cos(this.angle) + randomFloat(-2, 2)
            });
        }
    }

    shedDebris(point) {
        const debris = new Debris(this.ctx, this.stage, point);
        debris.shed();
    }


    drawTarget(front) {
        front.strokeStyle = '#444';
        front.lineWidth = 1;
        front.beginPath();
        front.moveTo(this.target.x - 4, this.target.y);
        front.lineTo(this.target.x + 4, this.target.y);
        front.stroke();
        front.beginPath();
        front.moveTo(this.target.x, this.target.y - 4);
        front.lineTo(this.target.x, this.target.y + 4);
        front.stroke();
    }

    drawRocket(dist, front) {
        front.translate(this.origin.x, this.origin.y);
        front.rotate(Math.PI - this.angle);
        front.drawImage(this.ctx.images.rocket, -6, -11 - dist);
        front.setTransform(1, 0, 0, 1, 0, 0);
    }
};