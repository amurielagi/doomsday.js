import Cannon from './Cannon.js';
import Explosion from './Explosion.js';
import ObjectFactory from './ObjectFactory.js';
import { WIDTH } from './Utils.js';

export default class Stage {
    constructor(ctx, city) {
        this.ctx = ctx;
        this.city = city;
        this.objects = [];
        this.cannonLeft = new Cannon(ctx, this, 'left', this.ctx.session.leftMagazine);
        this.cannonRight = new Cannon(ctx, this, 'right', this.ctx.session.rightMagazine);
        this.sdi = null;
        this.targets = null;
        this.comets = null;
        this.objectFactory = new ObjectFactory(ctx, this, city.options());
        this.planes = null;
        this.rogueSdis = null;
        this.sats = null;
        this.rockets = null;
        this.explosions = [];
        this.lostTime = 0;
        this.citySectionDestroyed = [false, false, false, false, false];
        this.explosionsObservers = [];
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

    addExplosionObserver(o) {
        this.explosionsObservers.push(o);
        setTimeout(() => o(this.explosions), 0);
        return {
            dispose: () => {
                this.explosionsObservers = this.explosionsObservers.filter(i => i !== o);
            }
        };
    }

    addExplosion(target) {
        const explosion = new Explosion(this.ctx, this, target);
        this.explosions.push(explosion);
        this.explosionsObservers.forEach(o => o(this.explosions));
        explosion.start();
    }

    removeExplosion(explosion) {
        this.explosions = this.explosions.filter(e => e !== explosion);
        this.explosionsObservers.forEach(o => o(this.explosions));
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

    setCitySectionDestroyed(index) {
        this.citySectionDestroyed[index] = true;
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

        return new Promise((accept, reject) => {
            var continueLoop = true;
            var factoryFinishedObserver = null;
            this._nextFrame = ts => {
                this.ctx.front.clear();
                ts -= this.lostTime;
                this.objects.forEach(level => {
                    if (level) {
                        level.forEach(o => o.frame(ts));
                    }
                });
                if (this.objectFactory.finished) {
                    if (!factoryFinishedObserver) {
                        var sub = null;
                        factoryFinishedObserver = explosions => {
                            if (explosions.length === 0) {
                                continueLoop = false;
                                sub.dispose();
                                accept();
                            }
                        };
                        sub = this.addExplosionObserver(factoryFinishedObserver);
                    }
                }
                if (this.citySectionDestroyed.indexOf(false) === -1) {
                    if (!this.gameOver) {
                        this.gameOver = true;
                        setTimeout(() => {
                            continueLoop = false;
                            this.disposeAll();
                            reject();
                        }, 2000);
                    }
                }
                if (continueLoop) {
                    requestAnimationFrame(this._nextFrame);
                }
            };
            requestAnimationFrame(this._nextFrame);
        }).then(() => {
            this.disposeAll();
        });
    }

    disposeAll() {
        this.ctx.session.lastCitySafePercent = this.citySectionDestroyed.filter(v => !v).length * 20;
        this.cannonLeft.dispose();
        this.cannonRight.dispose();
        this.objects.forEach(level => {
            if (level) {
                level.forEach(o => o.dispose());
            }
        });
    }
}