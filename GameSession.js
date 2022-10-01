import Magazine from "./Magazine.js";
import MagazineView from "./MagazineView.js";

export default class GameSession {
    constructor() {
        this.leftMagazine = new Magazine();
        this.leftMagazineView = new MagazineView(this.leftMagazine);
        this.rightMagazine = new Magazine();
        this.rightMagazineView = new MagazineView(this.rightMagazine);
    }

    reset() {
        this.leftMagazine.reset();
        this.rightMagazine.reset();
    }

    set citySafePercent(value) {
        this.lastCitySafePercent = value;
        let ammo = this.leftMagazine.count + this.rightMagazine.count + value;
        this.leftMagazine.count = ammo / 2;
        this.rightMagazine.count = ammo - this.leftMagazine.count
    }

    drawMagazineView(drawingCtx) {
        this.leftMagazineView.draw(drawingCtx);
        this.rightMagazineView.draw(drawingCtx);
    }
};