import StageObject from "./StageObject.js";
import { random, limit, randomFloat } from "./Utils.js";

const INITIAL_VERTICAL_SPEED = 50;

export default class Debris extends StageObject {
    constructor(ctx, stage, { x, y }) {
        super(ctx, stage);
        this.x = x;
        this.y = y;
    }

    shed() {
        this.duration = this.selectDuration();
        this.angle = Math.PI * Math.random();
        this.size = random(1, 3);
        this.color = this.stage.city.day ? 60 : 190;
        this.sub(this.stage.register(this));
    }

    nextFrame(t) {
        if (t === 0) {
            this.last = t;
        }
        if (t > this.duration) {
            this.dispose();
            return;
        }
        this.draw(this.ctx.front, t);

        this.speedX = this.speedXAt(t, this.speedX);
        this.speedY = this.speedYAt(t, this.speedY);
        const frameLength = t - this.last;
        this.x += frameLength * this.speedX / 1000;
        this.y += frameLength * this.speedY / 1000;
        this.last = t;
    }

    selectDuration() {
        return random(1000, 1500);
    }

    speedYAt(t, currentSpeedY) {
        return INITIAL_VERTICAL_SPEED * (1 - t / this.duration);
    }
    speedXAt(t, currentSpeedX) {
        if(t === 0) {
            return randomFloat(-20, 20);
        }
        return limit(currentSpeedX + randomFloat(-5, 5), -20, 20);
    }

    draw(front, t) {
        front.translate(this.x, this.y);
        front.rotate(this.angle);
        front.strokeStyle = `rgba(${this.color},${this.color},${this.color},${1 - t / this.duration})`;
        front.lineWidth = 1;
        front.beginPath();
        front.moveTo(- 3, 0);
        front.lineTo(this.size - 3, 0);
        front.stroke();
        front.setTransform(1, 0, 0, 1, 0, 0);
    }
};