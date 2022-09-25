import Meteor from "./Meteor.js";
import { random, randomFloat, WIDTH } from "./Utils.js";

export default class Comet extends Meteor {
    constructor(...args) {
        super(...args);
        this.left = random(0, 1);
        this.points = [
            {
                x: -20,
                y: random(100, 200)
            },
            {
                x: WIDTH + 20,
                y: random(100, 200)
            }
        ];
    }

    selectSplitDistances(distanceToTarget) {
        const count = random(...this.opt.cometRunMeteorCountRange);
        const segment = distanceToTarget / count;
        let dist = 0;
        const list = [];
        for (let i = count - 1; i >= 0; i--) {
            const end = dist + segment;
            list[i] = randomFloat(dist, end);
            dist = end;
        }
        return list;
    }

    selectSpeedRange() {
        return this.opt.cometSpeedRange;
    }

    selectSize() {
        return 3;
    }

    selectOrigin() {
        return this.left ? this.points[1] : this.points[0];
    }


    selectTarget() {
        return this.left ? this.points[0] : this.points[1];
    }

    get sizeAfterSplit() {
        return 3;
    }

    targetReached() {
        this.dispose();
    }
};