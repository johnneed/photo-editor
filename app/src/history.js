import {EditorState} from "./editor-state";

// Using WeakMaps for Private properties
var _history = new WeakMap();
var _stateIndex = new WeakMap();


export class History {
    constructor(initialState) {
        _history.set(this, [EditorState.create(initialState)]);
        _stateIndex.set(this, 0);
    }
 
    append(state) {
        var newState;
        var history = _history.get(this);
        var stateIndex = _stateIndex.get(this);
        state.image = state.image || history[stateIndex].image;
        newState = EditorState.create(state);
        history = history.slice(0, stateIndex + 1);
        history.push(newState);
        stateIndex = stateIndex >= history.length - 1 ? history.length - 1 : stateIndex + 1;
        _stateIndex.set(this, stateIndex);
        _history.set(this, history);
        return history[stateIndex];
    }

    back() {
        var history = _history.get(this);
        var stateIndex = _stateIndex.get(this);
        if (stateIndex > 0) {
            stateIndex -= 1;
            _stateIndex.set(this, stateIndex);
        }

        return history[stateIndex];
    }

    resetHistory() {
        var history = _history.get(this);
        _history.set(this, [history[0]]);
        _stateIndex.set(this, 0);
    }


    getIndex() {
        return _stateIndex.get(this);
    }

    currentState() {
        var history = _history.get(this);
        var stateIndex = _stateIndex.get(this);
        return Object.assign({}, history[stateIndex]);
    }

    forward() {
        var history = _history.get(this);
        var stateIndex = _stateIndex.get(this);
        if (stateIndex <= history.length - 1) {
            stateIndex += 1;
            _stateIndex.set(this, stateIndex);
        }

        return history[stateIndex];
    }

    goto(index) {
        var history = _history.get(this);
        var stateIndex = _stateIndex.get(this);
        if (index >= 0 && index < history.length) {
            stateIndex = index;
        }
        _stateIndex.set(this, stateIndex);
        return history[stateIndex];
    }

    isLast() {
        var history = _history.get(this);
        var stateIndex = _stateIndex.get(this);
        return history.length - 1 === stateIndex;
    }

    isFirst() {
        var stateIndex = _stateIndex.get(this);
        return stateIndex < 1;
    }

}
