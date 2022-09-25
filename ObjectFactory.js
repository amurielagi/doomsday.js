import Comet from './Comet.js';
import FallingSatellite from './FallingSatellite.js';
import Meteor from './Meteor.js';
import StageObject from './StageObject.js';
import { randomFloat, random } from './Utils.js';

export default class ObjectFactory extends StageObject {
    constructor(ctx, stage, opt) {
        super(ctx, stage);
        this.opt = opt;
        this.meteorTimes = [];
        this.meteorPromise = Promise.resolve(0);
        this.activeMeteorCount = 0;
        this.start();
    }

    start() {
        let time = 0;
        for (let i = this.opt.meteorCount - 1; i >= 0; i--) {
            time += randomFloat(...this.opt.meteorRespiteRange);
            this.meteorTimes[i] = time;
        }
        this.nextMeteorTime = this.meteorTimes.pop();
        this.remainingComets = random(...this.opt.cometCountRange);
        this.remainingSats = random(...this.opt.satelliteCountRange);
        this.sub(this.stage.register(this));
    }

    scheduleNextComet() {
        if (this.remainingComets) {
            this.nextCometTime = this.last + randomFloat(...this.opt.cometRespiteRange);
        }
    }
    scheduleNextSatellite() {
        this.nextSatTime = null;
        if (this.remainingSats) {
            this.nextSatTime = this.last + randomFloat(...this.opt.satelliteRespiteRange);
        }
    }

    nextFrame(t) {
        this.last = t;
        if (t === 0) {
            this.scheduleNextComet();
            this.scheduleNextSatellite();
        }
        if (this.nextMeteorTime && t >= this.nextMeteorTime) {
            const meteor = new Meteor(this.ctx, this.stage, this.opt);
            this.addMeteorPromise(meteor.start());
            this.nextMeteorTime = this.meteorTimes.length ? this.meteorTimes.pop() : null;
        }

        if (this.nextCometTime && t >= this.nextCometTime) {
            const comet = new Comet(this.ctx, this.stage, this.opt);
            const done = comet.start();
            this.addMeteorPromise(done);
            this.nextCometTime = null;
            done.then(destroyed => this.handleCometDone(destroyed));
        }

        if (this.nextSatTime && t >= this.nextSatTime) {
            const sat = new FallingSatellite(this.ctx, this.stage, randomFloat(...this.opt.satelliteSpeedRange));
            sat.start();
            this.remainingSats--;
            this.scheduleNextSatellite();
        }

        if (this.finished) {
            this.dispose();
        }
    }

    handleCometDone(destroyed) {
        if (destroyed) {
            this.remainingComets--;
            this.scheduleNextComet();
        }
        else {
            this.nextCometTime = this.last + 1000;
        }
    }

    addMeteorPromise(p) {
        if (this.activeMeteorCount === 0) {
            this.rumble = this.ctx.sounds.play.rumble({ loop: true });
        }
        this.activeMeteorCount++;
        this.meteorPromise = this.meteorPromise.then(() => {
            return p.then(() => {
                this.activeMeteorCount--;
                if (this.activeMeteorCount <= 0) {
                    if (this.rumble) {
                        this.rumble.loop = false;
                    }
                }
            });
        });
    }

    get finished() {
        return !this.nextMeteorTime 
        && !this.remainingComets
        && !this.remainingSats 
        && !this.activeMeteorCount;
    }
};