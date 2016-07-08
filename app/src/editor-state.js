import {prune} from "./utilities";

export class EditorState {
    image;
    rotation;
    scale;

    constructor(state = {}) {
        this.image = state.image;
        this.rotation = state.rotation;
        this.scale = state.scale;
    }

    prune() {
        return prune(this);
    }

    merge(state) {
        return Object.assign(this, prune(state));
    }

    fill(state) {
        Object.keys(this).forEach((key) => {
            this[key] = typeof this[key] === "undefined" ? state[key] : this[key];
        });
        return this;
    }

    combine(state) {
        this.image = state.image || this.image;
    }

    static create(state) {
        return new EditorState(state || {});
    }
}

