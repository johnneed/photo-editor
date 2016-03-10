'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _editorState = require('./editor-state');

var _editorState2 = _interopRequireDefault(_editorState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Editor = function () {
    function Editor(file) {
        _classCallCheck(this, Editor);

        var reader = new FileReader();
        var me = this;

        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('id', 'editorCanvas');
        this.canvasContext = this.canvas.getContext("2d");
        this.fileName = file.name;
        this.mimeType = file.type;
        this.lastModifiedDate = file.lastModifiedDate;
        this.fileSize = file.size;
        this.history = [];
        this.scale = this.scale.bind(this);
        this.redraw = this.redraw.bind(this);
        this.move = this.move.bind(this);

        //SetData from image
        reader.onload = function (e) {
            var firstState;

            me.originalImage = document.createElement('img');
            me.originalImage.setAttribute('src', e.target.result);
            me.description = me.originalImage.longDesc;
            me.name = me.originalImage.name || me.fileName;

            firstState = new _editorState2.default({
                image: me.originalImage,
                clipStartX: 0,
                clipStartY: 0,
                clipWidth: me.originalImage.naturalWidth,
                clipHeight: me.originalImage.naturalHeight,
                imageStartX: 0,
                imageStartY: 0,
                imageWidth: me.originalImage.naturalWidth,
                imageHeight: me.originalImage.naturalHeight,
                canvasWidth: me.originalImage.naturalWidth,
                canvasHeight: me.originalImage.naturalHeight
            });

            me.setState(firstState);
        };

        reader.readAsDataURL(file);
    }

    _createClass(Editor, [{
        key: 'scale',
        value: function scale(percentage) {
            console.log("scale" + percentage + "%");
            var newHeight = this.originalImage.height * percentage * .01;
            var newWidth = this.originalImage.width * percentage * .01;
            this.imageState.width = newWidth;
            this.imageState.height = newHeight;
            this.canvas.width = newWidth;
            this.canvas.height = newHeight;
            this.redraw();
            this.history.push({
                action: "zoom",
                payload: percentage
            });
        }
    }, {
        key: 'redraw',
        value: function redraw(editorState) {
            editorState = editorState || {};
            console.log('redraw ' + JSON.stringify(editorState));
            //Clear the canvas
            this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.canvasContext.drawImage(editorState.image, editorState.clipStartX, editorState.clipStartY, editorState.clipWidth, editorState.clipHeight, editorState.imageStartX, editorState.imageStartY, editorState.imageWidth, editorState.imageHeight);
            this.canvas.width = editorState.canvasWidth;
            this.canvas.height = editorState.canvasHeight;
        }
    }, {
        key: 'drawBox',
        value: function drawBox(args) {
            args = args || {};
            // console.log('drawBox ' + JSON.stringify(args));
            this.redraw();
            this.canvasContext.fillStyle = 'rgba(255,255,255,0.5)';
            this.canvasContext.fillRect(args.sx || 0, args.sy || 0, args.swidth || 0, args.sheight || 0);
        }
    }, {
        key: 'move',
        value: function move(args) {
            args = args || {};
            console.log('move ' + JSON.stringify(args));
            this.imageState.y = this.imageState.y + (args.y || 0);
            this.imageState.x = this.imageState.x + (args.x || 0);
            this.redraw();
        }
    }, {
        key: 'crop',
        value: function crop(args) {
            args = args || {};
            console.log('crop ' + JSON.stringify(args));
            this.imageState.x = 0;
            this.imageState.y = 0;
            this.imageState.width = args.swidth;
            this.imageState.height = args.sheight;
            this.imageState.sy = args.sy || 0;
            this.imageState.sx = args.sx || 0;
            this.imageState.swidth = args.swidth || 0;
            this.imageState.sheight = args.sheight || 0;
            this.canvas.width = args.swidth;
            this.canvas.height = args.sheight;
            this.redraw();
        }
    }, {
        key: 'rotate',
        value: function rotate(deg) {
            var rad = deg * Math.PI / 180;
            var height = this.canvas.height;
            var width = this.canvas.width;
            this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.canvasContext.translate(this.canvas.width / 2, this.canvas.height / 2);
            this.canvasContext.rotate(rad);
            this.canvasContext.translate(-this.canvas.width / 2, -this.canvas.height / 2);
            this.canvas.height = width;
            this.canvas.width = height;
            this.redraw();
        }
    }, {
        key: 'save',
        value: function save() {
            var imgdata = this.canvas.toDataURL('imgage/png');
            // standard data to url

            // modify the dataUrl so the browser starts downloading it instead of just showing it
            var newdata = imgdata.replace(/^data:image\/png/, 'data:application/octet-stream');
            return newdata;
            // give the link the values it needs
        }
    }]);

    return Editor;
}();

exports.default = Editor;
//# sourceMappingURL=editor.js.map
