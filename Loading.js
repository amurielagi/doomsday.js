import {WIDTH} from './Utils.js';

export default class Loading {
    constructor(next, ctx) {
        this.next = next;
        this.ctx = ctx;
    }

    show() {
        const promise = this.untilNextScreenFullyLoaded();
        this._wiped = false;
        return this._wipeOut()
            .then(() => {
                this.showEmptyLoading();
            })
            .then(() => promise)
            .then(() => {
                this.ctx.back.clear();
                return this.next.show(this.ctx);
            })
            .catch(e => {
                if (e) {
                    console.error(e);
                }
                return Promise.reject(e);
            });
    }

    _wipeOut() {
        return new Promise(accept => {
            this.ctx.mid.doWipe(5, 0, WIDTH, accept, 'black');
        }).then(() => {
            this.ctx.mid.clear();
            this._wiped = true;
        });
    }

    untilNextScreenFullyLoaded() {
        return this.next.loaded().then(value => {
            this.updateLoadingProgress(value);
            if (value < 1) {
                return this.untilNextScreenFullyLoaded();
            }
        });
    }

    showEmptyLoading() {
        this.ctx.front.clear();
        this.ctx.mid.clear();
        this.ctx.back.clear();

        this.ctx.back.flood('black');
        this.ctx.back.strokeStyle = 'white';
        this.ctx.back.fillStyle = 'white';
        this.ctx.back.lineWidth = 5;
        this.ctx.back.strokeRect(40, 165, 370, 30);
    }

    updateLoadingProgress(value) {
        if (this._wiped) {
            this.ctx.back.fillStyle = 'white';
            this.ctx.back.fillRect(40, 165, 370 * value, 30);
        }
    }
};
