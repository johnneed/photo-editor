import {Editor} from "./editor";
import {getOffset} from "./utilities";
import {constants} from "./constants";
import {AppState} from "./app-state";
require("core-js");

function createElem(args) {
    var elem = document.createElement((args.tag || "DIV").toUpperCase());
    if(args.className){elem.className = args.className.trim()};
    if(args.id){elem.id = args.id;}
    (Array.isArray(args.children) ? args.children : [args.children]).forEach(el => {
        var child = typeof el === "string" ? document.createTextNode(el) : createElem(el)
        elem.appendChild(child)
    });
    return elem;
}

function createControlSet(args) {
    var name = args.name.charAt(0).toUpperCase() + args.name.slice(1, args.name.length).toLowerCase();
    var controlSet = createElem({
        id: "controlSet" + name,
        className: "photo-widget_control-group module-control-group",
        tag: "DIV",
        name: args.name,
        children: [{
            tag: "DIV", className: "module-control-group_container", children: [
                {
                    tag: "DIV", className: "module-control-group_tool-group-container", children: [
                    {
                        tag: "DIV",
                        className: "module-control-group_tool-group-" + args.name.toLowerCase().trim(),
                        children: [
                            {
                                tag: "DIV",
                                className: "module-" + args.name.toLowerCase().trim() + "-control",
                                children: [
                                    {
                                        tag: "BUTTON", id: "clearImageControl", className: "", children: [
                                        {tag: "I", className: "icon-cancel-circle", children: []}
                                    ]
                                    }
                                ]
                            },
                            {tag: "DIV", className: "", children: [{tag: "SPAN", className: "", children: name}]}
                        ]
                    }
                ]
                }
            ]
        }]
    });
    return controlSet;
}

var controlSets = [
    {name: "reset"}
];

controlSets.forEach(cs => {
    var node = createControlSet(cs);
    document.getElementsByClassName("photo-widget_tab-panels")[0].appendChild(node)
});

