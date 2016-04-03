import {history} from "./history";
import events from "events";
import {constants} from "./constants";


var _state = {
    zoom: 1,
    scale: 1,
    height: null,
    width: null,
    rotation: 0
};

window.myState = _state;

let _getRotatedDims = function (image, rotation) {
    var newWidth = Math.round(Math.abs(Math.sin(rotation) * image.height - Math.cos(rotation) * image.width));
    var newHeight = Math.round(Math.abs(Math.sin(rotation) * image.width - Math.cos(rotation) * image.height));
    return {height: newHeight, width: newWidth};
};

function mergeStates(state) {
    _state = Object.assign(_state, state);
}

export class Editor extends events.EventEmitter {
    canvas;
    canvasContext;
    fileName;
    mimeType;
    lastModifiedDate;
    originalFileSize;


    constructor(file) {
        super();
        var reader = new FileReader();
        var me = this;
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('id', 'editorCanvas');
        this.canvasContext = this.canvas.getContext("2d");
        this.fileName = file.name;
        this.mimeType = file.type;
        this.lastModifiedDate = file.lastModifiedDate;
        this.originalFileSize = file.size;
        this.scale = this.scale.bind(this);
        this.draw = this.draw.bind(this);

        //SetData from image
        reader.onload = function (e) {

            me.originalImage = document.createElement('img');
            me.originalImage.setAttribute('src', e.target.result);
            me.description = me.originalImage.longDesc;
            me.name = me.originalImage.name || me.fileName;
            me.draw(history.append({
                image: me.originalImage,
                zoom: 1,
                scale: 1,
                rotation: 0,
                description: me.description,
                fileName: me.name
            }));
        };

        reader.readAsDataURL(file);
    }

    getState() {
        return Object.assign({}, _state);
    }

    /**
     * @param {object} event
     * @param {function} callback
     */
    addEventListener(event, callback) {
        this.on(event, callback);
    }

    /**
     * @param {object} event
     * @param {function} callback
     */
    removeEventListener(event, callback) {
        this.removeListener(event, callback);
    }

    crop(args) {
        console.log('crop ' + JSON.stringify(args));
        var newImage = document.createElement('img');
        args = args || {};
        this.canvas.height = args.height;
        this.canvas.width = args.width;
        this.canvasContext.clearRect(0, 0, args.width, args.height);
        this.canvasContext.drawImage(history.getCurrentState().image, args.x, args.y, args.width, args.height, 0, 0, args.width, args.height);
        newImage.src = this.canvas.toDataURL(this.mimeType);
        history.append({image: newImage});
    }

    currentHistory() {
        return Object.assign({}, history.getCurrentState());
    }

    draw(state) {
        var myImage = history.getCurrentState().image;
        var newWidth;
        var newHeight;
        var dims;

        mergeStates(state);
        console.log(_state);

        newWidth = _state.image.width * _state.zoom * _state.scale;
        newHeight = _state.image.height * _state.zoom * _state.scale;
        dims = _getRotatedDims({width:newWidth,height:newHeight}, _state.rotation);
        this.canvas.width = dims.width;
        this.canvas.height = dims.height;
        this.canvasContext.save();
        this.canvasContext.translate(dims.width / 2, dims.height / 2);
        this.canvasContext.clearRect(0, 0, dims.width, dims.height);
        this.canvasContext.rotate(_state.rotation);
        this.canvasContext.drawImage(myImage,   -(newWidth/ 2), -(newHeight / 2), newWidth, newHeight);
     //   this.canvasContext.drawImage(myImage, 0, 0, dims.width, dims.height);
        this.canvasContext.restore();
        this.emit(constants.DRAW_EVENT);
    }

    redo() {
        history.forward();
        this.draw(history.getCurrentState());
    }

    redrawImage() {
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.draw(history.getCurrentState().image);
    }

    rotate(deg) {
        var rotation;
        var num;
        var rad;
        var rotation;

        deg = (deg / Math.abs(deg)) * 90;//just doing a 90 deg rotate for now
        num = parseFloat(deg);
        rad = ((isNaN(deg) ? 0 : num) * Math.PI / 180);
        rotation = (rad + _state.rotation) % (2 * Math.PI);

        this.draw({rotation: rotation});
 
    }

    save() {
        var imgdata = this.canvas.toDataURL(this.mimeType);
        // standard data to url

        // modify the dataUrl so the browser starts downloading it instead of just showing it
        return imgdata.replace(/^data:image\/png/, 'data:application/octet-stream');

        // give the link the values it needs

    }

    saveState() {
        history.append(_state)
    }

    scale(percentage) {
        console.log("scale" + percentage + "%");
        this.draw({scale: percentage / 100});
        return _state.scale * 100;

    }

    undo() {
        history.back();
        this.draw(history.getCurrentState());

    }

    zoom(percentage) {
        if (typeof percentage === 'number' && percentage > 0) {
            this.draw({zoom: percentage / 100});

        } else {
            throw new Error("zoom parameters must be of type number. You passed : " + percentage);
        }
        return _state.zoom * 100;
    }

}

