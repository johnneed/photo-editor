"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _history = require("history");

var history = (0, _history.useBasename)(_history.createHistory)({
  basename: "/#"
}); /**
     * @module
     * @name History
     * @description Exports a singleton  ofthe react-router history object
     */


exports.default = history;
//# sourceMappingURL=history.js.map