var stateRules = [
    {
        id: "scale",
        execute: function (state) {
            scaleValue.innerHTML = state.scale;
            scaleControl.value = state.scale;
            if (!isNaN(state.scale) && state.scale !== 100) {
                resetScaleButton.removeAttribute("disabled");

            } else {
                resetScaleButton.setAttribute("disabled", "disabled");
            }
            setEditorBoxClass("is-scaling");
        }
    },
    {
        id: "zoom",
        execute: function (state) {
            zoomValue.innerHTML = state.zoom;
            zoomControl.value = state.zoom;
            setEditorBoxClass(constants.IS_ZOOMING);
        }
    },
    {
        id: "rotation",
        execute: function (state) {
            let deg = ((isNaN(state.rotation) ? 0 : state.rotation) / Math.PI * 180);
            rotationValue.innerHTML = deg;
            setEditorBoxClass(constants.IS_ROTATING);
        }
    },
    {
        id: "isCropMode",
        execute: function (state) {
            if (myEditor) {
                if (state.isCropMode) {
                    if (!cropBoxControls) {
                        console.log("cropBoxControl RESET");
                        cropBoxControls = resetCropBoxDragControls(300, 300);
                    }
                    drawCropBox({
                        x: cropBoxControls.topLeft.x,
                        y: cropBoxControls.topLeft.y,
                        width: cropBoxControls.topRight.x - cropBoxControls.topLeft.x,
                        height: cropBoxControls.bottomLeft.y - cropBoxControls.topLeft.y
                    });
                    cropBoxControls = resetCropBoxDragControls();
                    myEditor.canvas.setAttribute("class", (myEditor.canvas.className + (/is-cropping/).test(myEditor.canvas.className) ? "" : " is-cropping"));
                    myEditor.canvas.addEventListener("mousedown", startCrop);
                    myEditor.canvas.addEventListener("mousemove", cropping);
                    myEditor.canvas.addEventListener("mouseup", endCrop);
                    myEditor.canvas.addEventListener("mouseout", endCrop);
                    return;
                }
                myEditor.canvas.setAttribute("class", myEditor.canvas.className.replace("is-cropping", "").trim());
                myEditor.canvas.removeEventListener("mousedown", startCrop);
                myEditor.canvas.removeEventListener("mousemove", cropping);
                myEditor.canvas.removeEventListener("mouseup", endCrop);
                myEditor.canvas.removeEventListener("mouseout", endCrop);
                myEditor.redrawImage();
            }
        }
    },
    {
        id: "isLastHistory",
        execute: function (state) {
            if (state.isLastHistory) {
                redoControl.setAttribute("disabled", "disabled");
                return;
            }
            redoControl.removeAttribute("disabled");
        }
    },
    {
        id: "isFirstHistory",
        execute: function (state) {
            if (state.isFirstHistory) {
                undoControl.setAttribute("disabled", "disabled");
                return;
            }
            undoControl.removeAttribute("disabled");
        }
    },
    {
        id: "hasPhoto",
        execute: function (state) {
            if (state.hasPhoto) {

                workspace.className = workspace.className + " has-photo";
                switchButtons.forEach(function (control) {
                    control.removeAttribute("disabled");
                });
                scaleControl.removeAttribute("disabled");
                cropControl.removeAttribute("disabled");
                clearImageControl.removeAttribute("disabled");
                zoomControl.removeAttribute("disabled");
                rotateRight.removeAttribute("disabled");
                rotateLeft.removeAttribute("disabled");
                saveButton.removeAttribute("disabled");
                resetScaleButton.removeAttribute("disabled");
                zoom100Button.removeAttribute("disabled");
                zoom50Button.removeAttribute("disabled");
                zoom200Button.removeAttribute("disabled");
                zoom500Button.removeAttribute("disabled");
                return;
            }
            workspace.className = workspace.className.replace(/has-photo/g, "").trim();
            switchButtons.forEach(function (control) {
                control.setAttribute("disabled", "disabled");
            });
            scaleControl.setAttribute("disabled", "disabled");
            cropControl.setAttribute("disabled", "disabled");
            clearImageControl.setAttribute("disabled", "disabled");
            zoomControl.setAttribute("disabled", "disabled");
            undoControl.setAttribute("disabled", "disabled");
            redoControl.setAttribute("disabled", "disabled");
            rotateRight.setAttribute("disabled", "disabled");
            rotateLeft.setAttribute("disabled", "disabled");
            saveButton.setAttribute("disabled", "disabled");
            zoom100Button.setAttribute("disabled", "disabled");
            zoom50Button.setAttribute("disabled", "disabled");
            zoom200Button.setAttribute("disabled", "disabled");
            zoom500Button.setAttribute("disabled", "disabled");
            fileInput.value = null;

        }
    },
    {
        id: "isDragging",
        execute: function (state) {
            setEditorBoxClass(constants.IS_DRAGGING);
            if (state.isDragging) {
                workspace.className += (/is-dragover/).test(workspace.className) ? "" : " is-dragover";
                return;
            }
            workspace.className = workspace.className.replace(/is-dragover/g, "").trim();
            return;
        }
    },
    {
        id: "spinnerIsVisible",
        execute: function (state) {
            var isHidden = /is-hidden/.test(spinner.className);

            if (state.spinnerIsVisible) {
                spinner.className = isHidden ? spinner.className.replace(/is-hidden/g, "").trim() : spinner.className.trim();
                return;
            }
            spinner.className = isHidden ? spinner.className.trim() : spinner.className + " is-hidden";
        }
    },
    {
        id: "activeControlSet",
        execute: function (state) {
            controlSets.forEach(c => {
                    c.className = c.className.replace(/is-open/g, "").trim();
                    if (c.id === "controlSet" + state.activeControlSet) {
                        c.className = c.className + " is-open";
                    }
                }
            );
            switchButtons.forEach(b => {
                    b.className = b.className.replace(/is-active/g, "").trim();
                    if (b.id === "toolSwitch" + state.activeControlSet) {
                        b.className = b.className + " is-active";
                    }
                }
            );
        }
    },
    {
        id: "isPhotoBig",
        execute: function (state) {
            var isBig = /is-photo-big/.test(workspace.className);

            if (!state.isPhotoBig) {
                workspace.className = isBig ? workspace.className.replace(/is-photo-big/g, "").trim() : workspace.className.trim();
                return;
            }
            workspace.className = isBig ? workspace.className.trim() : workspace.className + " is-photo-big";
        }
    }
];

