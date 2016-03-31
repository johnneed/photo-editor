 
import {history} from "./history";
import events from "events";
 
 
import {constants} from "./constants";

var _state = {
    image : null,
    zoom: 1,
    scale : 1,
    height: null,
    width: null,
    rotation : 0,
    fileName : null,
    description : null,
    lastModifiedDate : null,
    isFirstInHistory : true,
    isLastInHistory: true,
    historyIndex : 0
};

window.myState = _state;
let _tempState = {};


 
let _getRotatedDims = function (image, rotation) {
    var newWidth = Math.abs(Math.round(Math.sin(rotation), 10) * image.height - Math.round(Math.cos(rotation), 10) * image.width);
    var newHeight = Math.abs(Math.round(Math.sin(rotation), 10) * image.width - Math.round(Math.cos(rotation), 10) * image.height);
    return {height: newHeight, width: newWidth};
};

function mergeStates(state){
    _state = Object.assign(_state,state);
}

class Editor extends events.EventEmitter {
 
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
        //this.move = this.move.bind(this);
        this.draw = this.draw.bind(this);
        this.setState = this.saveState.bind(this);

        //SetData from image
        reader.onload = function (e) {
            var firstState;

            me.originalImage = document.createElement('img');
            me.originalImage.setAttribute('src', e.target.result);
            me.description = me.originalImage.longDesc;
            me.name = me.originalImage.name || me.fileName;
            me.draw(history.append({
                image: me.originalImage,
                zoom : 1,
                scale : 1,
                rotation : 0,
                description : me.description,
                fileName : me.name
            }));
        };

        reader.readAsDataURL(file);
    }

    addListener(callback) {
        this.on(constants.CHANGE_EVENT, callback);
    }

    removeListener(callback) {
        this.removeListener(constants.CHANGE_EVENT, callback);
    }

    emit() {
        this.emit(constants.CHANGE_EVENT);
    }

    crop(args) {
        args = args || {};
        console.log('crop ' + JSON.stringify(args));
        var newHeight = args.height;
        var newWidth = args.width;
        this.canvas.height = newHeight;
        this.canvas.width = newWidth;
        this.canvasContext.clearRect(0, 0, newWidth, newHeight);
        this.canvasContext.drawImage(history.getCurrentState().image, args.x, args.y, newWidth, newHeight, 0, 0, newWidth, newHeight);
    }


    currentState() {
        return Object.assign({}, history.getCurrentState());
    }


    draw(state) {
        console.log(_state);
        mergeStates(state);
        console.log(_state);
        var newWidth = _state.image.width * _state.zoom;
        var newHeight = _state.image.height * _state.zoom;
        this.canvasContext.save();
        this.canvasContext.translate(-((newWidth-_state.image.width)/2), -((newHeight-_state.image.height)/2));
        this.canvasContext.scale(_state.zoom, _state.zoom);
        this.canvas.width = newWidth;
        this.canvas.height =  newHeight;
        this.canvasContext.clearRect(0, 0, newWidth, newHeight);
        this.canvasContext.drawImage(_state.image, 0, 0, newWidth, newHeight);
        this.canvasContext.restore();
        this.emit(constants.CHANGE_EVENT);
    }

    redo() {
        _currentStateIndex = _currentStateIndex >= (_history.length - 1) ? _currentStateIndex : _currentStateIndex + 1;
        this.draw(history.getCurrentState().image);
        _fireHistoryEvent(this.canvas);

    }

    redrawImage() {
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.draw(history.getCurrentState().image);
    }

    rotate(deg) {
        deg = (deg / Math.abs(deg)) * 90;//just doing a 90 deg rotate for now
        var num = parseFloat(deg);
        var rad = ((isNaN(deg) ? 0 : num) * Math.PI / 180) % (2 * Math.PI);
        var myImage = history.getCurrentState().image;
        if (rad) {
            let newDims = _getRotatedDims(myImage, rad);
            this.canvas.height = newDims.height;
            this.canvas.width = newDims.width;
            this.canvasContext.clearRect(0, 0, myImage.height, myImage.Width);
            this.canvasContext.save();
            this.canvasContext.translate(myImage.height / 2, myImage.width / 2);
            this.canvasContext.rotate(rad);
            this.canvasContext.drawImage(myImage, -(myImage.width / 2), -(myImage.height / 2));
            this.canvasContext.restore();
        } else {
            this.canvas.width = myImage.width;
            this.canvas.height = myImage.height;
            this.canvasContext.drawImage(myImage, 0, 0, myImage.width, myImage.height);
        }

    }

    save() {
        var imgdata = this.canvas.toDataURL(this.mimeType);
        // standard data to url

        // modify the dataUrl so the browser starts downloading it instead of just showing it
        return imgdata.replace(/^data:image\/png/, 'data:application/octet-stream');

        // give the link the values it needs

    }

    saveState() {
        var newImage = document.createElement('img');
        newImage.setAttribute('src', this.canvas.toDataURL(this.mimeType));
        _history = _history.slice(0, _currentStateIndex + 1);
        _history.push({image: newImage});
        _currentStateIndex += 1;
        _fireHistoryEvent(this.canvas);
    }

    scale(percentage) {
        console.log("scale" + percentage + "%");
        var newHeight = this.originalImage.height * percentage * .01;
        var newWidth = this.originalImage.width * percentage * .01;
        this.canvas.height = newHeight;
        this.canvas.width = newWidth;
        this.canvasContext.clearRect(0, 0, newWidth, newHeight);
        this.canvasContext.drawImage(history.getCurrentState().image, 0, 0, history.getCurrentState().image.width, history.getCurrentState().image.height, 0, 0, newWidth, newHeight);
    }

    undo() {
        _currentStateIndex = _currentStateIndex < 0 ? 0 : _currentStateIndex - 1;
        this.draw(history.getCurrentState().image);

    }

    zoom(percentage) {
        if (typeof percentage === 'number' && percentage > 0 ) {
            this.draw({zoom : percentage / 100});

        } else {
            throw new Error("zoom parameters must be of type number. You passed : " + percentage);
        }
        return _state.zoom * 100;
    }
    subscribeOnChangeEvent(callback){
        this.on(constants.CHANGE_EVENT,callback);
    }
    unsubscribeChangeEvent(czallback){
         
    }
}

export default Editor;
