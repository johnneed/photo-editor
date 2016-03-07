"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Foo = function () {
    function Foo() {
        _classCallCheck(this, Foo);

        this.bar = "baz";
    }

    _createClass(Foo, null, [{
        key: "create",
        value: function create(args) {
            var instance = new Foo();
            instance.bar = args;
            return instance;
        }
    }]);

    return Foo;
}();
//# sourceMappingURL=foo-factory.ts.js.map


exports.default = Foo;
//# sourceMappingURL=foo-factory.js.map
