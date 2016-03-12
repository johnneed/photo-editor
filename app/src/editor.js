import EditorState from "./editor-state";

let _history = [];
let _currentStateIndex = 0;
let _tempState = {};

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
        this.currentState = this.currentState.bind(this);

        //SetData from image
        reader.onload = function (e) {
            var firstState;

            me.originalImage = document.createElement('img');
            me.originalImage.setAttribute('src', e.target.result);
            me.description = me.originalImage.longDesc;
            me.name = me.originalImage.name || me.fileName;

            firstState = new EditorState({
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
                canvasHeight: me.originalImage.naturalHeight,
                rotation : 0
            });

            _history.push(firstState);
            _currentStateIndex = 0;
            me.draw();
        };

        reader.readAsDataURL(file);
    }

    scale(percentage) {
        console.log("scale" + percentage + "%");
        var newHeight = this.originalImage.height * percentage * .01;
        var newWidth = this.originalImage.width * percentage * .01;
        this.imageState.width = newWidth;
        this.imageState.height = newHeight;
        this.canvas.width = newWidth;
        this.canvas.height = newHeight;
        this.draw();
        this.history.push({
            action: "zoom",
            payload: percentage
        });

    }

    draw(editorState) {
        var newState = new EditorState(Object.assign((editorState || {}),{image : _history[_currentStateIndex].image}));
        console.log('draw1 ' + JSON.stringify(editorState));
        console.log('draw ' + JSON.stringify(newState));

        //Clear the canvas
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //Setup Canvas
        this.canvas.width = newState.canvasWidth;
        this.canvas.height = newState.canvasHeight;
        if(!!newState.rotation){
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


    currentState() {
        return Object.assign({},_history[_currentStateIndex]);
    }

    undo(){
        _currentStateIndex = _currentStateIndex < 0 ? 0 : _currentStateIndex - 1;
        this.draw();
    }

    redo(){
        _currentStateIndex = _currentStateIndex >=(_history.length - 1) ? 0 : _currentStateIndex + 1;
        this.draw();
    }

    saveState(){
       _history  = _history.slice(0,_currentStateIndex).push(_tempState);
       _currentStateIndex = _history.length - 1;

    }

    drawBox(args) {
        args = args || {};
        // console.log('drawBox ' + JSON.stringify(args));
        this.draw();
        this.canvasContext.fillStyle = 'rgba(255,255,255,0.5)';
        this.canvasContext.fillRect((args.sx || 0), (args.sy || 0), (args.swidth || 0), (args.sheight || 0));
    }

    move(args) {
        args = args || {};
        console.log('move ' + JSON.stringify(args));
        this.imageState.y = this.imageState.y + (args.y || 0);
        this.imageState.x = this.imageState.x + (args.x || 0);
        this.draw();
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
        var imgdata = this.canvas.toDataURL('imgage/png');
        // standard data to url

        // modify the dataUrl so the browser starts downloading it instead of just showing it
        var newdata = imgdata.replace(/^data:image\/png/, 'data:application/octet-stream');
        return newdata;
        // give the link the values it needs

    }
}

export default Editor;
