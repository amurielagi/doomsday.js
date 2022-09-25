import StageObject from "./StageObject.js";
import { colorBetween, limit, random, randomFloat } from "./Utils.js";

export default class Wake extends StageObject {
    constructor(ctx, stage, x, y, size, angle) {
        super(ctx, stage);
        this.x0 = this.x = x;
        this.y0 = this.y = y;
        this.size = size;
        this.angle = angle;
    }

    start(meteorGone) {
        this.endColor = this.stage.city.skyColor;
        this.startColor = colorBetween([255, 255, 255, 255], this.endColor, 0.2);
        this.expansionDuration = 200;
        this.steadyTime = this.expansionDuration + 1000 * randomFloat(0.8, 1.2);
        this.vanishDuration = 3000 * randomFloat(0.5, 1.5);
        this.vanishTime = this.steadyTime + this.vanishDuration;
        this.goneTime = this.vanishTime + 1000;
        this.goneDuration = 1000 * randomFloat(0.8, 1.2);
        this.sub(this.stage.register(this));
        meteorGone.then(() => {
            if (this.lastTime) {
                this.goneTime = this.lastTime;
                this.vanishTime = this.goneTime + this.goneDuration;
                this.goneAlpha = this.lastArgs[2];
                this.goneSize = this.lastArgs[0];
            }
            else {
                this.dispose();
            }
        })
    }

    nextFrame(t) {
        let size, color, alpha, ellipse = false;
        if (t > this.vanishTime) {
            this.dispose();
            return;
        }
        else if (t >= this.goneTime) {
            const ratio = Math.abs(1 - (t - this.goneTime) / this.goneDuration);
            this.lastArgs[0] = this.goneSize * ratio;
            this.lastArgs[2] = this.goneAlpha * ratio;
            this.draw(this.ctx.front, ...this.lastArgs);
            return;
        }
        color = colorBetween(this.startColor, this.endColor, t / this.vanishTime);
        if (t < this.expansionDuration) {
            const ratio = t / this.expansionDuration;
            size = (this.size / 2) + ratio * this.size;
            alpha = 1;
        }
        else if (t < this.steadyTime) {
            size = this.size * 1.5 * randomFloat(0.9, 1.1);
            alpha = 1;
        }
        else {
            const ratio = (t - this.steadyTime) / this.vanishDuration;
            size = this.size * 1.5 - this.size / 2 * ratio;
            ellipse = true;
            alpha = 0.5 * (1 - ratio);
        }
        this.lastTime = t;
        this.lastArgs = [size, color, alpha, ellipse];
        this.draw(this.ctx.front, ...this.lastArgs);
    }

    draw(front, size, color, alpha, ellipse) {
        this.x = limit(this.x + randomFloat(-0.1, 0.1), this.x0 - 2, this.x0 + 2);
        this.y = limit(this.y + randomFloat(-0.1, 0.1), this.y0 - 2, this.y0 + 2);
        front.fillStyle = `rgba(${color[0]},${color[1]},${color[2]}, ${alpha})`;
        front.beginPath();
        if (ellipse) {
            front.ellipse(this.x, this.y, size * 0.4, size * 1.1, Math.PI - this.angle, 0, 2 * Math.PI);
        }
        else {
            front.arc(this.x, this.y, size / 2, 0, 2 * Math.PI);
        }
        front.fill();
    }
};