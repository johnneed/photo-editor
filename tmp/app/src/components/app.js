"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var React = _interopRequireWildcard(_react);

var _reactDom = require("react-dom");

var ReactDOM = _interopRequireWildcard(_reactDom);

var _history = require("../libs/history");

var _history2 = _interopRequireDefault(_history);

var _reactRouter = require("react-router");

var _slide = require("./slide-00");

var _slide2 = _interopRequireDefault(_slide);

var _slide3 = require("./slide-01");

var _slide4 = _interopRequireDefault(_slide3);

var _slide5 = require("./slide-02");

var _slide6 = _interopRequireDefault(_slide5);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @module
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @name App
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                * @description Entry point for demo web app
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                */


var App = function (_React$Component) {
    _inherits(App, _React$Component);

    function App(props) {
        _classCallCheck(this, App);

        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(App).call(this, props));

        _this.state = {
            slideIndex: 0
        };

        _this.displayName = "App";
        _this.handleKeyDown = _this.handleKeyDown.bind(_this);
        _this.nextSlide = _this.nextSlide.bind(_this);
        _this.previousSlide = _this.previousSlide.bind(_this);
        _this.homeSlide = _this.homeSlide.bind(_this);
        return _this;
    }

    _createClass(App, [{
        key: "componentDidMount",
        value: function componentDidMount() {
            document.body.addEventListener("keydown", this.handleKeyDown.bind(this));
        }
    }, {
        key: "componentWillUnmount",
        value: function componentWillUnmount() {
            document.body.removeEventListener("keydown", this.handleKeyDown);
        }
    }, {
        key: "homeSlide",
        value: function homeSlide() {
            var slideString = "slide00";
            this.setState({ slideIndex: 0 });
            this.history.replaceState(null, slideString);
        }
    }, {
        key: "previousSlide",
        value: function previousSlide() {
            var myNextSlide = this.state.slideIndex <= 0 ? 0 : this.state.slideIndex - 1;
            var slideString = "slide0" + myNextSlide;
            this.setState({ slideIndex: myNextSlide }, function () {
                _history2.default.pushState(null, slideString);
            });
        }
    }, {
        key: "nextSlide",
        value: function nextSlide() {
            var _this2 = this;

            var myNextSlide = this.state.slideIndex >= this.props.slideCount ? this.props.slideCount : this.state.slideIndex + 1;
            var slideString = "slide0" + myNextSlide;
            this.setState({ slideIndex: myNextSlide }, function () {
                _this2.props.history.pushState(null, slideString);
            });
        }
    }, {
        key: "handleKeyDown",
        value: function handleKeyDown(event) {
            var leftArrowKey = 37;
            var rightArrowKey = 39;
            var homeKey = 36;

            switch (event.keyCode) {
                case homeKey:
                    this.homeSlide();
                    break;
                case leftArrowKey:
                    this.previousSlide();
                    break;
                case rightArrowKey:
                    this.nextSlide();
                    break;
                default:
                // Do nada
            }
        }
    }, {
        key: "render",
        value: function render() {
            return React.createElement(
                "div",
                null,
                React.createElement(
                    "ul",
                    null,
                    React.createElement(
                        "li",
                        null,
                        React.createElement(
                            _reactRouter.Link,
                            { activeClassName: "active", to: "/slide00" },
                            "Slide00"
                        )
                    ),
                    React.createElement(
                        "li",
                        null,
                        React.createElement(
                            _reactRouter.Link,
                            { activeClassName: "active", to: "/slide01" },
                            "Slide01"
                        )
                    ),
                    React.createElement(
                        "li",
                        null,
                        React.createElement(
                            _reactRouter.Link,
                            { activeClassName: "active", to: "/slide02" },
                            "Slide02"
                        )
                    )
                ),
                this.props.children
            );
        }
    }]);

    return App;
}(React.Component);

App.propTypes = {
    children: React.PropTypes.object,
    history: React.PropTypes.object,
    slideCount: React.PropTypes.number
};
App.contextTypes = {
    history: React.PropTypes.object,
    location: React.PropTypes.object
};
App.defaultProps = {
    slideCount: 2
};


ReactDOM.render(React.createElement(
    _reactRouter.Router,
    { history: _history2.default },
    React.createElement(
        _reactRouter.Route,
        { component: App },
        React.createElement(_reactRouter.Route, { component: _slide4.default, path: "slide01" }),
        React.createElement(_reactRouter.Route, { component: _slide6.default, path: "slide02" }),
        React.createElement(_reactRouter.Route, { component: _slide2.default, path: "/" }),
        React.createElement(_reactRouter.Route, { component: _slide2.default, path: "*" })
    )
), document.getElementById("app"));
//# sourceMappingURL=app.js.map
