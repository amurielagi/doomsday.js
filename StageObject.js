
export default class StageObject {
    constructor(ctx, stage) {
        this.ctx = ctx;
        this.stage = stage;
        this._subs = [];
        this._firstFrameTime = null;
    }

    sub(subscription) {
        this._subs.push(subscription);
    }

    dispose() {
        this._subs.forEach(s => s.dispose());
        this._subs.length = 0;
    }

    frame(t) {
        if (this._firstFrameTime === null) {
            this._firstFrameTime = t;
        }
        this.nextFrame(t - this._firstFrameTime);
    }
}