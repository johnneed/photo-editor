"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var React = _interopRequireWildcard(_react);

var _reactRouter = require("react-router");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Slide00 = function (_React$Component) {
    _inherits(Slide00, _React$Component);

    function Slide00(props) {
        _classCallCheck(this, Slide00);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Slide00).call(this, props));

        _this.displayName = "Slide00";

        return _this;
    }

    _createClass(Slide00, [{
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                { className: "slide-00" },
                React.createElement(
                    "h1",
                    null,
                    "Web Architecture"
                ),
                React.createElement(
                    _reactRouter.Link,
                    { to: "/slide01" },
                    "slide1"
                ),
                React.createElement(
                    _reactRouter.Link,
                    { to: "/slide02" },
                    "slide2"
                )
            );
        }
    }]);

    return Slide00;
}(React.Component);

Slide00.propTypes = {
    name: React.PropTypes.string
};
exports.default = Slide00;
//# sourceMappingURL=slide-00.js.map
