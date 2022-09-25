export default class Sounds {
    constructor() {
        this.enabled = false;
        const names = ['alarm', 'bl', 'boom', 'chime', 'exp1', 'exp2', 'exp3', 'launch1', 'rumble', 'russianmir1', 'sdi'];
        this.play = {};
        this.loop = {};
        names.map(n => {
            const sound = new Audio(`sfx/${n}.wav`);
            const list = [];
            const availableAudio = () => {
                let available = list.find(s => s.ended);
                if (!available) {
                    available = sound.cloneNode();
                    list.push(available);
                }
                return available;
            };
            this.play[n] = (opt = {}) => {
                if (!this.enabled) {
                    return;
                }
                const audio = availableAudio();
                const volume = opt.volume;
                if (volume) {
                    audio.volume = volume;
                }
                audio.loop = !!opt.loop;
                audio.play();
                return audio;
            };
        });
    }
};