(function (stateRules) {
    "use strict";
    // Do we have drag and drop?
    var isAdvancedUpload = (function () {
        var div = document.createElement("div");
        return "draggable" in div || ("ondragstart" in div && "ondrop" in div) && "FormData" in window && "FileReader" in window;
    }());

    // find our controls
    var fileInput = document.getElementById("fileInput");
    var scaleControl = document.getElementById("scaleImageControl");
    var cropControl = document.getElementById("cropImageControl");
    var editorBox = document.getElementById("editor");
    var saveButton = document.getElementById("save");
    var rotateRight = document.getElementById("rotateRight");
    var rotateLeft = document.getElementById("rotateLeft");
    var undoControl = document.getElementById("undoControl");
    var redoControl = document.getElementById("redoControl");
    var resetScaleButton = document.getElementById("resetScale");
    var zoom100Button = document.getElementById("zoom100Button");
    var zoom50Button = document.getElementById("zoom50Button");
    var zoom200Button = document.getElementById("zoom200Button");
    var zoom500Button = document.getElementById("zoom500Button");
    var cropBoxControls;

    // Other stuff
    var uploadInstructions = document.getElementById("uploadInstructions");
    var workspace = document.getElementById("workspace");
    var clearImageControl = document.getElementById("clearImageControl");
    var zoomControl = document.getElementById("zoomControl");
    var spinner = document.getElementById("spinner");

    // find our labels
    var zoomValue = document.getElementById("zoomValue");
    var scaleValue = document.getElementById("scaleValue");
    // var heightValue = document.getElementById("heightValue");
    // var widthValue = document.getElementById("widthValue");
    var rotationValue = document.getElementById("rotationValue");
    var switchButtons = [...document.getElementsByClassName("module-control-group_tool-switch")];
    var toolSwitchCrop = document.getElementById("toolSwitchCrop");
    var controlSets = [...document.getElementsByClassName("module-control-group")];
    var myEditor;

    var appState = new AppState();

    function activeCropBoxDragControls(controls, x, y) {
        return Object.keys(controls).map((box) => {
            var control = controls[box];
            var isY = y <= control.y + 5 && y >= control.y - 5;
            var isX = x <= control.x + 5 && x >= control.x - 5;
            control.active = isY && isX;
        });

    }

    function setAppState(state) {
        function setControls(state) {
            Object.keys(state).forEach(key => {
                    switch (key) {
                        case "scale" :
                            scaleValue.innerHTML = state.scale;
                            scaleControl.value = state.scale;
                            if (!isNaN(state.scale) && state.scale !== 100) {
                                resetScaleButton.removeAttribute("disabled");

                            } else {
                                resetScaleButton.setAttribute("disabled", "disabled");
                            }
                            setEditorBoxClass("is-scaling");
                            break;
                        case "zoom" :
                            zoomValue.innerHTML = state.zoom;
                            zoomControl.value = state.zoom;
                            setEditorBoxClass(constants.IS_ZOOMING);
                            break;
                        case "rotation" :
                            let deg = ((isNaN(state.rotation) ? 0 : state.rotation) / Math.PI * 180);
                            rotationValue.innerHTML = deg;
                            setEditorBoxClass(constants.IS_ROTATING);
                            break;
                        case "isCropMode" :
                            //console.log("crop case");
                            //console.log(state.isCropMode);

                            if (myEditor) {
                                if (state.isCropMode) {
                                    if (!cropBoxControls) {
                                        console.log("cropBoxControl RESET");
                                        cropBoxControls = resetCropBoxDragControls(300, 300);
                                    }
                                    drawCropBox({
                                        x: cropBoxControls.topLeft.x,
                                        y: cropBoxControls.topLeft.y,
                                        width: cropBoxControls.topRight.x - cropBoxControls.topLeft.x,
                                        height: cropBoxControls.bottomLeft.y - cropBoxControls.topLeft.y
                                    });
                                    cropBoxControls = resetCropBoxDragControls();
                                    myEditor.canvas.setAttribute("class", (myEditor.canvas.className + (/is-cropping/).test(myEditor.canvas.className) ? "" : " is-cropping"));
                                    myEditor.canvas.addEventListener("mousedown", startCrop);
                                    myEditor.canvas.addEventListener("mousemove", cropping);
                                    myEditor.canvas.addEventListener("mouseup", endCrop);
                                    myEditor.canvas.addEventListener("mouseout", endCrop);
                                    break;
                                }

                                myEditor.canvas.setAttribute("class", myEditor.canvas.className.replace("is-cropping", "").trim());
                                myEditor.canvas.removeEventListener("mousedown", startCrop);
                                myEditor.canvas.removeEventListener("mousemove", cropping);
                                myEditor.canvas.removeEventListener("mouseup", endCrop);
                                myEditor.canvas.removeEventListener("mouseout", endCrop);
                                myEditor.redrawImage();
                            }
                            break;

                        case   "isLastHistory"   :
                            if (state.isLastHistory) {
                                redoControl.setAttribute("disabled", "disabled");
                                break;
                            }
                            redoControl.removeAttribute("disabled");
                            break;
                        case       "isFirstHistory"   :
                            if (state.isFirstHistory) {
                                undoControl.setAttribute("disabled", "disabled");
                                break;
                            }
                            undoControl.removeAttribute("disabled");
                            break;
                        case  "hasPhoto"     :
                            if (state.hasPhoto) {

                                workspace.className = workspace.className + " has-photo";
                                switchButtons.forEach(function (control) {
                                    control.removeAttribute("disabled");
                                });
                                scaleControl.removeAttribute("disabled");
                                cropControl.removeAttribute("disabled");
                                clearImageControl.removeAttribute("disabled");
                                zoomControl.removeAttribute("disabled");
                                rotateRight.removeAttribute("disabled");
                                rotateLeft.removeAttribute("disabled");
                                saveButton.removeAttribute("disabled");
                                resetScaleButton.removeAttribute("disabled");
                                zoom100Button.removeAttribute("disabled");
                                zoom50Button.removeAttribute("disabled");
                                zoom200Button.removeAttribute("disabled");
                                zoom500Button.removeAttribute("disabled");
                                break;
                            }
                            workspace.className = workspace.className.replace(/has-photo/g, "").trim();
                            switchButtons.forEach(function (control) {
                                control.setAttribute("disabled", "disabled");
                            });
                            scaleControl.setAttribute("disabled", "disabled");
                            cropControl.setAttribute("disabled", "disabled");
                            clearImageControl.setAttribute("disabled", "disabled");
                            zoomControl.setAttribute("disabled", "disabled");
                            undoControl.setAttribute("disabled", "disabled");
                            redoControl.setAttribute("disabled", "disabled");
                            rotateRight.setAttribute("disabled", "disabled");
                            rotateLeft.setAttribute("disabled", "disabled");
                            saveButton.setAttribute("disabled", "disabled");
                            zoom100Button.setAttribute("disabled", "disabled");
                            zoom50Button.setAttribute("disabled", "disabled");
                            zoom200Button.setAttribute("disabled", "disabled");
                            zoom500Button.setAttribute("disabled", "disabled");
                            fileInput.value = null;
                            break;
                        case "isDragging"    :
                            //console.log("drag case");
                            //console.log(state.isDragging);
                            setEditorBoxClass(constants.IS_DRAGGING);
                            if (state.isDragging) {
                                workspace.className += (/is-dragover/).test(workspace.className) ? "" : " is-dragover";
                                break;
                            }
                            workspace.className = workspace.className.replace(/is-dragover/g, "").trim();
                            break;
                        case  "spinnerIsVisible" :
                            var isHidden = /is-hidden/.test(spinner.className);

                            if (state.spinnerIsVisible) {
                                spinner.className = isHidden ? spinner.className.replace(/is-hidden/g, "").trim() : spinner.className.trim();
                                break;
                            }
                            spinner.className = isHidden ? spinner.className.trim() : spinner.className + " is-hidden";
                            break;
                        case   "activeControlSet" :
                            controlSets.forEach(c => {
                                    c.className = c.className.replace(/is-open/g, "").trim();
                                    if (c.id === "controlSet" + state.activeControlSet) {
                                        c.className = c.className + " is-open";
                                    }
                                }
                            );
                            switchButtons.forEach(b => {
                                    b.className = b.className.replace(/is-active/g, "").trim();
                                    if (b.id === "toolSwitch" + state.activeControlSet) {
                                        b.className = b.className + " is-active";
                                    }
                                }
                            );
                            break;
                        case
                        "isPhotoBig"
                        :
                            var isBig = /is-photo-big/.test(workspace.className);

                            if (!state.isPhotoBig) {
                                workspace.className = isBig ? workspace.className.replace(/is-photo-big/g, "").trim() : workspace.className.trim();
                                break;
                            }
                            workspace.className = isBig ? workspace.className.trim() : workspace.className + " is-photo-big";
                            break;

                    }
                }
            );
        }

        appState = AppState.merge(appState, state);

        setControls(state);
    }

    function resetAppState() {
        setAppState(new AppState());
    }

    function setEditorBoxClass(state) {
        state = (state && state.replace("_", "-").toLowerCase()) || "";
        var stateRegex = /(is\-cropping)|(is\-scaling)|(is\-dragging)|(is\-rotating)|(is\-zooming)|(is\-loading)|(is\-saving)|(is\-busy)/g;
        editorBox.className = (editorBox.className.replace(stateRegex, "").trim() + (!!state ? " " : "") + state);
    }

    function handleRedraw() {
        var editorState = myEditor.getState();
        setAppState({
            zoom: Math.round(editorState.zoom * 100),
            scale: Math.round(editorState.scale * 100),
            isLastHistory: editorState.isLastHistory,
            isFirstHistory: editorState.isFirstHistory,
            rotation: editorState.rotation,
            isPhotoBig: (myEditor.canvas.clientHeight > workspace.clientHeight)
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
        //console.log("addpic");
        event.stopPropagation();
        event.preventDefault();
        setAppState({spinnerIsVisible: true});
        if (myEditor) {
            myEditor.removeListener(constants.DRAW_EVENT, handleRedraw);
            myEditor.removeListener(constants.HISTORY_CHANGE, handleHistoryChange);
            myEditor.removeListener(constants.IMAGE_LOADED, resetAppState);
        }

        // get rid of old canvas
        while (editorBox.hasChildNodes()) {
            editorBox.removeChild(editorBox.lastChild);
        }
        myEditor = new Editor((event.target.files || event.dataTransfer.files)[0]);

        // Attach listeners;
        myEditor.addEventListener(constants.DRAW_EVENT, handleRedraw);
        myEditor.addEventListener(constants.HISTORY_CHANGE, handleHistoryChange);
        myEditor.addEventListener(constants.IMAGE_LOADED, setAppState.bind(this, {
            hasPhoto: true,
            spinnerIsVisible: false
        }));


        // saveButton.addEventListener("click", myEditor.save);
        editorBox.appendChild(myEditor.canvas);

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
        crop();

        // event.stopPropagation();
        // if (appState.isCropMode) {
        //     setAppState({
        //         isCropMode: false,
        //         isCropping: false
        //     });
        //     return;
        // }
        // setAppState({
        //     offset: getOffset(myEditor.canvas),
        //     isCropMode: true
        // });

    }

    function cropping(e) {
        var overControl = detectCropBoxDragControls(parseInt(e.offsetX, 10), parseInt(e.offsetY, 10));
        var activeSpot = Object.keys(cropBoxControls).filter(key => cropBoxControls[key].active)[0] || null;
        var startSpot = (function () {
            switch (activeSpot) {
                case "topLeft":
                    return cropBoxControls.bottomRight;
                case "bottomRight":
                    return cropBoxControls.topLeft;
                case "topRight":
                    return cropBoxControls.bottomLeft;
                case "bottomLeft":
                    return cropBoxControls.topRight;
                default :
                    return null;
            }
        }());
        var canMouseX = parseInt(e.offsetX, 10) - ((appState.withCropBoxControl && !!startSpot) ? startSpot.x : appState.mouseStartX);
        var canMouseY = parseInt(e.offsetY, 10) - ((appState.withCropBoxControl && !!startSpot) ? startSpot.y : appState.mouseStartY);


        // if the crop flag is set, clear the canvas and draw the image
        if (appState.isCropping) {

            drawCropBox({
                x: ((appState.withCropBoxControl && !!startSpot) ? startSpot.x : appState.mouseStartX) - appState.offset.left,
                y: ((appState.withCropBoxControl && !!startSpot) ? startSpot.y : appState.mouseStartY) - appState.offset.top,
                width: canMouseX,
                height: canMouseY
            });

        } else if (overControl) {
            drawCropBox();
        }
    }

    function resetCropBoxDragControls(boxHeight, boxWidth) {

        return {
            topLeft: {y: 10, x: 10, active: false},
            // top: {y: 10, x: 100, active: false},
            topRight: {y: 10, x: 200, active: false},
            // left: {y: 100, x: 10, active: false},
            // right: {y: 100, x: 200, active: false},
            bottomLeft: {y: 200, x: 10, active: false},
            // bottom: {y: 200, x: 100, active: false},
            bottomRight: {y: 200, x: 200, active: true}
        };
    }

    function drawCropBox(args) {
        args = args || {
                x: cropBoxControls.topLeft.x,
                y: cropBoxControls.topLeft.y,
                width: ( cropBoxControls.topRight.x - cropBoxControls.topLeft.x),
                height: ( cropBoxControls.bottomRight.y - cropBoxControls.topRight.y)
            };
        console.log(JSON.stringify(args));
        drawInvertedBox(args);
        Object.assign(cropBoxControls.topLeft, {x: args.x, y: args.y});
        Object.assign(cropBoxControls.topRight, {x: args.x + args.width, y: args.y});
        Object.assign(cropBoxControls.bottomLeft, {x: args.x, y: args.y + args.height});
        Object.assign(cropBoxControls.bottomRight, {x: args.x + args.width, y: args.y + args.height});
        Object.keys(cropBoxControls).forEach((box) => {
            myEditor.canvasContext.beginPath();
            myEditor.canvasContext.lineWidth = "1";
            myEditor.canvasContext.fillStyle = cropBoxControls[box].active ? "rgba(255,255,255,0)" : "rgba(255,255,255,0.8)";
            myEditor.canvasContext.strokeStyle = cropBoxControls[box].active ? "rgba(255,0,0,1)" : "rgba(255,0,0,0.5)";
            myEditor.canvasContext.rect(cropBoxControls[box].x - 5, cropBoxControls[box].y - 5, 10, 10);
            myEditor.canvasContext.fillRect(cropBoxControls[box].x - 5, cropBoxControls[box].y - 5, 10, 10);
            myEditor.canvasContext.stroke();
        });
    }

    function drawBox(args) {
        args = args || {};
        myEditor.redrawImage();
        myEditor.canvasContext.fillStyle = "rgba(255,255,255,0.4)";
        myEditor.canvasContext.fillRect((args.x || 0), (args.y || 0), (args.width || 0), (args.height || 0));
    }

    function drawInvertedBox(args) {

        args = args || {};

        var canvasWidth = myEditor.canvas.width;
        var canvasHeight = myEditor.canvas.height;

        //Invert coordinates if we're drawing bottom to top and/or left to right;
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
        myEditor.canvasContext.fillStyle = "rgba(255,255,255,0.4)";
        myEditor.canvasContext.fillRect(0, 0, args.x, canvasHeight);
        myEditor.canvasContext.beginPath();
        myEditor.canvasContext.fillRect(args.x + args.width, 0, canvasWidth - args.x - args.width, canvasHeight);
        myEditor.canvasContext.beginPath();
        myEditor.canvasContext.fillRect(args.x, 0, args.width, args.y);
        myEditor.canvasContext.beginPath();
        myEditor.canvasContext.fillRect(args.x, args.y + args.height, args.width, canvasHeight - args.height - args.y);

    }

    function crop(topLeftX = cropBoxControls.topLeft.x,
                  topLeftY = cropBoxControls.topLeft.y,
                  bottomRightX = cropBoxControls.bottomRight.x,
                  bottomRightY = cropBoxControls.bottomRight.y) {
        myEditor.crop({
            x: topLeftX,
            y: topLeftY,
            width: Math.abs(bottomRightX - topLeftX),
            height: Math.abs(bottomRightY - topLeftY)
        })
    }

    function detectCropBoxDragControls(x, y) {
        var hasControl = false;
        Object.keys(cropBoxControls).forEach((box) => {
            var control = cropBoxControls[box];
            var isY = y <= control.y + 5 && y >= control.y - 5;
            var isX = x <= control.x + 5 && x >= control.x - 5;
            control.active = isY && isX;
            hasControl = hasControl || (isY && isX);
        });
        return hasControl;
    }

    function endCrop(e) {
        //console.log("end crop " + e.offsetX + " : " + e.offsetY);

        if (e.clientX && e.clientY) {
            setAppState({
                mouseEndX: parseInt(e.offsetX, 10) - appState.mouseStartX,
                mouseEndY: parseInt(e.offsetY, 10) - appState.mouseStartY,
                activeDragControl: null,
                withCropBoxControl: false
            });

            // if (appState.isCropping) {
            //     myEditor.crop({
            //         x: (appState.mouseEndX > 0) ? (appState.mouseStartX - appState.offset.left) : (parseInt(e.offsetX, 10) - appState.offset.left),
            //         y: (appState.mouseEndY > 0) ? (appState.mouseStartY - appState.offset.top) : (parseInt(e.offsetY, 10) - appState.offset.top),
            //         width: Math.abs(appState.mouseEndX),
            //         height: Math.abs(appState.mouseEndY)
            //     })
            // }
        }
        // clear the crop flag
        // setAppState({isCropping: false, isCropMode: false});
        setAppState({isCropping: false})
    }

    function redo() {
        myEditor.redo();
    }

    function rotate(event) {
        var num = parseFloat(event.currentTarget.value);
        var deg = (num / Math.abs(num)) * 90;// just doing a 90 deg rotate for now;
        var rad = isNaN(deg) ? 0 : (deg * Math.PI / 180) + appState.rotation;
        event.stopPropagation();
        myEditor.rotate(rad);
        myEditor.saveState();
    }

    function save(event) {
        event.stopPropagation();
        saveButton.href = myEditor.save();
        saveButton.download = myEditor.fileName;
    }

    function saveState(event) {
        event.preventDefault();
        myEditor.saveState();
    }

    function scaleReset(event) {
        event.stopPropagation();
        myEditor.scale(100);
    }

    function scalePic(event) {
        event.stopPropagation();
        myEditor.scale(event.target.value);
    }

    function setActiveControlSet(event) {
        var id = event.currentTarget.value;
        setAppState({
            activeControlSet: id,
            offset: getOffset(myEditor.canvas),
            isCropMode: (event.currentTarget.id === "toolSwitchCrop")
        });
    }

    function startCrop(e) {
        // //console.log("start crop " + e.clientX + " : " + e.clientY);
        // if (appState.isCropMode) {
        //     setAppState({
        //         isCropping: true,
        //         mouseStartX: parseInt(e.clientX, 10),
        //         mouseStartY: parseInt(e.clientY, 10)
        //     });
        // }
        //console.log("start crop " + e.offsetX + " : " + e.offsetY);
        if (appState.isCropMode) {
            let withCropBoxControl = detectCropBoxDragControls(parseInt(e.offsetX, 10), parseInt(e.offsetY, 10));
            let activeDragControl = Object.keys(cropBoxControls).filter(key => cropBoxControls[key].active)[0];

            setAppState({
                isCropping: true,
                activeDragControl,
                mouseStartX: parseInt(e.offsetX, 10),
                mouseStartY: parseInt(e.offsetY, 10),
                withCropBoxControl
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
        myEditor.zoom(parseInt(event.currentTarget.value, 10));
    }

    resetAppState();

    fileInput.addEventListener("change", addPic);
    scaleControl.addEventListener("input", scalePic);
    scaleControl.addEventListener("blur", saveState);
    undoControl.addEventListener("click", undo);
    redoControl.addEventListener("click", redo);
    resetScaleButton.addEventListener("click", scaleReset);
    cropControl.addEventListener("click", cropButtonClick);
    saveButton.addEventListener("click", save);
    rotateLeft.addEventListener("click", rotate);
    rotateRight.addEventListener("click", rotate);
    clearImageControl.addEventListener("click", startOver);
    zoomControl.addEventListener("input", zoomPic);
    zoom50Button.addEventListener("click", zoomPic);
    zoom100Button.addEventListener("click", zoomPic);
    zoom200Button.addEventListener("click", zoomPic);
    zoom500Button.addEventListener("click", zoomPic);
    switchButtons.forEach(b => {
        b.addEventListener("click", setActiveControlSet);
    });

    if (isAdvancedUpload) {
        workspace.addEventListener("drop", addPic);
        uploadInstructions.className += " has-advanced-upload";
        workspace.addEventListener("dragover", dragStart);
        workspace.addEventListener("dragend", dragEnd);
        workspace.addEventListener("dragleave", dragEnd);
    }
}(stateRules));
