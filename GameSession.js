import Magazine from "./Magazine.js";

export default class GameSession {
    constructor() {
        this.leftMagazine = new Magazine();
        this.rightMagazine = new Magazine();
    }

    reset() {
        this.leftMagazine.reset();
        this.rightMagazine.reset();
    }

    set citySafePercent(value) {
        this.lastCitySafePercent = value;
        let ammo = this.leftMagazine.count + this.rightMagazine.count + value;
        ammo = Math.min(ammo, 200);
        this.leftMagazine.count = Math.floor(ammo / 2);
        this.rightMagazine.count = ammo - this.leftMagazine.count
    }
};