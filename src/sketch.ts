globalThis.windowResized = function (): void {
  resizeCanvas(windowWidth, windowHeight);
};

globalThis.setup = function (): void {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);
};

globalThis.draw = function (): void {
  background(42);
};
