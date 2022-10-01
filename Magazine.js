export default class Magazine {
    constructor() {
        this.reset();
    }
    
    reset() {
        this.ammo = 50;
    }

    set count(ammo) {
        this.ammo = ammo;
    }

    get count() {
        return this.ammo;
    }

    pop() {
        if (this.ammo > 0) {
            this.ammo--;
            return true;
        }
        return false;
    }
};