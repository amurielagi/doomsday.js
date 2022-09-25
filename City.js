import GameScreen from "./GameScreen.js";
import Stage from './Stage.js';
import { averageColor, colorBetween } from "./Utils.js";

export const CITY_BOTTOM = 342;

export default class City extends GameScreen {
    constructor(name, id, ruinsOffset, day) {
        super();
        this.name = name;
        this.id = id;
        this.ruinsOffset = ruinsOffset;
        this.day = day;
        this.images = ['ruin2.gif', 'ruin3.gif', 'ruin4.gif', 'ruin5.gif', 'ruin6.gif', 'back.jpg'].map(n => {
            return {
                path: `gfx/${id}/${n}`,
                loaded: false,
                image: null
            };
        });
    }

    options() {
        return {
            meteorCount: 20,
            meteorRespiteRange: [1000, 3000],
            meteorSpeedRange: [40 / 1000, 60 / 1000],
            meteorSplitChance: 0.2,
            meteorTargetCannonChance: 0.2,
            cometSpeedRange: [80 / 1000, 100 / 1000],
            cometRunMeteorCountRange: [3,8],
            cometCountRange: [2, 4],
            cometRespiteRange: [5000, 10000],
            satelliteSpeedRange: [100 / 1000, 150 / 1000],
            satelliteCountRange: [5, 10],
            satelliteRespiteRange: [3000, 5000]
        };
    }

    drawBackground() {
        this.ctx.back.drawImage(this.images[5].image, 0, 0);
        this.ctx.back.drawImage(this.ctx.images.gun_left2, 0, 307);
        this.ctx.back.drawImage(this.ctx.images.gun_right2, 424, 307);
    }

    intro() {
        this.ctx.mid.drawImage(this.ctx.images.gun_left2, 0, 307);
        this.ctx.mid.drawImage(this.ctx.images.gun_right2, 424, 307);
        this.ctx.back.drawImage(this.images[5].image, 0, 0);
        return Promise.resolve();
    }

    outtro() {
        return Promise.resolve();
    }

    preStart() {
        return Promise.resolve();
    }

    stageResults() {
        return Promise.resolve();
    }

    stageLoop() {
        return new Stage(this.ctx, this).start();
    }

    screenLoop() {
        return this.intro()
            .then(() => this.preStart())
            .then(() => this.stageLoop())
            .then(() => this.stageResults())
            .then(() => this.outtro());
    }

    destroySection(x) {
        let sectionStart = this.ruinsOffset;
        for (let i = 0; i < 5; i++) {
            const image = this.images[i].image;
            const sectionEnd = sectionStart + image.naturalWidth;
            if (x >= sectionStart && x < sectionEnd ) {
                this.showRuins(i);
                return;
            }
            sectionStart = sectionEnd;
        }
    }

    showRuins(index) {
        const image = this.images[index].image;
        const x = this.images
            .filter((img, i) => i < index)
            .reduce((s, img) => s + img.image.naturalWidth, this.ruinsOffset);
        this.ctx.back.drawImage(image, x, CITY_BOTTOM - image.naturalHeight);
    }

    get targetXRange() {
        if (!this._targetXRange) {
            this._targetXRange = [
                this.ruinsOffset,
                this.images.slice(0, 5).reduce((s, img) => s + img.image.naturalWidth, this.ruinsOffset)
            ];
        }
        return this._targetXRange;
    }

    get skyColor() {
        if(!this._skyColor) {
            const imageData = this.ctx.back.getImageData(0,0,2,2);
            this._skyColor = colorBetween(averageColor(imageData.data), [0,0,0,255], 0.1);
        }
        return this._skyColor;
    }
};
