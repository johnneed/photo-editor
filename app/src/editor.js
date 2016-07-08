import {History} from "./history";
import events from "events";
import {constants} from "./constants";

// Using WeakMaps for Private properties
var _states = new WeakMap();

/**
 * Calculates the height and width of an image after rotation
 * @param {object} image - the image to rotate
 * @param {number} rotation - in radians
 * @returns {{height: number, width: number}}  height and width after rotation
 * @private
 */
function _getRotatedDims(image, rotation) {
    var newWidth = Math.round(Math.abs(Math.sin(rotation) * image.height - Math.cos(rotation) * image.width));
    var newHeight = Math.round(Math.abs(Math.sin(rotation) * image.width - Math.cos(rotation) * image.height));
    return {height: newHeight, width: newWidth};
}

/**
 * Merge two states
 * @param {object} state - new state object
 * @returns {void}
 * @private
 */
function mergeStates(state) {
    _states.set(this, Object.assign(_states.get(this), state));
}


export class Editor extends events.EventEmitter {
    canvas;
    canvasContext;
    fileName;
    mimeType;
    lastModifiedDate;
    originalFileSize;
    history;

    constructor(file) {
        var reader;
        var me;
        super();
        reader = new FileReader();
        me = this;
        _states.set(this, {
            zoom: 1,
            scale: 1,
            rotation: 0
        });
        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute("id", "editorCanvas");
        this.canvasContext = this.canvas.getContext("2d");
        this.fileName = file.name;
        this.mimeType = file.type;
        this.lastModifiedDate = file.lastModifiedDate;
        this.originalFileSize = file.size;
        this.scale = this.scale.bind(this);
        this.draw = this.draw.bind(this);

        // SetData from image
        reader.onload = function(event) {
            me.originalImage = document.createElement("img");
            me.description = me.originalImage.longDesc;
            me.name = me.originalImage.name || me.fileName;
            me.originalImage.onload = function() {
                me.history = new History({
                    image: me.originalImage,
                    scale: 1,
                    rotation: 0
                });
                me.draw(me.history.currentState());
                me.emit(constants.IMAGE_LOADED);

            };
            me.originalImage.setAttribute("src", event.target.result);
        };

        reader.readAsDataURL(file);
    }

    /**
     * Get the current editor state
     * @returns {*} editor state
     */
    getState() {
        return Object.assign({
            isFirstHistory: this.history.isFirst(),
            isLastHistory: this.history.isLast()
        }, _states.get(this));
    }

    /**
     * Register a callback for an event listener
     * @param {object} event - event to register
     * @param {function} callback - callback function
     * @returns {void}
     */
    addEventListener(event, callback) {
        this.on(event, callback);
    }

    /**
     * Un-register a call back for an event listener
     * @param {object} event event to unregister
     * @param {function} callback - function to call
     * @returns {void}
     */
    removeEventListener(event, callback) {
        this.removeListener(event, callback);
    }

    /**
     * crop the image
     * @param {object} args - crop specs
     * @returns {void}
     */
    crop(args = {}) {
        var me = this;
        var croppedImage = document.createElement("img");
        var flattenedImage = document.createElement("img");
        var zoom = _states.get(this).zoom || 1;

        console.log("crop");

        flattenedImage.onload = function() {
            me.canvas.height = args.height / zoom;
            me.canvas.width = args.width / zoom;
            me.canvasContext.clearRect(0, 0, args.width / zoom, args.height / zoom);
            me.canvasContext.drawImage(flattenedImage, args.x / zoom, args.y / zoom, args.width / zoom, args.height / zoom, 0, 0, args.width / zoom, args.height / zoom);
            croppedImage.onload = function() {
                me.history.append({image: croppedImage, scale: 1, rotation: 0});
                me.emit(constants.HISTORY_CHANGE);
                me.draw({image: croppedImage, scale: 1, rotation: 0, zoom});
            };
            croppedImage.src = me.canvas.toDataURL(me.mimeType);
        };
        me.draw({zoom: 1});
        flattenedImage.src = this.canvas.toDataURL(this.mimeType);
    }


