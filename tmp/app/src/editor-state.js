"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var EditorState = function EditorState(state) {
    _classCallCheck(this, EditorState);

    this.image = state.image;
    this.clipStartX = state.clipStartX || 0;
    this.clipStartY = state.clipStartY || 0;
    this.clipHeight = state.clipHeight;
    this.clipWidth = state.clipWidth;
    this.imageStartX = state.imageStartX;
    this.imageStartY = state.imageStartY;
    this.imageWidth = state.imageWidth;
    this.imageHeight = state.imageHeight;
    this.canvasWidth = state.canvasWidth || state.clipWidth;
    this.canvasHeight = state.canvasHeight || state.clipHeight;
};

exports.default = EditorState;
//# sourceMappingURL=editor-state.js.map
