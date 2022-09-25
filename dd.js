/*
X day/night colors for debris
X wiggle of wake
X gradient of wake
X pausing game when window deactivated
X add favicon.ico
X figure out how to fit ruins
- animating flames on ruins
X falling meteors
X meteor wake
X meteor targeting cannons
X splitting meteors
X comet
X comet wake
X comet spawning meteors
X meteor-city area collision
X meteor-explosion collision
- city area initial explosion
X explosion debris
- planes
- plane-explosion collision
- plane destroyed animation
X falling sat
X falling sat-explosion collision
X falling sat destroyed animation
- rogue sat
- rogue sat-explosion collision
- rogue sat destroyed animation
- rogue sat shooting
- rogue sat laser city area destruction
X display towers
X animate cannons
X shoot rocket
X rocket wake
X temp rocket crosshair
X rocket explosion
- report remaining ammo
- report SDI
- shoot SDI click
- shoot SDI spacebar
- title intro
- city intro
- city saved outro
  - report stats
  - add earned ammo
  - add earned SDI
X city-city transition
- game over outro
- city specific configuration
  - event frequency
  - event total
  - speed of objects
- all cities saved game over
- keep score
  - negative points for planes destroyed
- blimp

*/
import GameContext from './GameContext.js';
import Loading from './Loading.js';
import City from './City.js';
import TitleScreen from './TitleScreen.js';

class Game {
    constructor() {
        this.main = new TitleScreen();
        this.cities = [
            new City('New York', 'ny', 36, false),
            new City('Vancouver', 'van', 29, true),
            new City('Chicago', 'chi', 35, true),
            new City('Budapest', 'bud', 30, false),
            new City('Edinburg', 'ed', 30, true),
            new City('Moscow', 'mos', 32, false),
            new City('Hong Kong', 'hk', 34, false),
            new City('London', 'lon', 33, false),
            new City('Los Angeles', 'la', 35, true),
            new City('New Orleans', 'newo', 29, false),
            new City('Paris', 'par', 31, true),
            new City('San Francisco', 'sf', 31, true),
            new City('Tokyo', 'to', 30, false),
        ];
        this.nextCity = 0;
    }


    start() {
        this.ctx = new GameContext();
        this.ctx.load().then(() => {
            this.showMain();
        });
    }

    showMain() {
        const loading = new Loading(this.main, this.ctx);
        loading.show(this.ctx).then(cityIndex => {
            this.nextCity = cityIndex;
            setTimeout(() => this.loadNextCity(), 0);
        });
    }

    loadNextCity() {
        const loading = new Loading(this.cities[this.nextCity], this.ctx);
        loading.show(this.ctx).then(
            () => {
                this.advanceToNextCity();
                setTimeout(() => this.loadNextCity(), 0);
            },
            e => {
                this.showMain();
            }
        );
    }

    advanceToNextCity() {
        this.nextCity = (this.nextCity + 1) % this.cities.length;
    }
}

const game = new Game();
window.addEventListener('load', () => game.start());
