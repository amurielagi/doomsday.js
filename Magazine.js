export const MAX_AMMO = 80;

export default class Magazine {
    constructor() {
        this.reset();
        this.observers = [];
    }
    
    reset() {
        this.ammo = 40;
    }

    set count(ammo) {
        this.ammo = Math.min(Math.max(0, Math.floor(ammo)), MAX_AMMO);
    }

    get count() {
        return this.ammo;
    }

    pop() {
        if (this.ammo > 0) {
            this.ammo--;
            this.observers.forEach(o => o());
            return true;
        }
        return false;
    }

    addChangeObserver(o) {
        this.observers.push(o);
        return {
            dispose: () => {
                this.observers = this.observers.filter(l => l !== o);
            }
        };

    }
};