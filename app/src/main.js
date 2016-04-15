import {Editor} from "./editor";
import {getOffset} from "./utilities";
import {constants} from "./constants";
import {AppState} from "./app-state";
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
    var workspace = document.getElementById('workspace');
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

    var appState = new AppState();

    function resetAppState() {
        setAppState(new AppState());
    }

    function setAppState(state) {
        function setControls(state) {
            Object.keys(state).forEach(key => {
                    switch (key) {
                        case "scale" :
                            scaleValue.innerHTML = state.scale;
                            scaleControl.value = state.scale;
                            break;
                        case "zoom" :
                            zoomValue.innerHTML = state.zoom;
                            zoomControl.value = state.zoom;
                            break;
                        case "rotation" :
                            rotationValue.innerHTML = state.rotation;
                            break;
                        case "isCropMode" :
                            console.log('crop case');
                            console.log(state.isCropMode);
                            if (state.isCropMode) {
                                cropControl.className += (/is-active/).test(cropControl.className) ? "" : " is-active";
                                if (myEditor) {
                                    myEditor.canvas.setAttribute('class', (myEditor.canvas.className + (/is-cropping/).test(myEditor.canvas.className) ? "" : " is-cropping"));
                                    myEditor.canvas.addEventListener('mousedown', startCrop);
                                    myEditor.canvas.addEventListener('mousemove', cropping);
                                    myEditor.canvas.addEventListener('mouseup', endCrop);
                                    myEditor.canvas.addEventListener('mouseout', endCrop);
                                }
                                break;
                            }
                            cropControl.className = cropControl.className.replace(/is-active/g, "").trim();
                            if (myEditor) {
                                myEditor.canvas.setAttribute('class', myEditor.canvas.className.replace("is-cropping", "").trim());
                                myEditor.canvas.removeEventListener('mousedown', startCrop);
                                myEditor.canvas.removeEventListener('mousemove', cropping);
                                myEditor.canvas.removeEventListener('mouseup', endCrop);
                                myEditor.canvas.removeEventListener('mouseout', endCrop);
                            }
                            break;
                        case "isLastHistory" :
                            if (state.isLastHistory) {
                                redoControl.setAttribute('disabled', 'disabled');
                                break;
                            }
                            redoControl.removeAttribute('disabled');
                            break;
                        case "isFirstHistory" :
                            if (state.isFirstHistory) {
                                undoControl.setAttribute('disabled', 'disabled');
                                break;
                            }
                            undoControl.removeAttribute('disabled');
                            break;
                        case "hasPhoto" :
                            if (state.hasPhoto) {
                                workspace.className = workspace.className + " has-photo";
                                scaleControl.removeAttribute('disabled');
                                cropControl.removeAttribute('disabled');
                                clearImageControl.removeAttribute('disabled');
                                zoomControl.removeAttribute('disabled');
                                rotateRight.removeAttribute('disabled');
                                rotateLeft.removeAttribute('disabled');
                                saveButton.removeAttribute('disabled');
                                break;
                            }
                            workspace.className = workspace.className.replace(/has-photo/g, "").trim();
                            scaleControl.setAttribute('disabled', 'disabled');
                            cropControl.setAttribute('disabled', 'disabled');
                            clearImageControl.setAttribute('disabled', 'disabled');
                            zoomControl.setAttribute('disabled', 'disabled');
                            undoControl.setAttribute('disabled', 'disabled');
                            redoControl.setAttribute('disabled', 'disabled');
                            rotateRight.setAttribute('disabled', 'disabled');
                            rotateLeft.setAttribute('disabled', 'disabled');
                            saveButton.setAttribute('disabled', 'disabled');
                            fileInput.value = null;
                            break;
                        case "isDragging" :
                            console.log('drag case');
                            console.log(state.isDragging);
                            if (state.isDragging) {
                                workspace.className += (/is-dragover/).test(workspace.className) ? "" : " is-dragover";
                                break;
                            }
                            workspace.className = workspace.className.replace(/is-dragover/g, "").trim();
                            break;
                        case "spinnerIsVisible" :
                            var isHidden = /is-hidden/.test(spinner.className);

                            if (state.spinnerIsVisible) {
                                spinner.className = isHidden ? spinner.className.replace(/is-hidden/g, "").trim() : spinner.className.trim();
                                break;
                            }
                            spinner.className = isHidden ? spinner.className.trim() : spinner.className + " is-hidden";
                            break;

                    }
                }
            );

        }

        appState = AppState.merge(appState, state);

        setControls(state);
    }

    function handleRedraw() {
        var editorState = myEditor.getState();
        setAppState({
            zoom: Math.round(editorState.zoom * 100),
            scale: Math.round(editorState.scale * 100),
            isLastHistory: editorState.isLastHistory,
            isFirstHistory: editorState.isFirstHistory,
            rotation: editorState.rotation
        });
    }

    function handleHistoryChange() {
        var editorState = myEditor.getState();
        setAppState({
            isLastHistory: editorState.isLastHistory,
            isFirstHistory: editorState.isFirstHistory,
            zoom: Math.round(editorState.zoom * 100),
            scale: Math.round(editorState.scale * 100),
            rotation: editorState.rotation,
            offset: getOffset(myEditor.canvas)
        });
    }

    function addPic(event) {
        console.log('addpic');
        event.stopPropagation();
        event.preventDefault();
        setAppState({spinnerIsVisible: true});
        if (myEditor) {
            myEditor.removeListener(constants.DRAW_EVENT, handleRedraw);
            myEditor.removeListener(constants.HISTORY_CHANGE, handleHistoryChange);
            myEditor.removeListener(constants.IMAGE_LOADED, resetAppState);
        }

        //get rid of old canvas
        while (editorBox.hasChildNodes()) {
            editorBox.removeChild(editorBox.lastChild);
        }
        myEditor = new Editor((event.target.files || event.dataTransfer.files)[0]);

        //Attach listeners;
        myEditor.addEventListener(constants.DRAW_EVENT, handleRedraw);
        myEditor.addEventListener(constants.HISTORY_CHANGE, handleHistoryChange);
        myEditor.addEventListener(constants.IMAGE_LOADED, setAppState.bind(this, {
            hasPhoto: true,
            spinnerIsVisible: false
        }));

        saveButton.setAttribute('href', myEditor.save());
        editorBox.appendChild(myEditor.canvas);
        //TODO : remove this hack
        window.editor = myEditor;
    }

    function dragEnd(event) {
        event.preventDefault();
        event.stopPropagation();
        setAppState({isDragging: false});
    }

    function dragStart(event) {
        event.preventDefault();
        event.stopPropagation();
        setAppState({isDragging: true});
    }


    function cropButtonClick(event) {
        event.stopPropagation();
        if (appState.isCropMode) {
            setAppState({isCropMode: false, isCropping: false});
            return;
        }
        setAppState({
            offset: getOffset(myEditor.canvas),
            isCropMode: true
        });

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
        console.log("end crop " + e.clientX + " : " + e.clientY);
        var zoomRatio = appState.zoom / 100;
        if (e.clientX && e.clientY) {
            setAppState({
                mouseEndX: parseInt(e.clientX, 10) - appState.mouseStartX,
                mouseEndY: parseInt(e.clientY, 10) - appState.mouseStartY
            });

            if (appState.isCropping) {
                myEditor.crop({
                    x: (appState.mouseEndX > 0) ? (appState.mouseStartX - appState.offset.left) * zoomRatio : (parseInt(e.clientX, 10) - appState.offset.left) * zoomRatio,
                    y: (appState.mouseEndY > 0) ? (appState.mouseStartY - appState.offset.top) * zoomRatio : (parseInt(e.clientY, 10) - appState.offset.top) * zoomRatio,
                    width: Math.abs(appState.mouseEndX * zoomRatio),
                    height: Math.abs(appState.mouseEndY * zoomRatio)
                })
            }
        }
        // clear the crop flag
        setAppState({isCropping: false});
    }


    function redo() {
        myEditor.redo();
    }

    function rotate(event) {
        event.stopPropagation();
        myEditor.rotate(parseFloat(event.currentTarget.value));
        myEditor.saveState();
    }

    function save(event) {
        event.stopPropagation();
        saveButton.href = myEditor.canvas.toDataURL(myEditor.mimeType);
        saveButton.download = myEditor.fileName;
    }

    function saveState(event) {
        event.preventDefault();
        myEditor.saveState();
    }

    function scalePic(event) {
        event.stopPropagation();
        myEditor.scale(event.target.value);
    }

    function startCrop(e) {
        console.log("start crop " + e.clientX + " : " + e.clientY);
        if (appState.isCropMode) {
            setAppState({
                isCropping: true,
                mouseStartX: parseInt(e.clientX, 10),
                mouseStartY: parseInt(e.clientY, 10)
            });
        }
    }


    function startOver(event) {
        event.preventDefault();
        myEditor = null;
        while (editorBox.hasChildNodes()) {
            editorBox.removeChild(editorBox.lastChild);
        }
        resetAppState();
    }

    function undo() {
        myEditor.undo();
    }

    function zoomPic(event) {
        myEditor.zoom(parseInt(event.target.value, 10));
    }


    resetAppState();
    fileInput.addEventListener('change', addPic);
    scaleControl.addEventListener('input', scalePic);
    scaleControl.addEventListener('blur', saveState);
    undoControl.addEventListener('click', undo);
    redoControl.addEventListener('click', redo);

    cropControl.addEventListener('click', cropButtonClick);
    saveButton.addEventListener('click', save);
    rotateLeft.addEventListener('click', rotate);
    rotateRight.addEventListener('click', rotate);
    clearImageControl.addEventListener('click', startOver);
    zoomControl.addEventListener('input', zoomPic);

    if (isAdvancedUpload) {
        workspace.addEventListener("drop", addPic);
        uploadInstructions.className += " has-advanced-upload";
        workspace.addEventListener("dragover", dragStart);
        workspace.addEventListener("dragend", dragEnd);
        workspace.addEventListener("dragleave", dragEnd);
    }


}());
