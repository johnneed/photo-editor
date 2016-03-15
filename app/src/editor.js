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
        this.move = this.move.bind(this);
        this.draw = this.draw.bind(this);
        this.setState = this.saveState.bind(this);
       // this.currentState = this.currentState.bind(this);

        //SetData from image
        reader.onload = function (e) {
            var firstState;

            me.originalImage = document.createElement('img');
            me.originalImage.setAttribute('src', e.target.result);
            _workingImage =  document.createElement('img')
            _workingImage.setAttribute('src', e.target.result);
            me.description = me.originalImage.longDesc;
            me.name = me.originalImage.name || me.fileName;

            firstState = new EditorState({
                image : me.originalImage,
                clipStartX: 0,
                clipStartY: 0,
                clipWidth: me.originalImage.naturalWidth,
                clipHeight: me.originalImage.naturalHeight,
                imageStartX: 0,
                imageStartY: 0,
                imageWidth: me.originalImage.naturalWidth,
                imageHeight: me.originalImage.naturalHeight,
                canvasWidth: me.originalImage.naturalWidth,
                canvasHeight: me.originalImage.naturalHeight,
                rotation: 0
            });

            _history.push(firstState);
            _currentStateIndex = 0;
            me.draw();
        };

        reader.readAsDataURL(file);
    }

    scale(percentage) {
        console.log("scale" + percentage + "%");
        var newHeight = _history[_currentStateIndex].image.height * percentage * .01;
        var newWidth = _history[_currentStateIndex].image.width * percentage * .01;
        var newState = new EditorState({imageWidth: newWidth, imageHeight :newHeight});
        this.draw(newState);
    }

    draw(editorState, image) {
        //cloning our state object
        let newState = new EditorState(editorState);
        newState.fill(_history[_currentStateIndex]);
        newState.image = image || _workingImage;

       // console.log('draw1 ' + JSON.stringify(editorState));
      //  console.log('draw ' + JSON.stringify(newState));

        //Clear the canvas
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //Setup Canvas
        this.canvas.width = newState.canvasWidth;
        this.canvas.height = newState.canvasHeight;
        if (!!newState.rotation) {
            this.canvasContext.translate(this.canvas.width / 2, this.canvas.height / 2);
            this.canvasContext.rotate(rad);
            this.canvasContext.translate(-this.canvas.width / 2, -this.canvas.height / 2);
        }
        //Draw Image
        this.canvasContext.drawImage(
            newState.image,
            newState.clipStartX,
            newState.clipStartY,
            newState.clipWidth,
            newState.clipHeight,
            newState.imageStartX,
            newState.imageStartY,
            newState.imageWidth,
            newState.imageHeight);

        //Save this state as the last rendered
        _tempState = newState;
    }


    static currentState() {
        return Object.assign({}, _history[_currentStateIndex]);
    }

    undo() {
        _currentStateIndex = _currentStateIndex < 0 ? 0 : _currentStateIndex - 1;
        this.draw();
    }

    redo() {
        _currentStateIndex = _currentStateIndex >= (_history.length - 1) ? 0 : _currentStateIndex + 1;
        this.draw();
    }

    saveState() {
         var newImage = document.createElement('img');
        newImage.setAttribute('src', this.canvas.toDataURL(this.mimeType));
        _history = _history.slice(0, _currentStateIndex + 1);
        _history.push(Object.assign(_tempState, {image:newImage}));
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

    move(args) {
        console.log(args);
        args = args || {};
        var newState = new EditorState({imageStartX : args.x, imageStartY : args.y});
            newState.combine(_history[_currentStateIndex]);
        this.draw(newState);
    }

    crop(args) {
        args = args || {};
        console.log('crop ' + JSON.stringify(args));
        this.imageState.x = 0;
        this.imageState.y = 0;
        this.imageState.width = args.swidth;
        this.imageState.height = args.sheight;
        this.imageState.sy = (args.sy || 0);
        this.imageState.sx = (args.sx || 0);
        this.imageState.swidth = (args.swidth || 0);
        this.imageState.sheight = (args.sheight || 0);
        this.canvas.width = args.swidth;
        this.canvas.height = args.sheight;
        this.draw();
    }

    rotate(deg) {
        var rad = deg * Math.PI / 180;
        var height = this.canvas.height;
        var width = this.canvas.width;
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvasContext.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.canvasContext.rotate(rad);
        this.canvasContext.translate(-this.canvas.width / 2, -this.canvas.height / 2);
        this.canvas.height = width;
        this.canvas.width = height;
        this.draw();
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
