"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
//Utilities

function getOffset(elem) {
  var offsetLeft = 0;
  var offsetTop = 0;
  do {
    if (!isNaN(elem.offsetLeft)) {
      offsetLeft += elem.offsetLeft;
      offsetTop += elem.offsetTop;
    }
  } while (elem = elem.offsetParent);

  return {
    left: offsetLeft,
    top: offsetTop
  };
};

exports.getOffset = getOffset;
//# sourceMappingURL=utilities.js.map
