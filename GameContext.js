import DrawingContextWrapper from './DrawingContextWrapper.js';
import Sounds from './Sounds.js';

function trycall(c) {
    return c && c();
}

export default class GameContext {
    constructor() {
        this.session = {leftAmmo: 50, rightAmmo: 50};
        this.images = {};
        this.back = new DrawingContextWrapper('backCanvas');
        this.mid = new DrawingContextWrapper('midCanvas');
        this.front = new DrawingContextWrapper('frontCanvas');
        this.sounds = new Sounds();
        this.buttonListeners = [];
        this.mouseDownListeners = [];
        this.mouseMoveListeners = [];
        this.keyDownListeners = [];
        const front = document.getElementById('frontCanvas');
        front.addEventListener('mousedown', e => this._mouseDown(e));
        front.addEventListener('mouseout', e => this._mouseOut(e));
        front.addEventListener('mousemove', e => this._mouseMove(e));
        front.addEventListener('dragstart', e => e.preventDefault());
        front.addEventListener('selectstart', e => e.preventDefault());
        document.body.addEventListener('keydown', e => this._keyDown(e));
        document.body.oncontextmenu = () => false;
    }

    load() {
        return Promise.all([
            'aircraft1.gif', 'aircraft2.gif', 'aircraft3.gif', 'aircraft4.gif', 'blankblimp2.gif', 'generic.gif', 'gun_left2.gif', 'gun_right2.gif', 'launcher2.gif',
            'meteor1.gif', 'meteor2.gif', 'meteor3.gif', 'mir3.gif', 'rocket.gif', 'sat.gif', 'smallexps4noblack.gif', 'smallexps4noblack2.gif',
            'burn.gif', 'burn001.gif', 'burn002.gif', 'burn003.gif', 'burn004.gif', 'burn005.gif', 'burn006.gif', 'burn007.gif', 'burn008.gif', 'burn009.gif',
            'burn010.gif', 'burn011.gif', 'burn012.gif', 'burn013.gif', 'burn014.gif', 'burn015.gif'
        ].map(n => {
            return new Promise((accept, reject) => {
                const image = new Image();
                this.images[n.split('.')[0]] = image;
                image.onload = accept;
                image.onerror = reject;
                image.src = `gfx/${n}`;
            });
        }));
    }

    addButtonListener(x, y, width, height, obj) {
        const listener = { obj, x, y, width, height, out: true };
        this.buttonListeners.push(listener);
        return {
            dispose: () => {
                this.buttonListeners = this.buttonListeners.filter(l => l !== listener);
            }
        };
    }

    addMouseDownListener(callback) {
        this.mouseDownListeners.push(callback);
        return {
            dispose: () => {
                this.mouseDownListeners = this.mouseDownListeners.filter(l => l !== callback);
            }
        };
    }

    addMouseMoveListener(callback) {
        this.mouseMoveListeners.push(callback);
        return {
            dispose: () => {
                this.mouseMoveListeners = this.mouseMoveListeners.filter(l => l !== callback);
            }
        };
    }

    addKeyDownListener(callback) {
        this.keyDownListeners.push(callback);
        return {
            dispose: () => {
                this.keyDownListeners = this.keyDownListeners.filter(l => l !== callback);
            }
        };
    }

    _mouseObject(e) {
        return {
            e,
            x: e.clientX - e.target.offsetLeft,
            y: e.clientY - e.target.offsetTop
        };
    }
    _mouseWithin(button, m) {
        return button.x <= m.x && button.x + button.width >= m.x &&
            button.y <= m.y && button.y + button.height >= m.y;
    }

    _mouseDown(e) {
        const m = this._mouseObject(e);
        this.mouseDownListeners.forEach(l => l(m));
        this.buttonListeners
            .filter(l => this._mouseWithin(l, m))
            .forEach(l => {
                trycall(l.obj.onMouseDown);
            });
    }

    _mouseMove(e) {
        const m = this._mouseObject(e);
        this.mouseMoveListeners.forEach(l => l(m));
        const within = [];
        this.buttonListeners.forEach(l => {
            if (!this._mouseWithin(l, m)) {
                if (!l.out) {
                    l.out = true;
                    trycall(l.obj.onMouseOut);
                }
            }
            else {
                within.push(l);
            }
        });
        within.forEach(l => {
            if (l.out) {
                l.out = false;
                trycall(l.obj.onMouseOver);
            }
        });
    }

    _mouseOut(e) {
        this.buttonListeners.forEach(l => {
            if (!l.out) {
                l.out = true;
                trycall(l.obj.onMouseOut);
            }
        });
    }

    _keyDown(e) {
        this.keyDownListeners.forEach(l => l(e));
    }
};
