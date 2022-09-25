import Debris from "./Debris.js";
import { randomFloat, random } from "./Utils.js";

export default class ParabollicDebris extends Debris {
    selectDuration() {
        return 2000;
    }

    speedXAt(t, currentSpeedX) {
        return currentSpeedX ? currentSpeedX : randomFloat(-30, 30);
    }

    speedYAt(t, currentSpeedY) {
        return t === 0 ? randomFloat(-60, 0) : currentSpeedY + t / 1000 * 2 - 4 * Math.pow(t / this.duration, 2);
    }
}