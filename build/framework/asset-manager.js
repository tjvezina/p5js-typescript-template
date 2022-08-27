import { assert } from './debug.js';
const assetMap = new Map();
function getImagePath(fileName) { return `./assets/images/${fileName}`; }
function getSoundPath(fileName) { return `./assets/audio/${fileName}`; }
function getFontPath(fileName) { return `./assets/fonts/${fileName}`; }
function getModelPath(fileName) { return `./assets/models/${fileName}`; }
async function preloadAsset(path, loadFunc) {
    if (!assetMap.has(path)) {
        return new Promise(resolve => loadFunc(path, asset => {
            assetMap.set(path, asset);
            resolve();
        }));
    }
}
async function loadAsset(path, loadFunc, onComplete) {
    return Promise.resolve(preloadAsset(path, loadFunc)).then(() => {
        const asset = getAsset(path);
        onComplete?.(asset);
        return asset;
    });
}
function getAsset(path) {
    assert(assetMap.has(path), `Asset has not been loaded: ${path}`);
    return assetMap.get(path);
}
const AssetManager = {
    async preloadImage(fileName) {
        return preloadAsset(getImagePath(fileName), loadImage);
    },
    async preloadSound(fileName) {
        return preloadAsset(getSoundPath(fileName), loadSound);
    },
    async preloadFont(fileName) {
        return preloadAsset(getFontPath(fileName), loadFont);
    },
    async preloadModel(fileName) {
        return preloadAsset(getModelPath(fileName), loadModel);
    },
    async loadImage(fileName, onComplete) {
        return loadAsset(getImagePath(fileName), loadImage, onComplete);
    },
    async loadSound(fileName, onComplete) {
        return loadAsset(getSoundPath(fileName), loadSound, onComplete);
    },
    async loadFont(fileName, onComplete) {
        return loadAsset(getFontPath(fileName), loadFont, onComplete);
    },
    async loadModel(fileName, onComplete) {
        return loadAsset(getModelPath(fileName), loadModel, onComplete);
    },
    getImage(fileName) { return getAsset(getImagePath(fileName)); },
    getSound(fileName) { return getAsset(getSoundPath(fileName)); },
    getFont(fileName) { return getAsset(getFontPath(fileName)); },
    getModel(fileName) { return getAsset(getModelPath(fileName)); },
    unloadImage(fileName) { assetMap.delete(getImagePath(fileName)); },
    unloadSound(fileName) { assetMap.delete(getSoundPath(fileName)); },
    unloadFont(fileName) { assetMap.delete(getFontPath(fileName)); },
    unloadModel(fileName) { assetMap.delete(getModelPath(fileName)); },
    unloadAll() { assetMap.clear(); },
};
export default AssetManager;
//# sourceMappingURL=asset-manager.js.map