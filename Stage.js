import Cannon from './Cannon.js';
import Explosion from './Explosion.js';
import ObjectFactory from './ObjectFactory.js';
import { WIDTH } from './Utils.js';

export default class Stage {
    constructor(ctx, city) {
        this.ctx = ctx;
        this.city = city;
        this.objects = [];
        this.cannonLeft = new Cannon(ctx, this, 'left', this.ctx.session.leftAmmo);
        this.cannonRight = new Cannon(ctx, this, 'right', this.ctx.session.rightAmmo);
        this.sdi = null;
        this.targets = null;
        this.comets = null;
        this.objectFactory = new ObjectFactory(ctx, this, city.options());
        this.planes = null;
        this.rogueSdis = null;
        this.sats = null;
        this.rockets = null;
        this.explosions = [];
        this.finished = false;
        this.lostTime = 0;
    }

    objectsAtLevel(level) {
        let objects = this.objects[level];
        if (!objects) {
            objects = [];
            this.objects[level] = objects;
        }
        return objects;
    }

    register(o, level = 0) {
        const objects = this.objectsAtLevel(level);
        objects.push(o);
        return {
            dispose: () => {
                this.objects[level] = this.objects[level].filter(i => i !== o);
            }
        };
    }

    addExplosion(target) {
        const explosion = new Explosion(this.ctx, this, target);
        this.explosions.push(explosion);
        explosion.start();
    }

    removeExplosion(explosion) {
        this.explosions = this.explosions.filter(e => e !== explosion);
    }

    explosionWithin(t) {
        return this.explosions
            .map(explosion => explosion.extents)
            .filter(extents => extents)
            .some(e => !(e.x1 < t.x0 || t.x1 < e.x0 || e.y1 < t.y0 || t.y1 < e.y0));
    }

    destroyAsset(x) {
        if ( x <= 26) {
            this.cannonLeft.destroy();
        }
        else if (x > WIDTH - 26) {
            this.cannonRight.destroy();
        }
        else {
            this.city.destroySection(x);
        }
    }

    start() {
        document.addEventListener('visibilitychange', e => {
            if(document.hidden) {
                this.lastHidden = e.timeStamp;
            }
            else {
                this.lostTime += e.timeStamp - this.lastHidden;
                this.lastHidden = null;
            }
        });

        return new Promise(accept => {
            const sub = this.ctx.addKeyDownListener(e => {
                if (e.keyCode === 13) {
                    sub.dispose();
                    this.finished = true;
                }
            });
            this._nextFrame = ts => {
                this.ctx.front.clear();
                if (this.finished) {
                    accept();
                    return;
                }
                ts -= this.lostTime;
                this.objects.forEach(level => {
                    if (level) {
                        level.forEach(o => o.frame(ts));
                    }
                });
                requestAnimationFrame(this._nextFrame);
            };
            requestAnimationFrame(this._nextFrame);
        }).then(() => {
            this.cannonLeft.dispose();
            this.cannonRight.dispose();
        });
    }
}