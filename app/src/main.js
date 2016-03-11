import {default as Editor} from './editor';
import {getOffset} from "./utilities";
import EditorState from "./editor-state";

(function () {
    "use strict";

    var fileInput = document.getElementById("fileInput");
    var scaleControl = document.getElementById("scaleImageControl");
    var moveControl = document.getElementById("moveImageControl");
    var cropControl = document.getElementById("cropImageControl");
    var editorBox = document.getElementById("editor");
    var saveButton = document.getElementById("save");
    var rotateRight= document.getElementById("rotateRight");
    var rotateLeft = document.getElementById("rotateLeft");
    var myEditor;
    let appState = {
        mouseStartX : null,
        mouseStartY : null,
        mouseEndX : null,
        mouseEndY : null,
        offset : null,
        canvasWidth : null,
        canvasHeight : null,
        isDragging : null,
        isCropping : null
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

    function startDrag(e) {
        console.log(e);
        appState.mouseStartX = parseInt(e.clientX, 10);
        appState.mouseStartY = parseInt(e.clientY, 10);
        console.log('start-drag : X ' + mouseStartX + ' Y ' + mouseStartY);
        // set the drag flag
        appState.isDragging = true;
    }

    function dragging(e) {
        var canMouseX = parseInt(e.clientX, 10) - mouseStartX;
        var canMouseY = parseInt(e.clientY, 10) - mouseStartY;
        // if the drag flag is set, clear the canvas and draw the image
        if (appState.isDragging) {
            console.log('drag : X ' + canMouseX + ' Y ' + canMouseY);

            myEditor.draw(new EditorState({
                x: canMouseX,
                y: canMouseY
            }));
            //   myEditor.canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            //   myEditor.canvasContext.drawImage(myEditor.originalImage, canMouseX - 128 / 2, canMouseY - 120 / 2, 128, 120);
        }
    }

    function endDrag(e) {
        console.log(e);
        var canMouseX = parseInt(e.clientX, 10) - mouseStartX;
        var canMouseY = parseInt(e.clientY, 10) - mouseStartY;
        console.log('end-drag : X ' + canMouseX + ' Y ' + canMouseY);
        if (appState.isDragging) {
            myEditor.move({
                x: (canMouseX),
                y: (canMouseY)
            })
        }
        // clear the drag flag
        appState.isDragging = false;
    }



    function startCrop(e) {
        console.log(e);

        appState.mouseStartX = parseInt(e.clientX, 10);
        appState.mouseStartY = parseInt(e.clientY, 10);
        console.log('start-crop : X ' + mouseStartX + ' Y ' + mouseStartY);

        // set the crop flag
        appState.isCropping = true;
    }

    function cropping(e) {
        var canMouseX = parseInt(e.clientX, 10) - mouseStartX;
        var canMouseY = parseInt(e.clientY, 10) - mouseStartY;
        // if the crop flag is set, clear the canvas and draw the image
        if (appState.isCropping) {
            // console.log('crop : X ' + mouseStartX - offset.left + ' Y ' +  mouseStartY - offset.top);

            myEditor.drawBox({
                sx: mouseStartX - offset.left,
                sy: mouseStartY - offset.top,
                swidth : canMouseX,
                sheight : canMouseY
            });
            //   myEditor.canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            //   myEditor.canvasContext.drawImage(myEditor.originalImage, canMouseX - 128 / 2, canMouseY - 120 / 2, 128, 120);
        }
    }

    function endCrop(e) {
        console.log(e);
        appState.mouseEndX = parseInt(e.clientX, 10) - mouseStartX;
        appState. mouseEndY = parseInt(e.clientY, 10) - mouseStartY;

        console.log('end-crop : X ' + mouseEndX + ' Y ' + mouseEndY);
        if (appState.isCropping) {
            myEditor.crop({
                sx: (mouseEndX > 0) ?  mouseStartX - offset.left : parseInt(e.clientX, 10) - offset.left,
                sy: (mouseEndY > 0) ?  mouseStartY - offset.top : parseInt(e.clientY, 10) - offset.top,
                swidth : Math.abs(mouseEndX),
                sheight : Math.abs(mouseEndY)
            })
        }
        // clear the crop flag
        appState.isCropping = false;
    }



    function movePic(event) {

        if (event.target.checked) {
            myEditor.canvas.setAttribute('class', (myEditor.canvas.className + " is-moving").trim());
            myEditor.canvas.addEventListener('mousedown', startDrag);
            myEditor.canvas.addEventListener('mousemove', dragging);
            myEditor.canvas.addEventListener('mouseup', endDrag);
            myEditor.canvas.addEventListener('mouseout', endDrag);


        } else {
            myEditor.canvas.setAttribute('class', myEditor.canvas.className.replace("is-moving", "").trim());
            myEditor.canvas.removeEventListener('mousedown', startDrag);
            myEditor.canvas.removeEventListener('mousemove', dragging);
            myEditor.canvas.removeEventListener('mouseup', endDrag);
            myEditor.canvas.removeEventListener('mouseout', endDrag);
        }
    }

    function cropPic(event) {

        if (event.target.checked) {
            offset = getOffset(myEditor.canvas);
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

    function save(event){
        saveButton.href=myEditor.canvas.toDataURL(myEditor.mimeType);
        saveButton.download = myEditor.fileName;
    }

    function rotate(event){
        console.log('rotate ' +  parseFloat(event.currentTarget.value));

             myEditor.rotate(parseFloat(event.currentTarget.value));


    }
    
    fileInput.addEventListener('change', addPic);
    scaleControl.addEventListener('input', scalePic);
    moveControl.addEventListener('change', movePic);
    cropControl.addEventListener('change', cropPic);
    saveButton.addEventListener('click', save);
    rotateLeft.addEventListener('click', rotate);
    rotateRight.addEventListener('click', rotate);

}());
