import GameScreen from "./GameScreen.js";

export default class TitleScreen extends GameScreen {
    constructor() {
        super();
        this.images = ['day1.gif', 'day2.gif', 'day3.gif', 'day4.gif', 'title.gif', 'muted.png', 'unmuted.png'].map(n => {
            return {
                path: `gfx/title/${n}`,
                loaded: false,
                image: null
            };
        });
        this.days = [
            [42, 256, 80, 86, 0],
            [133, 255, 80, 86, 2],
            [230, 256, 80, 86, 5],
            [327, 257, 80, 86, 8]
        ]
        this.subs = [];
    }

    drawMuteButton() {
        const index = this.ctx.sounds.enabled ? 6 : 5;
        this.ctx.back.drawImage(this.images[index].image, 424, 344, 14, 14);
    }

    drawBackground() {
        this.ctx.back.drawImage(this.images[4].image, 0, 0);
        this.drawMuteButton();
    }

    screenLoop() {
        return new Promise(accept => {
            const ctx = this.ctx;
            ctx.session.reset();
            const sub = ctx.addButtonListener(424, 344, 14, 14, {
                onMouseDown: () => {
                    ctx.sounds.enabled = !ctx.sounds.enabled;
                    this.drawMuteButton();
                }
            });
            this.subs.push(sub);
            this.days.forEach((c, i) => {
                const sub = ctx.addButtonListener(c[0], c[1], c[2], c[3], {
                    onMouseOut: () => {
                        ctx.mid.clear();
                    },
                    onMouseOver: e => {
                        ctx.mid.drawImage(this.images[i].image, c[0], c[1]);
                        ctx.sounds.play.chime();
                    },
                    onMouseDown: () => {
                        this.subs.forEach(sub => sub.dispose());
                        this.subs.length = 0;
                        accept(c[4]);
                    }
                });
                this.subs.push(sub);
            });
        });
    }
};
