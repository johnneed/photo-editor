import {EditorState} from "./editor-state";

var _history = [];
var _stateIndex = -1;

function _append(state) {
    var newState;

     state.image = state.image || _history[_stateIndex].image;

    newState = EditorState.create(state);

    _history = _history.slice(0, _stateIndex + 1);
    _history.push(newState);
    _stateIndex = (_stateIndex >= _history.length - 1) ? _history.length - 1 : _stateIndex + 1;
    console.log('append');
    console.log(_stateIndex);
    console.log(_history);
    return _history[_stateIndex];
}

function _back() {
    if (_stateIndex > 0) {
        _stateIndex -= 1;
    }
    return _history[_stateIndex];
}

function _clearHistory() {
    _history = [];
    _stateIndex = -1;
}

function _currentIndex() {
    return _stateIndex;
}

function _currentState() {
    return Object.assign({}, _history[_stateIndex]);
}

function _forward() {
    if (_stateIndex >= _history.length - 1) {
        _stateIndex += _stateIndex;
    }
    return _history[_stateIndex];
}

function _goto(index) {
    if (index >= 0 && index < _history.length) {
        _stateIndex = index;
    }
    return _history[_stateIndex];
}

function _isLast(){

    return (_history.length - 1) === _stateIndex;
}

function _isFirst(){
    return _stateIndex  < 1;
}

export var history = {
    append: _append,
    back: _back,
    clearHistory: _clearHistory,
    forward: _forward,
    getCurrentState: _currentState,
    getIndex: _currentIndex,
    goto: _goto,
    isLast : _isLast,
    isFirst : _isFirst
};



window.myHistory = history;
window.myHistoryArray = _history;
window.myHistoryIndex = _stateIndex;