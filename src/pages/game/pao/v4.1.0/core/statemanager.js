import IndexState from "./indexstate";
import OverState from './overstate';

class StateManager {
    constructor() {
        this.states = {};
        this.curState = null;
    }

    start(name) {
        if (this.curState) {
            this.curState.exit();
        }
        if (!this.states[name]) {
            this.states[name] = this.creatState(name);
        }
        this.states[name].enter();
        this.curState = this.states[name];
    }

    creatState(name) {
        var state = null;
        switch (name) {
            case "IndexState":
                state = new IndexState(name);
                break;
            case "OverState":
                state = new OverState(name);
                break;
            default:
                break;
        }
        return state;
    }
}

export default StateManager;