import { WIDTH, HEIGHT } from './Utils.js';
import StageObject from './StageObject.js';
import Rocket from './Rocket.js';

export default class Cannon extends StageObject {
    constructor(ctx, stage, dir, ammo) {
        super(ctx, stage);
        this.left = dir === 'left';
        this.mouseButton = this.left ? 1 : 3;
        this.ammo = ammo;
        this.sub(this.ctx.addMouseMoveListener(m => this.trackCrosshair(m)));
        this.sub(this.stage.register(this));
        this.sub(this.ctx.addMouseDownListener(m => this.shoot(m)));
        this.targetX = WIDTH / 2;
        this.targetY = HEIGHT / 2;
        this.origin = Object.freeze({
            y: HEIGHT - 55,
            x: this.left ? 16 : WIDTH - 16
        });
    }

    destroy() {
        this.dispose();
        this.ctx.mid.clearRect(this.left ? 0 : 424, 307, 26, 26);
    }

    trackCrosshair(m) {
        this.targetX = m.x;
        this.targetY = m.y;
    }

    changeAmmo(val) {
        this.ammo += val;
    }

    shoot(m) {
        if (m.e.which !== this.mouseButton) {
            return;
        }
        if (this.ammo <= 0) {
            this.ctx.sounds.play.boom();
            return;
        }
        this.changeAmmo(-1);
        const target = Object.freeze({ x: this.targetX, y: this.targetY });

        const rocket = new Rocket(this.ctx, this.stage, this.origin, target);
        rocket.launch();
    }

    nextFrame(t) {
        const deltaX = this.targetX - this.origin.x;
        const deltaY = this.origin.y - this.targetY;
        const angle = Math.atan2(deltaX, deltaY);
        this.ctx.front.translate(this.origin.x, this.origin.y);
        this.ctx.front.rotate(angle);
        this.ctx.front.drawImage(this.ctx.images.launcher2, -17, -26);
        this.ctx.front.setTransform(1, 0, 0, 1, 0, 0);
    }

}