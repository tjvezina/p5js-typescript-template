import { assert } from '../debug.js';
import { ViewState } from './view.js';
const layerList = [];
let loadingIndicatorDrawFunc = drawDefaultLoadingIndicator;
let didBecomeVisible = false;
document.addEventListener('visibilitychange', () => { didBecomeVisible = (!document.hidden); });
window.addEventListener('focus', () => {
    layerList.forEach(layer => {
        if (layer.view !== null && layer.view.state !== ViewState.Loading) {
            layer.view?.onFocus?.();
        }
    });
    updateEnabledStates();
});
window.addEventListener('blur', () => {
    layerList.forEach(layer => {
        if (layer.view !== null && layer.view.state !== ViewState.Loading) {
            layer.view?.onBlur?.();
        }
    });
    updateEnabledStates();
});
class ViewLayer {
    constructor() {
        this.view = null;
        this.pendingView = null;
    }
    transitionTo(nextView) {
        assert(this.view === null || this.view.state === ViewState.Active, 'View transition failed, already transitioning to another view');
        if (this.view !== null) {
            this.pendingView = nextView;
            this.exitView();
        }
        else {
            this.view = nextView;
            this.loadView();
        }
    }
    exitView() {
        if (this.view !== null) {
            assert(this.view.state === ViewState.Active, 'Failed to exit view, still transitioning in');
            this.view.state = ViewState.Exiting;
            if (this.view.isEnabled) {
                this.view.disable();
            }
        }
    }
    update() {
        if (this.view === null)
            return;
        switch (this.view.state) {
            case ViewState.Entering: {
                if (this.view.enterTime > 0 && this.view.transitionPos < 1) {
                    this.view.transitionPos += (deltaTime / 1000) / this.view.enterTime;
                }
                else {
                    this.view.state = ViewState.Active;
                    onViewEntered();
                }
                break;
            }
            case ViewState.Exiting: {
                if (this.view.exitTime > 0 && this.view.transitionPos > 0) {
                    this.view.transitionPos -= (deltaTime / 1000) / this.view.exitTime;
                }
                else {
                    this.view.dispose();
                    if (this.pendingView !== null) {
                        this.view = this.pendingView;
                        this.loadView();
                    }
                    onViewExited();
                }
                break;
            }
        }
        if (this.view.state !== ViewState.Loading) {
            this.view.update?.();
        }
    }
    draw() {
        if (this.view === null)
            return;
        push();
        if (this.view.state === ViewState.Loading) {
            if (this.view.drawLoadingIndicator !== undefined) {
                this.view.drawLoadingIndicator();
            }
            else {
                loadingIndicatorDrawFunc();
            }
        }
        else {
            this.view.draw();
            if ((this.view.state === ViewState.Entering && this.view.doEnterFade) ||
                (this.view.state === ViewState.Exiting && this.view.doExitFade)) {
                background(0, 255 * (1 - this.view.transitionPos));
            }
        }
        pop();
    }
    async loadView() {
        assert(this.view !== null, 'Failed to load view, no view to load');
        if (this.view.loadAssets !== undefined) {
            this.view.state = ViewState.Loading;
            await this.view.loadAssets();
        }
        this.view.state = ViewState.Entering;
        this.view.init?.();
        if (!document.hasFocus()) {
            this.view.onBlur?.();
        }
    }
}
const ViewManager = {
    setLoadingIndicatorDrawFunc(func) {
        loadingIndicatorDrawFunc = func;
    },
    transitionTo(view, { layer } = { layer: 0 }) {
        assert(layerList.every(layer => layer.view === null || layer.view.state === ViewState.Active), 'View transition failed, a view is already transitioning');
        assert(layer >= 0 && Number.isInteger(layer), 'View transition failed, layer must be a positive integer');
        if (layerList[layer] === undefined) {
            layerList[layer] = new ViewLayer();
        }
        layerList[layer]?.transitionTo(view);
    },
    exitView(view) {
        const layer = layerList.find(layer => layer?.view === view);
        assert(layer !== undefined, 'Failed to exit view, not found in view layers');
        layer.exitView();
    },
    clearLayer(layer) {
        layerList[layer]?.exitView();
    },
    get views() { return layerList.map(layer => layer.view).filter(view => view !== null); },
    update() {
        if (didBecomeVisible) {
            didBecomeVisible = false;
            deltaTime = 1000 / 60;
        }
        layerList.forEach(layer => layer?.update());
    },
    draw() {
        layerList.forEach(layer => layer?.draw());
    },
};
function onViewEntered() { updateEnabledStates(); }
function onViewExited() { updateEnabledStates(); }
function updateEnabledStates() {
    let isEnabled = document.hasFocus();
    [...layerList].reverse().forEach(layer => {
        if (layer === undefined || layer.view === null)
            return;
        isEnabled && (isEnabled = layer.view.state === ViewState.Active);
        if (layer.view.isEnabled !== isEnabled) {
            if (isEnabled) {
                layer.view.enable();
            }
            else {
                layer.view.disable();
            }
        }
        isEnabled = false;
    });
}
function drawDefaultLoadingIndicator() {
    push();
    {
        background(0);
        textAlign(CENTER, CENTER);
        textSize(height / 20);
        textStyle(BOLD);
        fill(200).noStroke();
        text('Loading...', width / 2, height / 2);
    }
    pop();
}
export default ViewManager;
//# sourceMappingURL=view-manager.js.map