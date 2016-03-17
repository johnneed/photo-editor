import EditorState from "./editor-state";

let _history = [];
let _currentStateIndex = 0;
let _tempState = {};
let _workingImage;


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

            _history.push(firstState);
            _currentStateIndex = 0;
            me.draw(me.originalImage);
        };

        reader.readAsDataURL(file);
    }

    scale(percentage) {
        console.log("scale" + percentage + "%");
        var newHeight = _history[_currentStateIndex].image.height * percentage * .01;
        var newWidth = _history[_currentStateIndex].image.width * percentage * .01;
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


    static currentState() {
        return Object.assign({}, _history[_currentStateIndex]);
    }

    undo() {
        _currentStateIndex = _currentStateIndex < 0 ? 0 : _currentStateIndex - 1;
        this.draw(_history[_currentStateIndex].image);
    }

    redo() {
        _currentStateIndex = _currentStateIndex >= (_history.length - 1) ? 0 : _currentStateIndex + 1;
        this.draw(_history[_currentStateIndex].image);
    }

    saveState() {
        var newImage = document.createElement('img');
        newImage.setAttribute('src', this.canvas.toDataURL(this.mimeType));
        _history = _history.slice(0, _currentStateIndex + 1);
        _history.push({image: newImage});
        _currentStateIndex += 1;
        console.log(_history);
    }

    drawBox(args) {
        args = args || {};
        // console.log('drawBox ' + JSON.stringify(args));
        this.draw();
        this.canvasContext.fillStyle = 'rgba(255,255,255,0.5)';
        this.canvasContext.fillRect((args.x || 0), (args.y || 0), (args.width || 0), (args.height || 0));
    }

    //move(args) {
    //    console.log(args);
    //    args = args || {};
    //    imageStartX: args.x, imageStartY: args.y;
    //    newState.combine(_history[_currentStateIndex]);
    //    this.draw(newState);
    //}

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
        deg = (deg/Math.abs(deg)) * 90;//just doing a 90 deg rotate for now
        var num = parseFloat(deg);
        var rad = ((isNaN(deg) ? 0 : num) * Math.PI / 180) % (2 * Math.PI);
        var myImage = _history[_currentStateIndex].image;
        if(rad) {
            this.canvas.height = myImage.width;
            this.canvas.width = myImage.height;
            this.canvasContext.clearRect(0, 0, myImage.height, myImage.Width);
            this.canvasContext.save();
            this.canvasContext.translate(myImage.height / 2, myImage.width / 2);
            this.canvasContext.rotate(rad);
            this.canvasContext.drawImage(myImage, -(myImage.width / 2), -(myImage.height / 2));
            this.canvasContext.restore();
        } else{
            this.canvas.width = myImage.width;
            this.canvas.height = myImage.height;
            this.canvasContext.drawImage(myImage,0,0,myImage.width, myImage.height);

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
