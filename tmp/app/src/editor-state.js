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
        }
    }]);

    return EditorState;
}();

exports.default = EditorState;
//# sourceMappingURL=editor-state.js.map