    /**
     * Get the current history object
     * @returns {*} - the current history
     */
    currentHistory() {
        return Object.assign({}, this.history.currentState());
    }

    /**
     * Draw the state to the canvas
     * @param {*} state - a state object
     * @returns {void}
     */
    draw(state) {
        var _state = _states.get(this);
        var newWidth;
        var newHeight;
        var dims;

        console.log("editor draw");
        console.log("imageWidth " + (state.image && state.image.width) + " imageHeight " + (state.image && state.image.height));
        console.log("imageWidth " + (_state.image && _state.image.width) + " imageHeight " + (_state.image && _state.image.height));

        mergeStates.call(this, state);

        console.log("imageWidth " + _state.image.width + " imageHeight " + _state.image.height);
        console.log("zoom " + _state.zoom);
        console.log("scale " + _state.scale);

        newWidth = _state.image.width * _state.zoom * _state.scale;
        newHeight = _state.image.height * _state.zoom * _state.scale;

        console.log("newWidth " + newWidth + " newHeight " + newHeight);

        dims = _getRotatedDims({width: newWidth, height: newHeight}, _state.rotation);

        console.log("width " + dims.width + " height " + dims.height);

        this.canvas.width = dims.width;
        this.canvas.height = dims.height;
        this.canvasContext.save();
        this.canvasContext.translate(dims.width / 2, dims.height / 2);
        this.canvasContext.clearRect(0, 0, dims.width, dims.height);
        this.canvasContext.rotate(_state.rotation);
        this.canvasContext.drawImage(_state.image, -(newWidth / 2), -(newHeight / 2), newWidth, newHeight);
        this.canvasContext.restore();
        this.emit(constants.DRAW_EVENT);
    }

    /**
     * Advances the history index by 1 and redraws the image
     * @returns {void}
     */
    redo() {
        this.draw(this.history.forward());
    }

    /**
     * Redraws the current state
     * @returns {void}
     */
    redrawImage() {
        console.log("editor redrawImage");
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.draw(this.history.currentState().image);
    }

    /**
     * Rotates and redraws the image
     * @param {number} rad - rotation in radians
     * @returns {void}
     */
    rotate(rad) {
        var _state = _states.get(this);
        _state.rotation = rad % (2 * Math.PI);
        this.draw(_state);
        _states.set(_state);
    }

    /**
     * Returns a url for downloading the current image state.
     * @returns {string}
     */
    save() {
        var data;
        var myState = _states.get(this);
        var currentZoom = myState.zoom;
        console.log("save");
        this.draw({zoom: 1});
        // modify the dataUrl so the browser starts downloading it instead of just showing it
        data = this.canvas.toDataURL(this.mimeType).replace(/^data:image\/png/, "data:application/octet-stream");
        this.draw({zoom: currentZoom});
        return data;
    }

    /**
     * Saves the current state to histoy
     * @returns {void}
     */
    saveState() {
        this.history.append(_states.get(this));
        this.emit(constants.HISTORY_CHANGE);
    }

    /**
     * Zooms the image and changes the dimensions
     * @param {number} percentage - %
     * @returns {number} - zoom value
     */
    scale(percentage) {
        this.draw({scale: percentage / 100});
        return _states.get(this).scale * 100;
    }


    /**
     * Moves the history back one index and redraws the image
     * @returns {void}
     */
    undo() {
        this.draw(this.history.back());
    }

    /**
     * Zooms the image but does not change the actual dimensions
     * @param percentage
     * @returns {number} percentage of zoom
     */
    zoom(percentage) {
        if (typeof percentage === "number" && percentage > 0) {
            this.draw({zoom: percentage / 100});
        }
        else {
            throw new Error("zoom parameters must be of type number. You passed : " + percentage);
        }
        return _states.get(this).zoom * 100;
    }

    /**
     * Clears the history cache and resets to original State
     * @returns {void}
     */
    clearHistory() {
        this.history.resetHistory();
        _states.set(this, {
            zoom: 1,
            scale: 1,
            rotation: 0
        });
        this.emit(constants.HISTORY_CHANGE);
    }
}

