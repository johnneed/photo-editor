"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EditorState = function EditorState(state) {
    _classCallCheck(this, EditorState);

    this.clipStartX = state.clipStartX; //pixels
    this.clipStartY = state.clipStartY; //pixels
    this.clipHeight = state.clipHeight; //pixels
    this.clipWidth = state.clipWidth; //pixels
    this.imageStartX = state.imageStartX; //pixels
    this.imageStartY = state.imageStartY; //pixels
    this.imageWidth = state.imageWidth; //pixels
    this.imageHeight = state.imageHeight; //pixels
    this.canvasWidth = state.canvasWidth; //pixels
    this.canvasHeight = state.canvasHeight; //pixels
    this.rotation = state.rotation; //radians
};

exports.default = EditorState;
//# sourceMappingURL=editor-state.js.map
