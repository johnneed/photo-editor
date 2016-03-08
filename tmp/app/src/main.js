"use strict";

var _editor = require("./editor");

var _editor2 = _interopRequireDefault(_editor);

var _utilities = require("./utilities");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
    "use strict";

    var fileInput = document.getElementById("fileInput");
    var scaleControl = document.getElementById("scaleImageControl");
    var moveControl = document.getElementById("moveImageControl");
    var cropControl = document.getElementById("cropImageControl");
    var editorBox = document.getElementById("editor");
    var saveButton = document.getElementById("save");
    var rotateControl0 = document.getElementById("rotateImageControl0");
    var rotateControl90 = document.getElementById("rotateImageControl90");
    var rotateControl180 = document.getElementById("rotateImageControl180");
    var rotateControl270 = document.getElementById("rotateImageControl270");
    var myEditor;
    var mouseStartX;
    var mouseStartY;
    var mouseEndX;
    var mouseEndY;
    var offset;
    var canvasWidth;
    var canvasHeight;
    var isDragging;
    var isCropping;

    function addPic(event) {
        myEditor = new _editor2.default(event.target.files[0]);

        while (editorBox.hasChildNodes()) {
            editorBox.removeChild(editorBox.lastChild);
        }
        editorBox.appendChild(myEditor.canvas);
        offset = (0, _utilities.getOffset)(myEditor.canvas);

        canvasWidth = myEditor.canvas.width;
        canvasHeight = myEditor.canvas.height;

        window.editor = myEditor;
        saveButton.setAttribute('href', myEditor.save());
    }

    function scalePic(event) {
        console.log('scalePic : ' + event.target.value);
        myEditor.scale(event.target.value);
    }

    function startDrag(e) {
        console.log(e);
        mouseStartX = parseInt(e.clientX, 10);
        mouseStartY = parseInt(e.clientY, 10);
        console.log('start-drag : X ' + mouseStartX + ' Y ' + mouseStartY);

        // set the drag flag
        isDragging = true;
    }

    function endDrag(e) {
        console.log(e);
        var canMouseX = parseInt(e.clientX, 10) - mouseStartX;
        var canMouseY = parseInt(e.clientY, 10) - mouseStartY;
        console.log('end-drag : X ' + canMouseX + ' Y ' + canMouseY);
        if (isDragging) {
            myEditor.move({
                x: canMouseX,
                y: canMouseY
            });
        }
        // clear the drag flag
        isDragging = false;
    }

    function dragging(e) {
        var canMouseX = parseInt(e.clientX, 10) - mouseStartX;
        var canMouseY = parseInt(e.clientY, 10) - mouseStartY;
        // if the drag flag is set, clear the canvas and draw the image
        if (isDragging) {
            console.log('drag : X ' + canMouseX + ' Y ' + canMouseY);

            myEditor.redraw({
                x: canMouseX,
                y: canMouseY
            });
            //   myEditor.canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            //   myEditor.canvasContext.drawImage(myEditor.originalImage, canMouseX - 128 / 2, canMouseY - 120 / 2, 128, 120);
        }
    }

    function startCrop(e) {
        console.log(e);

        mouseStartX = parseInt(e.clientX, 10);
        mouseStartY = parseInt(e.clientY, 10);
        console.log('start-crop : X ' + mouseStartX + ' Y ' + mouseStartY);

        // set the crop flag
        isCropping = true;
    }

    function cropping(e) {
        var canMouseX = parseInt(e.clientX, 10) - mouseStartX;
        var canMouseY = parseInt(e.clientY, 10) - mouseStartY;
        // if the crop flag is set, clear the canvas and draw the image
        if (isCropping) {
            // console.log('crop : X ' + mouseStartX - offset.left + ' Y ' +  mouseStartY - offset.top);

            myEditor.drawBox({
                sx: mouseStartX - offset.left,
                sy: mouseStartY - offset.top,
                swidth: canMouseX,
                sheight: canMouseY
            });
            //   myEditor.canvasContext.clearRect(0, 0, canvasWidth, canvasHeight);
            //   myEditor.canvasContext.drawImage(myEditor.originalImage, canMouseX - 128 / 2, canMouseY - 120 / 2, 128, 120);
        }
    }

    function endCrop(e) {
        console.log(e);
        mouseEndX = parseInt(e.clientX, 10) - mouseStartX;
        mouseEndY = parseInt(e.clientY, 10) - mouseStartY;

        console.log('end-crop : X ' + mouseEndX + ' Y ' + mouseEndY);
        if (isCropping) {
            myEditor.crop({
                sx: mouseEndX > 0 ? mouseStartX - offset.left : parseInt(e.clientX, 10) - offset.left,
                sy: mouseEndY > 0 ? mouseStartY - offset.top : parseInt(e.clientY, 10) - offset.top,
                swidth: Math.abs(mouseEndX),
                sheight: Math.abs(mouseEndY)
            });
        }
        // clear the crop flag
        isCropping = false;
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
            offset = (0, _utilities.getOffset)(myEditor.canvas);
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
        if (event.target.checked) {
            myEditor.rotate(parseInt(event.target.value, 10));
        }
    }

    fileInput.addEventListener('change', addPic);
    scaleControl.addEventListener('input', scalePic);
    moveControl.addEventListener('change', movePic);
    cropControl.addEventListener('change', cropPic);
    saveButton.addEventListener('click', save);
    rotateControl0.addEventListener('change', rotate);
    rotateControl90.addEventListener('change', rotate);
    rotateControl180.addEventListener('change', rotate);
    rotateControl270.addEventListener('change', rotate);
})();
//# sourceMappingURL=main.js.map
