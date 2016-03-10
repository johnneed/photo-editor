class EditorState{
    constructor(state){
            this.clipStartX = state.clipStartX;
            this.clipStartY = state.clipStartY;
            this.clipHeight = state.clipHeight;
            this.clipWidth = state.clipWidth;
            this.imageStartX = state.imageStartX;
            this.imageStartY = state.imageStartY;
            this.imageWidth =  state.imageWidth;
            this.imageHeight = state.imageHeight;
            this.canvasWidth = state.canvasWidth;
            this.canvasHeight = state.canvasHeight;
    }
}


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
        this.history = [];
        this.scale = this.scale.bind(this);
        this.redraw = this.redraw.bind(this);
        this.move = this.move.bind(this);
        this.currentState = new EditorState({});

        //SetData from image
        reader.onload = function (e) {
            me.originalImage = document.createElement('img');
            me.originalImage.setAttribute('src', e.target.result);
            me.imageState.height = me.originalImage.naturalHeight;
            me.imageState.width = me.originalImage.naturalWidth;
            me.imageState.swidth = me.originalImage.naturalWidth;
            me.imageState.sheight = me.originalImage.naturalHeight;
            me.description = me.originalImage.longDesc;
            me.name = me.originalImage.name || me.fileName;
            me.canvas.height = me.originalImage.naturalHeight;
            me.canvas.width = me.originalImage.naturalWidth;
            me.canvasContext.drawImage(me.originalImage, 0, 0);
        };

        reader.readAsDataURL(file);
    }

    scale(percentage) {
        console.log("scale" + percentage + "%");
        var newHeight = this.originalImage.height * percentage * .01;
        var newWidth = this.originalImage.width * percentage * .01;
        this.imageState.width = newWidth;
        this.imageState.height = newHeight;
        this.canvas.width =newWidth;
        this.canvas.height = newHeight;
        this.redraw();
        this.history.push({
            action: "zoom",
            payload: percentage
        });

    }

    redraw(args) {
        args = args || {};
        console.log('redraw ' + JSON.stringify(args));

        var img = this.originalImage;
        var sx = args.sx || this.imageState.sx || 0;
        var sy = args.sy || this.imageState.sy || 0;
        var swidth = args.swidth || this.imageState.swidth;
        var sheight = args.sheight || this.imageState.sheight;
        var x = args.x ? (this.imageState.x || 0) + args.x : (this.imageState.x || 0);
        var y = args.y ? (this.imageState.y || 0) + args.y : (this.imageState.y || 0);
        var width = args.width || this.imageState.width;
        var height = args.height || this.imageState.height;

        //Clear the canvas
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvasContext.drawImage(img, sx, sy, swidth, sheight, x, y, width, height)
    }

    drawBox(args) {
        args = args || {};
        // console.log('drawBox ' + JSON.stringify(args));
        this.redraw();
        this.canvasContext.fillStyle = 'rgba(255,255,255,0.5)';
        this.canvasContext.fillRect((args.sx || 0), (args.sy || 0), (args.swidth || 0), (args.sheight || 0));
    }


    move(args) {
        args = args || {};
        console.log('move ' + JSON.stringify(args));
        this.imageState.y = this.imageState.y + (args.y || 0);
        this.imageState.x = this.imageState.x + (args.x || 0);
        this.redraw();
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
        this.canvas.width =args.swidth;
        this.canvas.height = args.sheight;
        this.redraw();
    }

    rotate(deg){
        var rad = deg * Math.PI / 180;
        var height = this.canvas.height;
        var width = this.canvas.width;
        this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.canvasContext.translate(this.canvas.width/2, this.canvas.height/2);
        this.canvasContext.rotate(rad);
        this.canvasContext.translate( -this.canvas.width/2, -this.canvas.height/2);
        this.canvas.height = width;
        this.canvas.width = height;
        this.redraw();

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
