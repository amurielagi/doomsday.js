import {WIDTH} from './Utils.js';

export default class GameScreen {
    show(ctx) {
        this.ctx = ctx;
        return this.wipeIn().then(() => this.screenLoop());
    }

    wipeIn() {
        this.ctx.mid.flood('black');
        this.drawBackground();
        return new Promise(accept => {
            this.ctx.mid.doWipe(-5, WIDTH - 5, 0, accept);
        });
    }

    loaded() {
        if (this._loadedCount() === 0) {
            this._doLoading();
        }
        return new Promise(accept => setTimeout(() => {
            accept(this._loadedCount() * 1.0 / this.images.length);
        }, 50));
    }

    _loadedCount() {
        return this.images.reduce(((c, i) => c + (i.loaded ? 1 : 0)), 0);
    }

    _doLoading() {
        const index = this.images.findIndex(i => !i.loaded);
        if (index === -1) {
            return;
        }
        const image = new Image();
        this.images[index].image = image;
        image.onload = () => {
            this.images[index].loaded = true;
            setTimeout((() => this._doLoading()), 0);
        };
        image.src = this.images[index].path;
    }
};
