/*
 * Remove undefined keys and return a POJO;
 */
function _prune(obj) {
    obj = (typeof obj === "object") ? obj : {};
    return Object.keys(obj).reduce((pojo, key) => {
        if (typeof obj[key] !== 'undefined') {
            pojo[key] = obj[key];
        }
        return pojo;
    }, {});
}


export class AppState {
    mouseStartX;
    mouseStartY;
    mouseEndX;
    mouseEndY;
    offset;
    canvasWidth;
    canvasHeight;
    isCropping;
    isCropMode;
    scale;
    rotation;
    zoom;
    isLastHistory;
    isFirstHistory;
    hasPhoto;
    isDragging;
    spinnerIsVisible;

    constructor(state) {
        state = state || {};
        this.mouseStartX = state.mouseStartX || null;
        this.mouseStartY = state.mouseStartY || null;
        this.mouseEndX = state.mouseEndX || null;
        this.mouseEndY = state.mouseEndY || null;
        this.offset = state.offset || null;
        this.canvasWidth = state.canvasWidth || null;
        this.canvasHeight = state.canvasHeight || null;
        this.scale = state.scale || 1;
        this.rotation = state.rotation || 0;
        this.zoom = state.zoom || 100;
        this.isCropping = (!!state.isCropping === state.isCropping) ? state.isCropping : false;
        this.isCropMode = (!!state.isCropMode  === state.isCropMode ) ? state.isCropMode  : false;
        this.isLastHistory = (!!state.isLastHistory === state.isLastHistory) ? state.isLastHistory : true;
        this.isFirstHistory = (!!state.isFirstHistory === state.isFirstHistory) ? state.isFirstHistory : true;
        this.hasPhoto = (!!state.hasPhoto === state.hasPhoto) ? state.hasPhoto : false;
        this.isDragging = (!!state.isDragging === state.isDragging) ? state.isDragging : false;
        this.spinnerIsVisible = (!!state.spinnerIsVisible === state.spinnerIsVisible) ? state.spinnerIsVisible : false;
    }

    prune() {
        return _prune(this);
    }

    static merge(state1, state2) {
        return new AppState(Object.assign(_prune(state1), _prune(state2)));
    }

    static create(state) {
        return new AppState(state || {});
    }
}

