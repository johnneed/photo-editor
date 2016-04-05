import {Editor} from './editor';
import {getOffset} from "./utilities";
import {constants} from "./constants";
require('core-js');

(function () {
    "use strict";
    //Do we have drag and drop?
    var isAdvancedUpload = function () {
        var div = document.createElement('div');
        return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
    }();
    //find our controls
    var fileInput = document.getElementById("fileInput");
    var scaleControl = document.getElementById("scaleImageControl");
    var cropControl = document.getElementById("cropImageControl");
    var editorBox = document.getElementById("editor");
    var saveButton = document.getElementById("save");
    var rotateRight = document.getElementById("rotateRight");
    var rotateLeft = document.getElementById("rotateLeft");
    var undoControl = document.getElementById("undoControl");
    var redoControl = document.getElementById("redoControl");
    var uploadInstructions = document.getElementById('uploadInstructions');
    var clearImageControl = document.getElementById('clearImageControl');
    var zoomControl = document.getElementById('zoomControl');
    var spinner = document.getElementById('spinner');
    //find our labels
    var zoomValue = document.getElementById('zoomValue');
    var scaleValue = document.getElementById('scaleValue');
    //var heightValue = document.getElementById('heightValue');
    //var widthValue = document.getElementById('widthValue');
    var rotationValue = document.getElementById('rotationValue');

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
        isCropping: null,
        scale: 100,
        rotation: 0,
        zoom: 100
    };

    function handleRedraw() {
        var editorState = myEditor.getState();
        zoomValue.innerHTML = Math.round(editorState.zoom * 100);
        scaleValue.innerHTML = Math.round(editorState.scale * 100);
        rotationValue.innerHTML = Math.round(editorState.rotation * 180 / Math.PI);
        //undo & redo buttons
        if (editorState.isFirstHistory) {
            undoControl.setAttribute('disabled', 'disabled');
        } else {
            undoControl.removeAttribute('disabled');

        }
        if (editorState.isLastHistory) {
            redoControl.setAttribute('disabled', 'disabled');

        } else {
            redoControl.removeAttribute('disabled');
        }

    }

    function addPic(event) {
        console.log('addPIc');
        event.stopPropagation();
        event.preventDefault();

        uploadInstructions.className = uploadInstructions.className.replace('is-dragover', "").trim();

        //get rid of old canvas
        while (editorBox.hasChildNodes()) {
            editorBox.removeChild(editorBox.lastChild);
        }
        if (myEditor) {
            myEditor.removeListener(constants.DRAW_EVENT, handleRedraw);
        }
        myEditor = new Editor((event.target.files || event.dataTransfer.files)[0]);
        //Attach listeners;
        myEditor.addEventListener(constants.DRAW_EVENT, handleRedraw);


        editorBox.appendChild(myEditor.canvas);


        window.editor = myEditor;

        saveButton.setAttribute('href', myEditor.save());

        uploadInstructions.className += " is-hidden";
        setControlValues();
    }

    function dragEnd(event) {
        console.log('dragEnd');
        event.preventDefault();
        uploadInstructions.className = uploadInstructions.className.replace('is-dragover', "").trim();
    }

    function dragStart(event) {
        console.log('dragStart');
        event.preventDefault();
        event.stopPropagation();
        uploadInstructions.className += (/is-dragover/).test(uploadInstructions.className) ? "" : " is-dragover";
    }

    function endMove(e) {
        var canMouseX = parseInt(e.clientX, 10) - appState.mouseStartX;
        var canMouseY = parseInt(e.clientY, 10) - appState.mouseStartY;
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

    function cropping(e) {
        var canMouseX = parseInt(e.clientX, 10) - appState.mouseStartX;
        var canMouseY = parseInt(e.clientY, 10) - appState.mouseStartY;
        // if the crop flag is set, clear the canvas and draw the image
        if (appState.isCropping) {
            drawInvertedBox({
                x: appState.mouseStartX - appState.offset.left,
                y: appState.mouseStartY - appState.offset.top,
                width: canMouseX,
                height: canMouseY
            });
        }
    }

    function drawBox(args) {
        args = args || {};
        myEditor.redrawImage();
        myEditor.canvasContext.fillStyle = 'rgba(255,255,255,0.4)';
        myEditor.canvasContext.fillRect((args.x || 0), (args.y || 0), (args.width || 0), (args.height || 0));
    }

    function drawInvertedBox(args) {

        args = args || {};

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

    function endCrop(e) {
        if(e.clientX && e.clientY) {
            appState.mouseEndX = parseInt(e.clientX, 10) - appState.mouseStartX;
            appState.mouseEndY = parseInt(e.clientY, 10) - appState.mouseStartY;
            if (appState.isCropping) {
                myEditor.crop({
                    x: (appState.mouseEndX > 0) ? appState.mouseStartX - appState.offset.left : parseInt(e.clientX, 10) - appState.offset.left,
                    y: (appState.mouseEndY > 0) ? appState.mouseStartY - appState.offset.top : parseInt(e.clientY, 10) - appState.offset.top,
                    width: Math.abs(appState.mouseEndX),
                    height: Math.abs(appState.mouseEndY)
                })
            }
        }
        // clear the crop flag
        appState.isCropping = false;
    }

    function moving(e) {
        var canMouseX = parseInt(e.clientX, 10) - appState.mouseStartX;
        var canMouseY = parseInt(e.clientY, 10) - appState.mouseStartY;
        // if the move flag is set, clear the canvas and draw the image
        if (appState.isMoving) {
            myEditor.move({
                x: canMouseX,
                y: canMouseY
            });
            //   myEditor.canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            //   myEditor.canvasContext.drawImage(myEditor.originalImage, canMouseX - 128 / 2, canMouseY - 120 / 2, 128, 120);
        }
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

    function redo() {
        myEditor.redo();
    }

    function rotate(event) {
        myEditor.rotate(parseFloat(event.currentTarget.value));
        myEditor.saveState();
    }

    function save(event) {
        saveButton.href = myEditor.canvas.toDataURL(myEditor.mimeType);
        saveButton.download = myEditor.fileName;
    }

    function saveState(event) {
        event.preventDefault();
        myEditor.saveState();
    }

    function scalePic(event) {
        myEditor.scale(event.target.value);
     }

    function setControlValues() {
        scaleControl.innerHTML = appState.scale;

    }

    function startCrop(e) {
        appState.mouseStartX = parseInt(e.clientX, 10);
        appState.mouseStartY = parseInt(e.clientY, 10);
        // set the crop flag
        appState.isCropping = true;
    }

    function startMove(e) {
        appState.mouseStartX = parseInt(e.clientX, 10);
        appState.mouseStartY = parseInt(e.clientY, 10);
        // set the move flag
        appState.isMoving = true;
    }

    function startOver(event) {
        event.preventDefault();
        editorBox.removeChild(myEditor.canvas);
        myEditor = null;
        fileInput.value = null;
        uploadInstructions.className = uploadInstructions.className.replace("is-hidden", "").trim();
    }

    function undo() {
        myEditor.undo();
    }

    function zoomPic(event) {
        myEditor.zoom(parseInt(event.target.value, 10));
    }

    function toggleSpinner(action) {
        var isHidden = /is-hidden/.test(spinner.className);
        switch (action) {
            case 'hide' :
                spinner.className = isHidden ? spinner.className.trim() : spinner.className + " is-hidden";
                break;
            case 'show' :
                spinner.className = isHidden ? spinner.className.replace("is-hidden", "").trim() : spinner.className.trim();
                break;
            default :
                spinner.className = isHidden ? spinner.className.replace("is-hidden", "").trim() : spinner.className + " is-hidden";
                break;
        }
    }


    fileInput.addEventListener('change', addPic);
    scaleControl.addEventListener('input', scalePic);
    scaleControl.addEventListener('blur', saveState);
    undoControl.addEventListener('click', undo);
    redoControl.addEventListener('click', redo);

    cropControl.addEventListener('change', cropPic);
    saveButton.addEventListener('click', save);
    rotateLeft.addEventListener('click', rotate);
    rotateRight.addEventListener('click', rotate);
    clearImageControl.addEventListener('click', startOver);
    zoomControl.addEventListener('input', zoomPic);

    if (isAdvancedUpload) {
        uploadInstructions.className += " has-advanced-upload";
        uploadInstructions.addEventListener("dragover", dragStart);
        uploadInstructions.addEventListener("dragend", dragEnd);
        uploadInstructions.addEventListener("dragleave", dragEnd);
        uploadInstructions.addEventListener("drop", addPic);
    }


}());
