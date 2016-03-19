import {default as Editor} from './editor';
import {getOffset} from "./utilities";
import EditorState from "./editor-state";



(function () {
    "use strict";
    var isAdvancedUpload = function() {
        var div = document.createElement('div');
        return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
    }();
    var fileInput = document.getElementById("fileInput");
    var scaleControl = document.getElementById("scaleImageControl");
    var cropControl = document.getElementById("cropImageControl");
    var editorBox = document.getElementById("editor");
    var saveButton = document.getElementById("save");
    var rotateRight = document.getElementById("rotateRight");
    var rotateLeft = document.getElementById("rotateLeft");
    var undoControl = document.getElementById("undoControl");
    var redoControl = document.getElementById("redoControl");

    var myEditor;

    let appState = {
        mouseStartX: null,
        mouseStartY: null,
        mouseEndX: null,
        mouseEndY: null,
        offset: null,
        canvasWidth: null,
        canvasHeight: null,
        isMoving: null,
        isCropping: null
    };


    function addPic(event) {
        myEditor = new Editor(event.target.files[0]);
        while (editorBox.hasChildNodes()) {
            editorBox.removeChild(editorBox.lastChild);
        }
        editorBox.appendChild(myEditor.canvas);
        appState.offset = getOffset(myEditor.canvas)

        appState.canvasWidth = myEditor.canvas.width;
        appState.canvasHeight = myEditor.canvas.height;

        window.editor = myEditor;
        saveButton.setAttribute('href', myEditor.save());
    }

    function scalePic(event) {
        console.log('scalePic : ' + event.target.value);
        myEditor.scale(event.target.value);
    }

    function saveState(event) {
        myEditor.saveState();
    }

    function startMove(e) {
        console.log(e);
        appState.mouseStartX = parseInt(e.clientX, 10);
        appState.mouseStartY = parseInt(e.clientY, 10);
        console.log('start-move : X ' + appState.mouseStartX + ' Y ' + appState.mouseStartY);
        // set the move flag
        appState.isMoving = true;
    }

    function moving(e) {
        var canMouseX = parseInt(e.clientX, 10) - appState.mouseStartX;
        var canMouseY = parseInt(e.clientY, 10) - appState.mouseStartY;
        // if the move flag is set, clear the canvas and draw the image
        if (appState.isMoving) {
            console.log('move : X ' + canMouseX + ' Y ' + canMouseY);
            myEditor.move({
                x: canMouseX,
                y: canMouseY
            });
            //   myEditor.canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            //   myEditor.canvasContext.drawImage(myEditor.originalImage, canMouseX - 128 / 2, canMouseY - 120 / 2, 128, 120);
        }
    }

    function endMove(e) {
        console.log(e);
        var canMouseX = parseInt(e.clientX, 10) - appState.mouseStartX;
        var canMouseY = parseInt(e.clientY, 10) - appState.mouseStartY;
        console.log('end-move : X ' + canMouseX + ' Y ' + canMouseY);
        if (appState.isMoving) {
            myEditor.move({
                x: (canMouseX),
                y: (canMouseY)
            });
            myEditor.saveState();
        }
        // clear the move flag
        appState.isMoving = false;
    }

    function startCrop(e) {
        console.log(e);

        appState.mouseStartX = parseInt(e.clientX, 10);
        appState.mouseStartY = parseInt(e.clientY, 10);
        console.log('start-crop : X ' + appState.mouseStartX + ' Y ' + appState.mouseStartY);

        // set the crop flag
        appState.isCropping = true;
    }

    function cropping(e) {
        var canMouseX = parseInt(e.clientX, 10) - appState.mouseStartX;
        var canMouseY = parseInt(e.clientY, 10) - appState.mouseStartY;
        // if the crop flag is set, clear the canvas and draw the image
        if (appState.isCropping) {
            // console.log('crop : X ' + mouseStartX - offset.left + ' Y ' +  mouseStartY - offset.top);


            drawInvertedBox({
                x: appState.mouseStartX - appState.offset.left,
                y: appState.mouseStartY - appState.offset.top,
                width: canMouseX,
                height: canMouseY
            });
            //   myEditor.canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            //   myEditor.canvasContext.drawImage(myEditor.originalImage, canMouseX - 128 / 2, canMouseY - 120 / 2, 128, 120);
        }
    }

    function endCrop(e) {
        console.log(e);
        appState.mouseEndX = parseInt(e.clientX, 10) - appState.mouseStartX;
        appState.mouseEndY = parseInt(e.clientY, 10) - appState.mouseStartY;

        console.log('end-crop : X ' + appState.mouseEndX + ' Y ' + appState.mouseEndY);
        if (appState.isCropping) {
            myEditor.crop({
                x: (appState.mouseEndX > 0) ? appState.mouseStartX - appState.offset.left : parseInt(e.clientX, 10) - appState.offset.left,
                y: (appState.mouseEndY > 0) ? appState.mouseStartY - appState.offset.top : parseInt(e.clientY, 10) - appState.offset.top,
                width: Math.abs(appState.mouseEndX),
                height: Math.abs(appState.mouseEndY)
            })
        }
        // clear the crop flag
        appState.isCropping = false;
    }

    function movePic(event) {

        if (event.target.checked) {
            myEditor.canvas.setAttribute('class', (myEditor.canvas.className + " is-moving").trim());
            myEditor.canvas.addEventListener('mousedown', startMove);
            myEditor.canvas.addEventListener('mousemove', moving);
            myEditor.canvas.addEventListener('mouseup', endMove);
            myEditor.canvas.addEventListener('mouseout', endMove);


        } else {
            myEditor.canvas.setAttribute('class', myEditor.canvas.className.replace("is-moving", "").trim());
            myEditor.canvas.removeEventListener('mousedown', startMove);
            myEditor.canvas.removeEventListener('mousemove', moving);
            myEditor.canvas.removeEventListener('mouseup', endMove);
            myEditor.canvas.removeEventListener('mouseout', endMove);
        }
    }

    function cropPic(event) {

        if (event.target.checked) {
            appState.offset = getOffset(myEditor.canvas);
            myEditor.canvas.setAttribute('class', (myEditor.canvas.className + " is-cropping").trim());
            myEditor.canvas.addEventListener('mousedown', startCrop);
            myEditor.canvas.addEventListener('mousemove', cropping);
            myEditor.canvas.addEventListener('mouseup', endCrop);
            myEditor.canvas.addEventListener('mouseout', endCrop);
        } else {
            myEditor.canvas.setAttribute('class', myEditor.canvas.className.replace("is-cropping", "").trim());
            myEditor.canvas.removeEventListener('mousedown', startCrop);
            myEditor.canvas.removeEventListener('mousemove', cropping);
            myEditor.canvas.removeEventListener('mouseup', endCrop);
            myEditor.canvas.removeEventListener('mouseout', endCrop);
        }
    }

    function save(event) {
        saveButton.href = myEditor.canvas.toDataURL(myEditor.mimeType);
        saveButton.download = myEditor.fileName;
    }

    function rotate(event) {
        console.log('rotate ' + parseFloat(event.currentTarget.value));

        myEditor.rotate(parseFloat(event.currentTarget.value));
        myEditor.saveState();


    }

    function undo() {
        myEditor.undo();
    }

    function redo() {
        myEditor.redo();
    }

    function drawBox(args) {
        args = args || {};
        myEditor.redrawImage();
        myEditor.canvasContext.fillStyle = 'rgba(255,255,255,0.4)';
        myEditor.canvasContext.fillRect((args.x || 0), (args.y || 0), (args.width || 0), (args.height || 0));
    }

    function drawInvertedBox(args) {

        args = args || {};
        console.log(args);


        var canvasWidth = myEditor.canvas.width;
        var canvasHeight = myEditor.canvas.height;

        if (args.width < 0) {
            args.x = args.x + args.width;
            args.width = Math.abs(args.width);
        }
        if (args.height < 0) {
            args.y = args.y + args.height;
            args.height = Math.abs(args.height);
        }

        myEditor.redrawImage();
        myEditor.canvasContext.beginPath();
        myEditor.canvasContext.fillStyle = 'rgba(255,255,255,0.4)';
        myEditor.canvasContext.fillRect(0, 0, args.x, canvasHeight);
        myEditor.canvasContext.beginPath();
        myEditor.canvasContext.fillRect(args.x + args.width, 0, canvasWidth - args.x - args.width, canvasHeight);
        myEditor.canvasContext.beginPath();
        myEditor.canvasContext.fillRect(args.x, 0, args.width, args.y);
        myEditor.canvasContext.beginPath();
        myEditor.canvasContext.fillRect(args.x, args.y + args.height, args.width, canvasHeight - args.height - args.y);


    }



    fileInput.addEventListener('change', addPic);
    scaleControl.addEventListener('input', scalePic);
    scaleControl.addEventListener('blur', saveState);
    undoControl.addEventListener('click', undo);
    redoControl.addEventListener('click', redo);

    cropControl.addEventListener('change', cropPic);
    saveButton.addEventListener('click', save);
    rotateLeft.addEventListener('click', drawInvertedBox);
    rotateRight.addEventListener('click', rotate);


}());
