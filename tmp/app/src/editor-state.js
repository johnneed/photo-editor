"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
* Remove undefined keys and return a POJO;
*/
function _prune(obj) {
    var _this = this;

    obj = (typeof obj === "undefined" ? "undefined" : _typeof(obj)) === "object" ? obj : {};
    return Object.keys(obj).reduce(function (pojo, key) {
        if (typeof _this[key] !== 'undefined') {
            pojo[key] = _this[key];
        }
        return pojo;
    }, {});
}

var EditorState = function () {
    function EditorState(state) {
        _classCallCheck(this, EditorState);

        state = state || {};
        this.image = state.image; //pixels
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
    }

    _createClass(EditorState, [{
        key: "prune",
        value: function prune() {
            return _prune(this);
        }
    }, {
        key: "merge",
        value: function merge(state) {
            return Object.assign(this, _prune(state));
        }
    }, {
        key: "fill",
        value: function fill(state) {
            var _this2 = this;

            Object.keys(this).forEach(function (key) {
                _this2[key] = typeof _this2[key] === "undefined" ? state[key] : _this2[key];
            });
            return this;
        }
    }, {
        key: "combine",
        value: function combine(state) {
            this.image = state.image || this.image;
            this.clipStartX = (this.clipStartX || 0) + (state.clipStartX || 0);
            this.clipStartY = (this.clipStartY || 0) + (state.clipStartY || 0);
            this.clipHeight = (this.clipHeight || 0) + (state.clipHeight || 0);
            this.clipWidth = (this.clipWidth || 0) + (state.clipWidth || 0);
            this.imageStartX = (this.imageStartX || 0) + (state.imageStartX || 0);
            this.imageStartY = (this.imageStartY || 0) + (state.imageStartY || 0);
            this.imageWidth = (this.imageWidth || 0) + (state.imageWidth || 0);
            this.imageHeight = (this.imageHeight || 0) + (state.imageHeight || 0);
            this.canvasWidth = (this.canvasWidth || 0) + (state.canvasWidth || 0);
            this.canvasHeight = (this.canvasHeight || 0) + (state.canvasHeight || 0);
            this.rotation = (this.rotation || 0) + (state.rotation || 0);
        }
    }]);

    return EditorState;
}();

exports.default = EditorState;
//# sourceMappingURL=editor-state.js.map
