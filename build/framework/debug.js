export function assert(condition, message) {
    if (condition === false) {
        throw new Error('Assertion failed: ' + message);
    }
}
//# sourceMappingURL=debug.js.map