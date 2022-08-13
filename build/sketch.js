globalThis.windowResized = function () {
    resizeCanvas(windowWidth, windowHeight);
};
globalThis.setup = function () {
    createCanvas(windowWidth, windowHeight);
    pixelDensity(1);
};
globalThis.draw = function () {
    background(42);
};
//# sourceMappingURL=sketch.js.map