export default class Sprite {
    constructor(spriteSheet, cols, rows, frameRate, loop = true) {
        this.frameTime = 0;
        this.isComplete = false;
        this.spriteSheet = spriteSheet;
        this.rows = rows;
        this.cols = cols;
        this.frameRate = frameRate;
        this.loop = loop;
    }
    static load(filePath, cols, rows, frameRate, callback) {
        loadImage(filePath, result => {
            callback(new Sprite(result, cols, rows, frameRate));
        });
    }
    get frameWidth() { return this.spriteSheet.width / this.cols; }
    get frameHeight() { return this.spriteSheet.height / this.rows; }
    update() {
        if (this.isComplete)
            return;
        const loopTime = (this.rows * this.cols) / this.frameRate;
        this.frameTime = (this.frameTime + (deltaTime / 1000));
        if (this.frameTime >= loopTime) {
            if (this.loop) {
                this.frameTime -= loopTime;
            }
            else {
                this.frameTime = loopTime;
                this.isComplete = true;
            }
        }
    }
    draw(x, y, width, height, rot = 0) {
        const { spriteSheet, cols, frameWidth, frameHeight, frameRate, frameTime } = this;
        const frameIndex = floor(frameTime * frameRate);
        const xFrame = frameIndex % cols;
        const yFrame = floor(frameIndex / cols);
        const sx = frameWidth * xFrame;
        const sy = frameHeight * yFrame;
        push();
        {
            translate(x, y);
            rotate(rot);
            imageMode(CENTER);
            image(spriteSheet, 0, 0, width ?? frameWidth, height ?? frameHeight, sx, sy, frameWidth, frameHeight);
        }
        pop();
    }
}
//# sourceMappingURL=sprite.js.map