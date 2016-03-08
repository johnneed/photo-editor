"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CheckboxWithLabel = function (_React$Component) {
    _inherits(CheckboxWithLabel, _React$Component);

    function CheckboxWithLabel(props) {
        _classCallCheck(this, CheckboxWithLabel);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(CheckboxWithLabel).call(this, props));

        _this.state = { isChecked: false };

        // since auto-binding is disabled for React's class model
        // we can prebind methods herebab
        // http://facebook.github.io/react/blog/2015/01/27/react-v0.13.0-beta-1.html#autobinding
        _this.onChange = _this.onChange.bind(_this);
        return _this;
    }

    _createClass(CheckboxWithLabel, [{
        key: "onChange",
        value: function onChange() {
            this.setState({ isChecked: !this.state.isChecked });
        }
    }, {
        key: "render",
        value: function render() {
            return _react2.default.createElement(
                "label",
                null,
                _react2.default.createElement("input", { checked: this.state.isChecked, onChange: this.onChange,
                    type: "checkbox"
                }),
                this.state.isChecked ? this.props.labelOn : this.props.labelOff
            );
        }
    }]);

    return CheckboxWithLabel;
}(_react2.default.Component);

CheckboxWithLabel.propTypes = {
    labelOff: _react2.default.PropTypes.string,
    labelOn: _react2.default.PropTypes.string
};


module.exports = CheckboxWithLabel;
//# sourceMappingURL=CheckboxWithLabel.js.map