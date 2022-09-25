export const WIDTH = 450;
export const HEIGHT = 370;
export const DPI = window.devicePixelRatio;

export function random(begin, end) {
    return Math.floor(begin + (end - begin + 1) * Math.random());
}

export function randomFloat(begin, end) {
    return begin + (end - begin) * Math.random();
}

export function limit(n, min, max) {
    return n < min ? min : n > max ? max : n;
}

export function colorBetween(begin, end, endPercent) {
    const beginPercent = 1 - endPercent;
    return end.map((c, i) => Math.floor(c * endPercent + begin[i] * beginPercent));
}

export function averageColor(colors) {
    const a = [0, 0, 0, 0];
    let count = colors.length;
    for (let i = 0, j = 0; i < count; i++, j++) {
        if (j === 4) {
            j = 0;
        }
        a[j] += colors[i];
    }
    count = count / 4;
    for (let j = 0; j < 4; j++) {
        a[j] = Math.floor(a[j] / count);
    }
    return a;
}

export function alphaToFloat(alpha) {
    return alpha / 255;
}

export function distanceTo(p0, p1) {
    const deltaX = p1.x - p0.x;
    const deltaY = p1.y - p0.y;
    return Math.sqrt(deltaY * deltaY + deltaX * deltaX);
}

export function angleDistanceFrom(origin, target) {
    const deltaX = target.x - origin.x;
    const deltaY = target.y - origin.y;
    return [
        Math.atan2(deltaX, deltaY),
        Math.sqrt(deltaY * deltaY + deltaX * deltaX)
    ];
}

export function roundToNearest(t, period) {
    return Math.floor(t / period) * period;
}

function bezierCalculation(t, n0, n1, n2) {
    const omt = 1 - t;
    return omt * omt * n0 + 2 * omt * t * n1 + t * t * n2;
}

export function bezier(t, p0, p1, p2) {
    return {
        x: bezierCalculation(t, p0.x, p1.x, p2.x),
        y: bezierCalculation(t, p0.y, p1.y, p2.y)
    };
}

export function randomSign(positiveChance = 0.5) {
    return Math.random() < positiveChance ? 1 : -1;
}