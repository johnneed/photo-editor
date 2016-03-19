import EditorState from "./editor-state";

let _history = [];
let _currentStateIndex = 0;
let _tempState = {};
let _workingImage;
let _fireHistoryEvent = function (element) {

    let historyIndexChange = new CustomEvent(
        "historyIndexChange",
        {
            detail: {
                message: "History Index Changed",
                history: _history[_currentStateIndex],
                isLast: _currentStateIndex === (_history.length - 1),
                isFirst: (_currentStateIndex === 0),
                index : _currentStateIndex
            },
            bubbles: true,
            cancelable: true
        }
    );
    element.dispatchEvent(historyIndexChange);

};
let _fireImageLoadedEvent = function(element){
    let imageLoaded = new CustomEvent(
        "imageLoaded",
        {
            detail: {
                message: "Image was loaded",
            },
            bubbles: true,
            cancelable: true
        }
    );
    element.dispatchEvent(imageLoaded);
};
let _getRotatedDims = function(image, rotation){
    var newWidth = Math.abs(Math.round(Math.sin(rotation),10) * image.height - Math.round(Math.cos(rotation),10)  * image.width);
    var newHeight = Math.abs(Math.round(Math.sin(rotation),10) * image.width - Math.round(Math.cos(rotation),10) * image.height);
    return {height: newHeight, width : newWidth};
};

window.getRotatedDims = _getRotatedDims;
class Editor {
    constructor(file) {
        var reader = new FileReader();
        var me = this;

        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('id', 'editorCanvas');
        this.canvasContext = this.canvas.getContext("2d");
        this.fileName = file.name;
        this.mimeType = file.type;
        this.lastModifiedDate = file.lastModifiedDate;
        this.fileSize = file.size;

        this.scale = this.scale.bind(this);
        //this.move = this.move.bind(this);
        this.draw = this.draw.bind(this);
        this.setState = this.saveState.bind(this);
        // this.currentState = this.currentState.bind(this);

        //SetData from image
        reader.onload = function (e) {
            var firstState;

            me.originalImage = document.createElement('img');
            me.originalImage.setAttribute('src', e.target.result);
            _workingImage = document.createElement('img')
            _workingImage.setAttribute('src', e.target.result);
            me.description = me.originalImage.longDesc;
            me.name = me.originalImage.name || me.fileName;

            firstState = ({
                image: me.originalImage
            });
            _history = [firstState];
            _currentStateIndex = 0;
            me.draw(me.originalImage);
            _fireImageLoadedEvent(me.canvas);
            _fireHistoryEvent(me.canvas);

        };

        reader.readAsDataURL(file);
    }

    scale(percentage) {
        console.log("scale" + percentage + "%");
        var newHeight = this.originalImage.height * percentage * .01;
        var newWidth = this.originalImage.width * percentage * .01;
        this.canvas.height = newHeight;
        this.canvas.width = newWidth;
        this.canvasContext.clearRect(0, 0, newWidth, newHeight);
        this.canvasContext.drawImage(_history[_currentStateIndex].image, 0, 0, _history[_currentStateIndex].image.width, _history[_currentStateIndex].image.height, 0, 0, newWidth, newHeight);
    }

    draw(image) {
        this.canvas.height = image.height;
        this.canvas.width = image.width;
        this.canvasContext.clearRect(0, 0, image.width, image.height);
        this.canvasContext.drawImage(image, 0, 0, image.width, image.height);
    }


   currentState() {
        return Object.assign({}, _history[_currentStateIndex]);
    }

    undo() {
        _currentStateIndex = _currentStateIndex < 0 ? 0 : _currentStateIndex - 1;
        this.draw(_history[_currentStateIndex].image);
        _fireHistoryEvent(this.canvas);

    }

    redo() {
        _currentStateIndex = _currentStateIndex >= (_history.length - 1) ? _currentStateIndex : _currentStateIndex + 1;
        this.draw(_history[_currentStateIndex].image);
        _fireHistoryEvent(this.canvas);

    }

    saveState() {
        var newImage = document.createElement('img');
        newImage.setAttribute('src', this.canvas.toDataURL(this.mimeType));
        _history = _history.slice(0, _currentStateIndex + 1);
        _history.push({image: newImage});
        _currentStateIndex += 1;
        _fireHistoryEvent(this.canvas);
    }

    redrawImage() {
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.draw(_history[_currentStateIndex].image);
    }


    crop(args) {
        args = args || {};
        console.log('crop ' + JSON.stringify(args));
        var newHeight = args.height;
        var newWidth = args.width;
        this.canvas.height = newHeight;
        this.canvas.width = newWidth;
        this.canvasContext.clearRect(0, 0, newWidth, newHeight);
        this.canvasContext.drawImage(_history[_currentStateIndex].image, args.x, args.y, newWidth, newHeight, 0, 0, newWidth, newHeight);

    }

    rotate(deg) {
        deg = (deg / Math.abs(deg)) * 90;//just doing a 90 deg rotate for now
        var num = parseFloat(deg);
        var rad = ((isNaN(deg) ? 0 : num) * Math.PI / 180) % (2 * Math.PI);
        var myImage = _history[_currentStateIndex].image;
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
        var newdata = imgdata.replace(/^data:image\/png/, 'data:application/octet-stream');
        return newdata;
        // give the link the values it needs

    }
}

export default Editor;
