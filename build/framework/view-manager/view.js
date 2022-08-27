import InputManager from '../input-manager.js';
import ViewManager from './view-manager.js';
export var ViewState;
(function (ViewState) {
    ViewState[ViewState["Pending"] = 0] = "Pending";
    ViewState[ViewState["Loading"] = 1] = "Loading";
    ViewState[ViewState["Entering"] = 2] = "Entering";
    ViewState[ViewState["Active"] = 3] = "Active";
    ViewState[ViewState["Exiting"] = 4] = "Exiting";
})(ViewState || (ViewState = {}));
const DEFAULT_TRANSITION_TIME = 0.25;
export default class View {
    constructor() {
        this.state = ViewState.Pending;
        this.isEnabled = false;
        this.enterTime = DEFAULT_TRANSITION_TIME;
        this.exitTime = DEFAULT_TRANSITION_TIME;
        this.doEnterFade = true;
        this.doExitFade = true;
        this.transitionPos = 0;
    }
    dispose() {
        this.onDispose?.();
        if (this.isEnabled) {
            InputManager.removeListener(this);
        }
    }
    enable() {
        this.isEnabled = true;
        InputManager.addListener(this);
        this.onEnable?.();
    }
    disable() {
        this.isEnabled = false;
        InputManager.removeListener(this);
        this.onDisable?.();
    }
    exit() {
        ViewManager.exitView(this);
    }
}
//# sourceMappingURL=view.js.map